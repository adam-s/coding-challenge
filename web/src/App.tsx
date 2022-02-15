import { Container } from '@mui/material';
import React, { useEffect, useReducer, useMemo, Dispatch } from 'react';
import { ITodo, Todos } from './todos';
import './App.css';
import { removeArrayDuplicates, sortByKey } from './utils';

// https://medium.com/codex/typescript-and-react-usereducer-943e4f8d1ad4
export enum ReducerActionType {
  FETCH_TODOS,
  CREATE_TODO,
  EDIT_TODO,
}

export type ReducerAction = {
  type: ReducerActionType;
  payload?: any;
};

interface State {
  todos: ITodo[];
  isLoading: boolean;
  error?: string | null;
}

type Action =
  | { type: 'request' }
  | { type: 'success'; payload: ITodo[] }
  | { type: 'failure'; payload: string };

const initialState: State = {
  todos: [],
  isLoading: false,
  error: null,
};

const endPoint = 'http://localhost:5000/todos';

const getTodos = (dispatch: Dispatch<Action>) => async (): Promise<void> => {
  dispatch({ type: 'request' });
  fetch(endPoint)
    .then((res): Promise<{ todos: ITodo[] }> => res.json())
    .then((res) => {
      dispatch({ type: 'success', payload: res.todos });
    })
    .catch((err) => {
      dispatch({ type: 'failure', payload: err.message });
    });
};

const createTodo =
  (dispatch: Dispatch<Action>) =>
  async (data: Omit<ITodo, 'id'>): Promise<void> => {
    dispatch({ type: 'request' });
    fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res): Promise<{ todo: ITodo }> => res.json())
      .then((res) => {
        dispatch({ type: 'success', payload: [res.todo] });
      })
      .catch((err) => {
        dispatch({ type: 'failure', payload: err.message });
      });
  };

const updateTodo =
  (dispatch: Dispatch<Action>) =>
  async (data: ITodo): Promise<void> => {
    dispatch({ type: 'request' });
    fetch(`${endPoint}/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res): Promise<{ todo: ITodo }> => res.json())
      .then((res) => {
        dispatch({ type: 'success', payload: [res.todo] });
      })
      .catch((err) => {
        dispatch({ type: 'failure', payload: err.message });
      });
  };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'request':
      return { ...state, ...{ isLoading: true } };
    case 'success':
      return {
        isLoading: false,
        error: null,
        todos: sortByKey(
          removeArrayDuplicates(state.todos, action.payload, 'id'),
          'id'
        ),
      }; // Mix payload without duplicates
    case 'failure':
      return { ...state, ...{ isLoading: false, error: action.payload } };
    default:
      return state;
  }
};

function App() {
  const [{ todos, isLoading }, dispatch] = useReducer(reducer, initialState);

  // useMemo is not performant this is a bad pattern :(
  const thunks = useMemo(
    () => ({
      getTodos: getTodos(dispatch),
      createTodo: createTodo(dispatch),
      updateTodo: updateTodo(dispatch),
    }),
    [dispatch]
  );

  const handleCreate = (name: string) => {
    // e.preventDefault();
    const todo = {
      name,
      completed: false,
      sort: (todos?.length || 0) + 1, // This will go last when added
    };
    thunks.createTodo(todo);
  };

  const handleUpdate = (todo: ITodo): void => {
    thunks.updateTodo(todo);
  };

  const handleReorder = (e: any): void => {
    // save a bunch of todo deltas to the database
  };

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) {
      thunks.getTodos();
    }
    return () => {
      didCancel = true;
    };
  }, [thunks]);

  return (
    <Container>
      <Todos
        todos={todos}
        isLoading={isLoading}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        handleReorder={handleReorder}
      />
    </Container>
  );
}

export default App;
