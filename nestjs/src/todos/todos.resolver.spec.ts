import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosArgs } from './dto/todos.args';
import { TodosResolver } from './todos.resolver';
import { TodosService } from './todos.service';

const fakeTodos = [
  {
    id: 0,
    name: 'first todo',
    completed: false,
    sort: 0,
  },
  {
    id: 1,
    name: 'second todo',
    completed: false,
    sort: 1,
  },
];

describe('InvoiceResolver', () => {
  let resolver: TodosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosResolver,
        {
          provide: TodosService,
          useFactory: () => ({
            create: jest.fn((todo: CreateTodoDto) => ({
              id: '1234',
              ...todo,
            })),
            findOneById: jest.fn((id: string) => fakeTodos[0]),
            findAll: jest.fn((todoArgs: TodosArgs) => fakeTodos),
            remove: jest.fn((id: string) => true),
          }),
        },
      ],
    }).compile();

    resolver = module.get<TodosResolver>(TodosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create and return a todo', () => {
  //     expect(true).toBe(true);
  //   });
  // });

  // describe('fineOneById', () => {
  //   it('should find and return a todo by id', () => {
  //     expect(true).toBe(true);
  //   });
  // });

  // describe('findAll', () => {
  //   it('should find and return all todos', () => {
  //     expect(true).toBe(true);
  //   });
  // });

  // describe('remove', () => {
  //   it('should remove a todo by id and return boolean', () => {
  //     expect(true).toBe(true);
  //   });
  // });
});
