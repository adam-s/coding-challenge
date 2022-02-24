import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { TodosArgs } from './dto/todos.args';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

const pubSub = new PubSub();

@Resolver((of) => Todo)
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query((returns) => Todo)
  async todo(@Args('id') id: string): Promise<Todo> {
    const todo = await this.todosService.findOneById(id);
    if (!todo) {
      throw new NotFoundException(id);
    }
    return todo;
  }

  @Query((returns) => [Todo])
  todos(@Args() todoArgs: TodosArgs): Promise<Todo[]> {
    return this.todosService.findAll(todoArgs);
  }

  @Mutation((returns) => Todo)
  async createTodo(
    @Args('newTodoData') newTodoData: CreateTodoDto,
  ): Promise<Todo> {
    const todo = await this.todosService.create(newTodoData);
    // pubSub.publish('todoCreated', { todoCreated: todo });
    return todo;
  }

  @Mutation((returns) => Todo)
  async updateTodo(
    @Args('updateTodoData') updateTodoData: UpdateTodoDto,
  ): Promise<Todo> {
    const todo = await this.todosService.update(updateTodoData);
    return todo;
  }

  @Mutation((returns) => Boolean)
  async removeTodo(@Args('id') id: string) {
    return this.todosService.remove(id);
  }

  @Subscription((returns) => Todo)
  todoCreated() {
    return pubSub.asyncIterator('todoCreated');
  }
}
