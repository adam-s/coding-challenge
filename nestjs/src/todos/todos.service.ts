import { Injectable } from '@nestjs/common';
import { UpdateTodoDto } from './dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosArgs } from './dto/todos.args';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  async create(data: CreateTodoDto): Promise<Todo> {
    return {} as any;
  }

  async update(data: UpdateTodoDto): Promise<Todo> {
    return {} as any;
  }

  async findOneById(id: string): Promise<Todo> {
    return {} as any;
  }

  async findAll(todoArgs: TodosArgs): Promise<Todo[]> {
    return [] as Todo[];
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}
