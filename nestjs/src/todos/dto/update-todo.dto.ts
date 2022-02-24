import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateTodoDto {
  @Field()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @MaxLength(60)
  name?: string;

  @Field((type) => Boolean, { nullable: true })
  @IsBoolean()
  completed?: boolean;

  @Field((type) => Int, { nullable: true })
  @IsNumber()
  sort?: number;
}
