import * as express from 'express';
import fs from 'fs';
import request from 'supertest';
import { app, server } from '../src/index';
import { Connection, getConnection } from 'typeorm';
import { createImportSpecifier } from 'typescript';

describe('Jest should be wired up', () => {
  it('should test 1 is really that', () => {
    expect(1).toBe(1);
  });
});

describe('REST API requests', () => {
  let connection: Connection;
  beforeAll(async () => {
    // const todoConnection = getConnection(); // Leave here might need to get hands dirty with the connection instance
    try {
      const dbLocation = __dirname + '/../todo.db';
      const originalDbLocation = __dirname + '/../todo_original.db';
      try {
        fs.unlinkSync(dbLocation);
      } catch (err) {}
      fs.copyFileSync(originalDbLocation, dbLocation);
    } catch (err) {
      console.log(err);
      process.exit();
    }
    // Um, yeah, need to await for the connection to the db :shrug
    // Given time this would be configured and architected differently with proper TypeORM configuration files
    await new Promise((resolve) =>
      server.on('listening', () => {
        connection = getConnection();
        resolve(null);
      })
    );
  });

  afterAll(() => {
    connection.close();
    server.close();
  });

  it('gets todos', (done) => {
    request(app)
      .get('/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res: request.Response) {
        if (err) throw err;
        expect(res.body.todos.length).toBe(6);
        done();
      });
  });

  it('creates a todo', (done) => {
    const data = {
      completed: false,
      sort: 5,
      name: 'Finish coding challenges',
    };
    request(app)
      .post('/todos')
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .end(function (err, res: request.Response) {
        if (err) throw err;
        expect(res.body.todo).toEqual({ ...data, id: 7 });
        done();
      });
  });

  it('toggles todo complete field', (done) => {
    const data = {
      completed: false,
      sort: 5,
      name: 'Finish coding challenges',
      id: 1,
    };
    request(app)
      .put('/todos/1')
      .send(data)
      .expect(201)
      .end((err, res: request.Response) => {
        if (err) throw err;
        expect(res.body.todo).toEqual(data);
        done();
      });
  });

  it.skip('updates a todos order', (done) => {
    // Interesting. How to update all the sort orders of the todos using RESTFUL?
    request(app)
      .put('/todos')
      .send({
        id: 1,
      })
      .expect(200)
      .end((err, res: request.Response) => {
        if (err) throw err;
        expect(res.body).toEqual({});
        done();
      });
  });
});
