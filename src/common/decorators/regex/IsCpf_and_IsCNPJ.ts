// common/validations.ts
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class CnpjValidation implements ValidatorConstraintInterface {
    private static instance: CnpjValidation;

    private constructor() { } // O construtor é privado para evitar instanciação direta

    static getInstance(): CnpjValidation {
        if (!CnpjValidation.instance) {
            CnpjValidation.instance = new CnpjValidation();
        }
        return CnpjValidation.instance;
    }

    validate(cnpj: string, args: ValidationArguments) {
        if (!cnpj) return true; // Validação é pulada se o valor for nulo ou indefinido

        // Remove caracteres não numéricos
        const cleanCNPJ = cnpj.replace(/[^\d]+/g, '');

        // Verifica se o CNPJ possui 14 dígitos
        if (cleanCNPJ.length !== 14) return false;

        // Verifica se todos os dígitos são iguais (inválido)
        if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

        // Validação dos dígitos verificadores
        let length = cleanCNPJ.length - 2;
        let numbers = cleanCNPJ.substring(0, length);
        const digits = cleanCNPJ.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += Number(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result != Number(digits.charAt(0))) return false;

        length = length + 1;
        numbers = cleanCNPJ.substring(0, length);
        sum = 0;
        pos = length - 7;
        for (let i = length; i >= 1; i--) {
            sum += Number(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        return result == Number(digits.charAt(1));
    }


    defaultMessage(args: ValidationArguments) {
        return 'CNPJ inválido';
    }
}

@ValidatorConstraint({ async: true })
export class CpfValidation implements ValidatorConstraintInterface {
    private static instance: CpfValidation;

    private constructor() { } // O construtor é privado para evitar instanciação direta

    static getInstance(): CpfValidation {
        if (!CpfValidation.instance) {
            CpfValidation.instance = new CpfValidation();
        }
        return CpfValidation.instance;
    }

    validate(cpf: string, args: ValidationArguments) {
        if (!cpf) return true; // Validação é pulada se o valor for nulo ou indefinido

        // Remove caracteres não numéricos
        const cleanCPF = cpf.replace(/[^\d]+/g, '');

        // Verifica se o CPF possui 11 dígitos
        if (cleanCPF.length !== 11) return false;

        // Verifica se todos os dígitos são iguais (inválido)
        if (/^(\d)\1+$/.test(cleanCPF)) return false;

        // Função para calcular um dígito verificador
        function calculateDigit(cpf: string, factor: number): number {
            let sum = 0;
            for (const digit of cpf) {
                if (factor > 1) sum += parseInt(digit) * factor--;
            }
            const remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        }

        // Calcula e verifica os dígitos verificadores
        const digit1 = calculateDigit(cleanCPF.substring(0, 9), 10);
        const digit2 = calculateDigit(cleanCPF.substring(0, 9) + digit1, 11);

        return digit1 === Number(cleanCPF.charAt(9)) && digit2 === Number(cleanCPF.charAt(10));
    }


    defaultMessage(args: ValidationArguments) {
        return 'CPF inválido';
    }
}
