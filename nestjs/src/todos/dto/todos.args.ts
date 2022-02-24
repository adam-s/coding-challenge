import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class TodosArgs {
  @Field((type) => Int, { defaultValue: 1 })
  @Min(1)
  page = 1;

  @Field((type) => Int, { defaultValue: 25 })
  @Min(1)
  limit = 25;
}
