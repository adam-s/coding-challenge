import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateTodoDto {
  @Field()
  @MaxLength(60)
  name: string;

  @Field((type) => Boolean, { defaultValue: false })
  completed: boolean;

  @Field((type) => Int, { defaultValue: 0 })
  sort: number;
}
