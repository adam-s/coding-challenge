import * as request from 'supertest';
import { APP_URL } from '../utils/constants';

const GQL_ENDPOINT = '/graphql';

describe('Todos (e2e)', () => {
  it('should create and return a todo', () => {
    const todo = {
      id: '7',
      name: 'first todo',
      completed: false,
      sort: 0,
    };
    return request(APP_URL)
      .post(GQL_ENDPOINT)
      .send({
        query: `mutation {createTodo(newTodoData: {name: "${todo.name}", sort: ${todo.sort}, completed: ${todo.completed}}) {id, name, completed, sort}}`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createTodo).toEqual(todo);
      });
  });

  it('should update and return a todo', () => {
    const todo = {
      id: '7',
      name: 'first todo',
      completed: false,
      sort: 0,
    };

    const name = 'updated todo';

    return request(APP_URL)
      .post(GQL_ENDPOINT)
      .send({
        query: `mutation {updateTodo(updateTodoData: {id: "${todo.id}", name: "${name}", sort: ${todo.sort}, completed: ${todo.completed}}) {id, name, completed, sort}}`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updateTodo.name).toEqual(name);
      });
  });

  it('should find and return a todo by id', () => {
    const todo = {
      id: '7',
      name: 'updated todo',
      completed: false,
      sort: 0,
    };

    return request(APP_URL)
      .post(GQL_ENDPOINT)
      .send({
        query: `query {
          todo(id: "${todo.id}") { id, name, completed, sort } 
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.todo).toEqual(todo);
      });
  });

  it('should find and return all todos', () => {
    return request(APP_URL)
      .post(GQL_ENDPOINT)
      .send({
        query: `query {
          todos { data { id, name, completed, sort } }
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.todos).toMatchSnapshot();
      });
  });
});
