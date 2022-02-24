import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Todo } from 'src/todos/entities/todo.entity';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const countUser = await connection
      .createQueryBuilder()
      .select()
      .from(Todo, 'Todo')
      .getCount();

    if (countUser === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Todo)
        .values([
          plainToClass(Todo, {
            name: 'Get all contingencies squared away',
            sort: 0,
          }),
          plainToClass(Todo, {
            name: 'Clear the title',
            sort: 1,
          }),
          plainToClass(Todo, {
            name: 'Get final mortgage approval',
            sort: 2,
          }),
          plainToClass(Todo, {
            name: 'Review your closing disclosure',
            sort: 3,
          }),
          plainToClass(Todo, {
            name: 'Do a final walk-through',
            sort: 4,
          }),
          plainToClass(Todo, {
            name: 'Bring the necessary documentation to closing',
            sort: 5,
          }),
        ])
        .execute();
    }
  }
}
