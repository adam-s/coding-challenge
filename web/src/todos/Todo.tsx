import { Checkbox, ListItem, ListItemText } from '@mui/material';
import React from 'react';

export interface ITodo {
  id: number;
  name: string;
  completed: boolean;
  sort: number;
}

interface TodoProps {
  todo: ITodo;
  handleUpdate: (todo: ITodo) => void;
}

export const Todo: React.FC<TodoProps> = ({ todo, handleUpdate }) => {
  const { id, name, completed } = todo;
  const labelId = `checkbox-list-secondary-label-${id}`;

  const toggleCompleted = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const updatedTodo = { ...todo, completed: checked };
    handleUpdate(updatedTodo);
  };

  return (
    <ListItem
      secondaryAction={
        <Checkbox
          edge="end"
          onChange={toggleCompleted}
          checked={completed}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      }
    >
      <ListItemText id={labelId} primary={name} />
    </ListItem>
  );
};
