import { faker } from '@faker-js/faker/locale/pt_BR';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cpf } from 'cpf-cnpj-validator';
import { Pagination } from 'nestjs-typeorm-paginate';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { Address } from 'src/address/entities/address.entity';
import { SortingType, ValidType } from 'src/common/Enums';
import { Utils } from 'src/common/Utils';
import { CustomDate } from 'src/common/custom.date';
import { CodeRecoverInterface } from 'src/common/interfaces/email.interface';
import { UserFake } from 'src/common/interfaces/fake.interface';
import { RecoverInterface } from 'src/common/interfaces/recover.interface';
import { customPagination } from 'src/common/pagination/custom.pagination';
import { Validations } from 'src/common/validations';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { ProfileService } from './../profile/profile.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Qrcode2fa } from './dto/qrcode.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUser } from './dto/user.filter';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {



  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly ProfileService: ProfileService,
    private readonly profileService: ProfileService,
    private readonly mailservice: MailService,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,


  ) { }


  //? No errors 
  async create(createUserDto: CreateUserDto): Promise<any> {

    try {

      const {
        user_name,
        user_profile_id: profile_id,
        user_email,
        user_password,
        user_date_of_birth,

      } = createUserDto

      if (user_name.trim() == '' || user_name == undefined) {
        throw new BadRequestException(`O nome não pode estar vazio`)
      }

      if (user_email.trim() == '' || user_email == undefined) {
        throw new BadRequestException(`O email não pode estar vazio`)
      }

      const user = this.userRepository.create(createUserDto)

      user.user_name = user_name.toUpperCase()

      Validations.getInstance().validateWithRegex(
        user.user_name,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER,
        ValidType.IS_STRING
      )

      Validations.getInstance().validateWithRegex(
        user.user_email,
        ValidType.IS_EMAIL,
        ValidType.NO_SPACE
      )

      Validations.getInstance().verifyLength(
        user.user_name, 'Name', 5, 40
      )

      const userIsRegistered = await this.findByName(user.user_name)

      if (userIsRegistered) {
        throw new BadRequestException(`user already registered`)
      }

      const emailIsRegistered = await this.findByEmail(user.user_email)

      if (emailIsRegistered) {
        throw new BadRequestException(`email already registered`)
      }

      user.user_password = await Utils.getInstance().encryptPassword(user_password)

      const profile = await this.profileService.findById(profile_id)

      user.profile = profile
      user.status = true
      user.user_first_access = true
      user.setTwoFactorSecret()
      user.user_enrollment = Utils.getInstance().getEnrollmentCode()
      user.user_2fa_active = false


      const dateParts = user_date_of_birth.split("/");
      user.user_date_of_birth = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

      const userSaved = this.userRepository.save(user)


    } catch (error) {
      this.logger.warn(`createUser error: ${error.message}`, error.stack);
      throw error
    }

  }

  //^ No errors and tested 
  async findAll(filter: FilterUser): Promise<Pagination<UserEntity>> {

    try {
      const { sort, orderBy, user_name, showActives, limit, page, route } = filter;

      const userQueryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.address', 'address')
        .select([
          'user.user_id',
          'user.user_name',
          'user.user_email',
          'user.user_date_of_birth',
          'user.user_phone',
          'user.user_enrollment',
          'user.user_status',
          'user.create_at',
          'user.update_at',

        ])
        .addSelect([
          'profile.profile_name'
        ])
        .addSelect([
          'address.address_id',
          'address.address_city',
          'address.address_district',
          'address.address_home_number',
          'address.address_state',
          'address.address_street',
          'address.address_zipcode',
        ])


      if (showActives === "true") {
        userQueryBuilder.andWhere('user.user_status = true');
      } else if (showActives === "false") {
        userQueryBuilder.andWhere('user.user_status = false');
      }


      if (user_name) {
        userQueryBuilder.andWhere(`user.user_name LIKE :user_name`, {
          user_name: `%${user_name}%`
        });
      }
      if (orderBy == SortingType.DATE) {
        userQueryBuilder.orderBy('user.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        userQueryBuilder.orderBy('user.user_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }

      //^ Calcular o ponto de início (offset) para a paginação
      const skip = (page - 1) * limit;

      //^ Configurar a paginação na consulta
      userQueryBuilder.skip(skip).take(limit);

      //^ Realizar a consulta com paginação
      const [result, total] = await userQueryBuilder.getManyAndCount();

      //^ Chamar a função de paginação com os resultados e a contagem total
      return customPagination(result, page, limit, total, route, sort, orderBy);


    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }
  }

  //? No errors 
  async findByEmail(email: string) {
    try {
      return this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_email = :user_email', { user_email: email })
        .getOne()

    } catch (error) {
      this.logger.error(`findByEmail error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async findUserByEmail(email: string) {

    try {

      const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_email = :user_email', { user_email: email })
        .getOne()




      return user

    } catch (error) {
      this.logger.error(`findByEmail error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async getCurrentUser(id: string): Promise<UserEntity> {
    try {

      const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.address', 'address')
        .leftJoinAndSelect('user.psychologist', 'psychologist')
        .where('user.user_id = :user_id', { user_id: id })
        .getOne()

      const currentProfile = user.profile
      const currentAddress = user.address

      return user

    } catch (error) {
      this.logger.error(`findById error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async findById(id: string): Promise<UserEntity> {

    try {

      const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_id = :user_id', { user_id: id })
        .getOne()


      return user

    } catch (error) {
      this.logger.error(`findById error: ${error.message}`, error.stack)
      throw error
    }

  }

  //? No errors 
  async findByName(name: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          user_name: name
        }
      })

      return user

    } catch (error) {
      this.logger.error(`findByName error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {

    try {

      const {
        user_name,
        user_email,
        user_profile_id: profile_id,
        user_date_of_birth,
        user_phone,
        user_genre,
        user_cpf,
        user_rg,
        psychologist_id
      } = updateUserDto


      const isRegistered = await this.findById(id)


      if (!isRegistered) {
        throw new NotFoundException(`User does not exist`)
      }

      const user = await this.userRepository.preload({
        user_id: id,
        ...updateUserDto
      })

      if (user_name) {

        user.user_name = user_name.toUpperCase()

        Validations.getInstance().validateWithRegex(
          user.user_name,
          ValidType.NO_MANY_SPACE,
          ValidType.NO_SPECIAL_CHARACTER,
          ValidType.IS_STRING
        )

        Validations.getInstance().verifyLength(
          user.user_name, 'Name', 5, 40)

      }

      if (user_email) {

        user.user_email = user_email

      }

      if (profile_id) {

        const profile = await this.profileService.findById(profile_id)

        if (!profile) {
          throw new NotFoundException(`Perfil não encontrado`)
        }
        user.profile = profile
      }

      if (user_phone) {
        user.user_phone = user_phone
      }

      if (user_cpf) {
        user.user_cpf = user_cpf
      }

      if (user_rg) {
        user.user_rg = user_rg
      }

      const [day, month, year] = user_date_of_birth.split("/")

      user.user_date_of_birth = new Date(+year, +month - 1, +day)



      await this.userRepository.save(user)

      return this.findById(id)

    } catch (error) {
      this.logger.error(`updateUser error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async deleteUser(id: string) {

    const isRegistered = await this.userRepository.findOne({
      where: {
        user_id: id
      }
    })


    if (!isRegistered) {
      throw new NotFoundException(`User does not exist`)
    }

    await this.userRepository.remove(isRegistered)


  }

  //? No errors 
  async changeStatus(id: string) {

    try {

      const userSaved = await this.findById(id)

      if (!userSaved) {
        throw new NotFoundException(`User does not exist`)
      }

      const { status: status } = userSaved

      console.log(userSaved);


      userSaved.status = status === true ? false : true

      return this.userRepository.save(userSaved)

    } catch (error) {
      this.logger.error(`changeStatus error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async updateRefreshToken(id: string, refresh_token: string) {

    try {

      const user = await this.userRepository.findOne({
        where: {
          user_id: id
        }
      })

      if (!user) {
        throw new NotFoundException(`user with id ${id} does not exist`)
      }

      user.user_refresh_token = refresh_token

      await this.userRepository.save(user)

    } catch (error) {
      this.logger.error(`updateRefreshToken error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async changeFirstAccess(id: string) {

    try {

      const userSaved = await this.userRepository.findOne({
        where: {
          user_id: id
        }
      })

      if (!userSaved) {
        throw new NotFoundException(`user with id ${id} does not exist`)
      }

      const { user_first_access: status } = userSaved

      if (status) {

        userSaved.user_first_access = false

        await this.userRepository.save(userSaved)

        return {
          Status: 'Success',
          Message: 'first access status successfully modified'
        }
      }

      return {
        Status: 'Fail',
        Message: 'This is not the first login since this user'
      }

    } catch (error) {
      this.logger.error(`changeFirstAccess error: ${error.message}`, error.stack)
      throw error
    }

  }

  //? No errors 
  async resetPassword(recover: RecoverInterface) {

    try {

      const { code, password, email } = recover

      const user = await this.userRepository.findOne({
        where: {
          user_email: email,
          user_recovery_code: code
        }
      })

      if (!user) {
        throw new BadRequestException(`O código: ${code} não é válido!`)
      }

      user.user_password = await Utils.getInstance().encryptPassword(password)
      user.user_recovery_code = null

      this.userRepository.save(user)

    } catch (error) {
      this.logger.error(`resetPass error: ${error.message}`, error.stack)
      throw error
    }
  }

  //? No errors 
  async haveAdmin(name: string) {

    try {

      const admin = await this.userRepository.findOne({
        where: {
          user_name: name.toUpperCase()
        }
      })

      if (admin) {
        return true
      } else {
        return false
      }

    } catch (error) {
      this.logger.error(`haveAdmin error: ${error.message}`, error.stack)
      throw error
    }

  }

  //? No errors 
  async recoverCode(email: string) {

    try {
      const user = await this.findByEmail(email)


      if (!user) {
        throw new NotFoundException(`O email informado é inválido!`)
      }


      const currentDate = CustomDate.getInstance()
        .getNewDateInTheAmazonTimeZone().sql_date


      const code = this.generateCode()

      user.user_recovery_code = code
      user.user_recovery_date = new Date()


      await this.userRepository.save(user)

      const codeRecover: CodeRecoverInterface = {
        name: user.user_name,
        code: code,
        email: user.user_email
      }

      this.mailservice.sendMail(codeRecover)

      setTimeout(async () => {
        await this.clearCode(user)
      }, 5 * 60 * 1000)



    } catch (error) {
      this.logger.error(`recoverCode error: ${error.message}`, error.stack);
      throw error
    }


  }

  //? No errors 
  async clearCode(user: UserEntity) {
    user.user_recovery_code = null
    await this.userRepository.save(user)
  }

  //? No errors 
  generateCode() {
    const minNumber = 100000;
    const maxNumber = 999999;

    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    return randomNumber
  }

  //? No errors 
  async generate2FAQRCode(user_id: string): Promise<string> {

    const user = await this.userRepository.findOne({
      where: {
        user_id: user_id
      }
    })

    const otpauth = speakeasy.otpauthURL({
      secret: user.user_2fa_secret,
      label: `Thunnar:${user.user_email}`,
      algorithm: 'sha1'
    });

    return QRCode.toDataURL(otpauth);
  }

  //? No errors 
  async generate2fa(user_id: string, qrcode2fa: Qrcode2fa) {
    try {
      const { status } = qrcode2fa

      const user = await this.userRepository.findOne({
        where: {
          user_id: user_id
        }
      })

      status ? user.setTwoFactorSecret() : user.user_2fa_secret = ''
      user.user_2fa_active = status

      await this.userRepository.save(user)

      const customPromisse = new Promise((resolve) => {
        if (status === true) {
          resolve(this.generate2FAQRCode(user_id))
        } else {
          resolve('Authenticação de dois fatores desabilitada')
        }
      })

      return customPromisse

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Erro ao tentar gerar 2FA',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  //? No errors 
  async generatedUserFake(quantity: number) {

    let persons = []

    for (let index = 0; index <= quantity; index++) {

      const genero = Math.random() > 0.5 ? 'male' : 'female';
      const emailLocalPart = faker.internet.userName().toLowerCase();

      const person: UserFake = {
        user_name: faker.person.fullName({ sex: `${genero}` })
          .replace(/(Sra\.|Dr\.)\s?/g, "")
          .replace(/[^a-zA-ZáéíóúÁÉÍÓÚãõÃÕâêîôûÂÊÎÔÛçÇ -]/g, ""),
        user_email: `${emailLocalPart}@gmail.com`,
        user_phone: faker.phone.number(),
        user_password: faker.internet.password(),
        user_profile_id: 2,
        user_date_of_birth: faker.date.between({ from: new Date('1923-01-01'), to: new Date('2019-12-31') }).toISOString().split('T')[0],
        user_genre: genero === 'male' ? 'MALE' : 'FEMALE',
        user_cpf: cpf.generate(),
        user_rg: faker.number.int({ min: 4444, max: 99999 }).toString()
      }


    }


    return persons
  }


}




