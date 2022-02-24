import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'todo' })
export class Todo {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((type) => Boolean, { defaultValue: false })
  completed: boolean;

  @Field((type) => Int, { defaultValue: 0 })
  sort: number;
}
