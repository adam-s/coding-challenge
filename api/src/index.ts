import express from 'express';
import http from 'http';
import cors from 'cors';
import {
  Connection,
  createConnection,
  getConnection,
  getManager,
  QueryFailedError,
} from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Todo } from './models/todo';
import { validate } from 'class-validator';

export const app = express();
const port = process.env.PORT || 5000;
export const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = (connection: Connection) => {
  const todoRepository = connection.getRepository(Todo);

  app.get('/todos', async (req, res) => {
    const todos = await todoRepository.find({
      order: {
        sort: 'ASC',
      },
    });
    res.send({ todos });
  });

  // Create
  app.post('/todos', async (req, res) => {
    let model = Todo.create(req.body);
    const errors = await validate(model);
    if (errors.length > 0) {
      console.log(errors);
      return res.status(400).send({ message: errors[0] });
    }
    model = await Todo.save(model);
    // What's the point of having a spinner if you don't slow things down a bit?
    setTimeout(() => {
      res.status(201).send({ todo: model });
    }, 500);
  });

  // Update
  app.put('/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    let model = Todo.create(req.body as Todo);
    const errors = await validate(model);
    if (errors.length > 0) {
      console.log(errors);
      return res.status(400).send({ message: errors[0] });
    }
    model.id = id;
    model = await Todo.save(model);
    setTimeout(() => {
      res.status(201).send({ todo: model });
    }, 500);
  });

  // Reorder
  app.post('/todos/reorder', async (req, res) => {
    if (!req.body || !Array.isArray(req.body)) {
      return res.status(400).send({ success: false });
    }
    try {
      if (Math.random() > 0.5) throw new Error('Bad luck. Try again.');
      await connection
        .createQueryBuilder()
        .insert()
        .into(Todo)
        .values(req.body)
        .onConflict(`("id") DO UPDATE SET "sort" = excluded."sort"`)
        .execute();
      setTimeout(() => {
        res.status(201).send({ success: false });
      }, 500);
    } catch (error) {
      return res.status(400).send({ success: false });
    }
  });
};

createConnection({
  type: 'sqlite',
  database: `${__dirname}/../todo.db`,
  logging: true,
  entities: [Todo],
  namingStrategy: new SnakeNamingStrategy(),
})
  .then((connection) => {
    // I like working with the connection
    api(connection);
    server.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
