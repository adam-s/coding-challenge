import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Todo } from './entities/todo.entity';

@ObjectType({ description: 'paginated todos' })
export class PaginatedTodos {
  @Field((type) => [Todo])
  data: Todo[];

  @Field((type) => Boolean)
  hasNextPage: boolean;
}
