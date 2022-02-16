import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class UpdateTodoDto {
  @Field()
  id: string;

  @Field({ nullable: true })
  @MaxLength(60)
  name?: string;

  @Field((type) => Boolean, { nullable: true })
  completed?: boolean;

  @Field((type) => Int, { nullable: true })
  sort?: number;
}
