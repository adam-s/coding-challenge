import './App.css';
import React, { useEffect, useReducer, useMemo, Dispatch } from 'react';
import { ITodo, Todos } from './todos';
import {
  insureSorted,
  removeArrayDuplicates,
  reorder,
  sortByKey,
} from './utils';
import { DropResult } from 'react-beautiful-dnd';
import { Global } from '@emotion/react';
import { Box } from '@mui/material';

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

type TodoSort = { id: number; sort: number }[];

type Action =
  | { type: 'request' }
  | { type: 'success'; payload: ITodo[] }
  | { type: 'failure'; payload: string }
  // There is a way to make a mixin of sorts with request, success, and failure actions. Should be implemented here
  | { type: 'requestReorder'; payload: ITodo[] } // Ordered locally. The old list is stored in memory
  | { type: 'successReorder' } // Everything is fine
  | { type: 'failureReorder'; payload: { todos: ITodo[]; message: string } }; // Revert to old list

const initialState: State = {
  todos: [],
  isLoading: false,
  error: null,
};

const endPoint = 'http://localhost:5000/todos';

const getTodos = (dispatch: Dispatch<Action>) => async (): Promise<void> => {
  dispatch({ type: 'request' });
  fetch(endPoint)
    .then((res): Promise<{ todos: ITodo[] }> => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Network error');
    })
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
      .then((res): Promise<{ todo: ITodo }> => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network error');
      })
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
      .then((res): Promise<{ todo: ITodo }> => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network error');
      })
      .then((res) => {
        dispatch({ type: 'success', payload: [res.todo] });
      })
      .catch((err) => {
        dispatch({ type: 'failure', payload: err.message });
      });
  };
const reorderTodo =
  (dispatch: Dispatch<Action>) =>
  async (
    todos: ITodo[],
    source: number,
    destination: number
  ): Promise<void> => {
    const reorderTodos = reorder(todos, source, destination);
    const newTodos = insureSorted(reorderTodos, 'sort');
    dispatch({ type: 'requestReorder', payload: newTodos });
    fetch(`${endPoint}/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodos),
    })
      .then((res): Promise<void> => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network error');
      })
      .then((res) => {
        dispatch({ type: 'successReorder' });
      })
      .catch((err) => {
        dispatch({
          type: 'failureReorder',
          payload: { todos, message: err.message },
        });
      });
  };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'request':
      return { ...state, ...{ isLoading: true } };
    case 'success':
      // A pipe operator from lodash or Ramda would be nice here
      const dedupe = removeArrayDuplicates(state.todos, action.payload, 'id');
      const sorted = sortByKey(dedupe, 'sort');
      const insureUniqueSort = insureSorted(sorted, 'sort');
      return {
        isLoading: false,
        error: null,
        todos: insureUniqueSort,
      }; // Mix payload without duplicates
    case 'failure':
      return { ...state, ...{ isLoading: false, error: action.payload } };
    case 'requestReorder':
      return { ...state, ...{ todos: action.payload, isLoading: true } };
    case 'successReorder':
      return { ...state, ...{ isLoading: false } };
    case 'failureReorder':
      return {
        ...state,
        ...{
          todos: action.payload.todos,
          isLoading: false,
          error: action.payload.message,
        },
      };
    default:
      return state;
  }
};

const GlobalStyled = () => (
  <Global
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      '#root, body, html': {
        background: '#d6d6d6',
        fontFamily: 'sans-serif',
      },
      '#root': {},
    }}
  />
);

function App() {
  const [{ todos, isLoading }, dispatch] = useReducer(reducer, initialState);

  // useMemo is not performant this is a bad pattern :(
  const thunks = useMemo(
    () => ({
      getTodos: getTodos(dispatch),
      createTodo: createTodo(dispatch),
      updateTodo: updateTodo(dispatch),
      reorderTodo: reorderTodo(dispatch),
    }),
    [dispatch]
  );

  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;
    thunks.reorderTodo(todos, source.index, destination.index);
  };

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
    <Box
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        py: 1,
      }}
    >
      <GlobalStyled />
      <Todos
        todos={todos}
        onDragEnd={onDragEnd}
        isLoading={isLoading}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
      />
    </Box>
  );
}

export default App;
