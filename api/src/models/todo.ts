import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name: string;

  @Column("boolean")
  completed: boolean = false;

  @Column("integer")
  sort: number = 0;
}
