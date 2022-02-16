import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTodoDto } from '../src/todos/dto/create-todo.dto';
import { TodosArgs } from '../src/todos/dto/todos.args';
import { TodosService } from '../src/todos/todos.service';

const fakeTodos = [
  {
    id: '0',
    name: 'first todo',
    completed: false,
    sort: 0,
  },
  {
    id: '1',
    name: 'second todo',
    completed: false,
    sort: 1,
  },
];

const todosServiceMock = {
  create: jest.fn((todo: CreateTodoDto) => ({
    id: '0',
    ...todo,
  })),
  update: jest.fn((todo: CreateTodoDto) => todo),
  findOneById: jest.fn((id: string) => fakeTodos[0]),
  findAll: jest.fn((todoArgs: TodosArgs) => fakeTodos),
  remove: jest.fn((id: string) => false),
};

describe('TodosResolver e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TodosService)
      .useValue(todosServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const gql = '/graphql';

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('create', () => {
    const { completed, name, sort } = fakeTodos[0];
    it('should create and return a todo', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation {createTodo(newTodoData: {name: "${name}", sort: ${sort}, completed: ${completed}}) {id, name, completed, sort}}`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createTodo).toEqual(fakeTodos[0]);
        });
    });
  });

  describe('update', () => {
    const { id, completed, name, sort } = fakeTodos[0];
    it('should update and return a todo', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation {updateTodo(updateTodoData: {id: "${id}", name: "${name}", sort: ${sort}, completed: ${completed}}) {id, name, completed, sort}}`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateTodo).toEqual(fakeTodos[0]);
        });
    });
  });

  describe('fineOneById', () => {
    it('should find and return a todo by id', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{ todo(id: "0") { id, name, completed, sort } }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.todo).toEqual(fakeTodos[0]);
        });
    });
  });

  describe('findAll', () => {
    it('should find and return all todos', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `query { todos { id, name, completed, sort } }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.todos).toEqual(fakeTodos);
        });
    });
  });

  describe('remove', () => {
    it('should remove a todo by id and return boolean', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation{removeTodo(id:"0")}`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.removeTodo).toEqual(false);
        });
    });
  });
});
