import React from 'react';
import { Checkbox, ListItem, ListItemText } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';

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

const ListItemStyled = styled(ListItem)<{ isdragging: string | undefined }>`
  background: ${(props) =>
    props.isdragging === 'true' ? 'rgb(235,235,235)' : ''};
`;

export const Todo: React.FC<TodoProps> = ({ todo, handleUpdate }) => {
  const { id, name, completed, sort } = todo;
  const labelId = `checkbox-list-secondary-label-${id}`;

  const toggleCompleted = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const updatedTodo = { ...todo, completed: checked };
    handleUpdate(updatedTodo);
  };

  return (
    <Draggable draggableId={id.toString()} index={sort}>
      {(provided, snapshot) => (
        <ListItemStyled
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isdragging={snapshot.isDragging.toString()}
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
        </ListItemStyled>
      )}
    </Draggable>
  );
};
