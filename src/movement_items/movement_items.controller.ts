import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovementItemsService } from './movement_items.service';
import { CreateMovementItemDto } from './dto/create-movement_item.dto';
import { UpdateMovementItemDto } from './dto/update-movement_item.dto';

@Controller('movement-items')
export class MovementItemsController {
  constructor(private readonly movementItemsService: MovementItemsService) {}

  @Post()
  create(@Body() createMovementItemDto: CreateMovementItemDto) {
    return this.movementItemsService.create(createMovementItemDto);
  }

  @Get()
  findAll() {
    return this.movementItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovementItemDto: UpdateMovementItemDto) {
    return this.movementItemsService.update(+id, updateMovementItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementItemsService.remove(+id);
  }
}
