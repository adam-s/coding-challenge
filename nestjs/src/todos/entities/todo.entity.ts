import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { EntityHelper } from 'src/utils/entity-helper';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
@ObjectType({ description: 'todo' })
export class Todo extends EntityHelper {
  @PrimaryGeneratedColumn('identity')
  @Field((type) => ID)
  id: string;

  @Column('text')
  @Field()
  name: string;

  @Column('boolean')
  @Field((type) => Boolean, { defaultValue: false })
  completed = false;

  @Column('integer')
  @Field((type) => Int, { defaultValue: 0 })
  sort = 0;
}
