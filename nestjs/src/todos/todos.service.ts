import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from './dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosArgs } from './dto/todos.args';
import { Todo } from './entities/todo.entity';
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    return this.todosRepository.save(
      this.todosRepository.create(createTodoDto),
    );
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.todosRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<Todo>) {
    return this.todosRepository.findOne({
      where: fields,
    });
  }

  async update(updateTodoDto: UpdateTodoDto) {
    const { id } = updateTodoDto;
    const result = await this.todosRepository.update(id, updateTodoDto);
    return this.findOne({ id });
  }

  async softDelete(id: string): Promise<void> {
    await this.todosRepository.softDelete(id);
  }
}
