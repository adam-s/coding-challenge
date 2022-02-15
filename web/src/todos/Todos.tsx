import { List } from '@mui/material';
import React from 'react';
import { Todo, ITodo } from './Todo';
import { TodoForm } from './TodoForm';

interface Props {
  todos: ITodo[];
  handleCreate: (name: string) => void; //React.FormEventHandler<HTMLFormElement>;
  handleUpdate: (todo: ITodo) => void;
  handleReorder: (e: any) => void;
  isLoading: boolean;
}

export const Todos: React.FC<Props> = ({
  todos,
  handleCreate,
  handleUpdate,
  handleReorder,
  isLoading,
}) => {
  // handleReorder will exist here?

  // While loading show spinner and prevent further actions until finished. Test with a setTimeout on the server
  // Also clear text field after successful handleCreate

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <List
        dense
        sx={{ width: '100%', maxWidth: '400px', bgcolor: 'background.paper' }}
      >
        {Array.isArray(todos) && todos.length ? (
          todos.map((item: any) => (
            <Todo key={item.id} todo={item} handleUpdate={handleUpdate} />
          ))
        ) : (
          <span>Make a more meaningful empty text</span>
        )}
        <TodoForm handleCreate={handleCreate} isLoading={isLoading} />
      </List>
    </div>
  );
};
