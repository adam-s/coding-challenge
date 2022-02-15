import React from 'react';
import { Paper } from '@mui/material';
import styled from '@emotion/styled/macro';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { Todo, ITodo } from './Todo';
import { TodoForm } from './TodoForm';

interface Props {
  todos: ITodo[];
  onDragEnd: OnDragEndResponder;
  handleCreate: (name: string) => void; //React.FormEventHandler<HTMLFormElement>;
  handleUpdate: (todo: ITodo) => void;
  isLoading: boolean;
}

const PaperStyled = styled(Paper)`
  margin: 16px;
  min-width: 350px;
  max-width: 600px;
`;

export const Todos: React.FC<Props> = ({
  todos,
  onDragEnd,
  handleCreate,
  handleUpdate,
  isLoading,
}) => {
  // handleReorder will exist here?

  // While loading show spinner and prevent further actions until finished. Test with a setTimeout on the server
  // Also clear text field after successful handleCreate

  return (
    <PaperStyled>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {Array.isArray(todos) && todos.length ? (
                todos.map((item: any) => (
                  <Todo key={item.id} todo={item} handleUpdate={handleUpdate} />
                ))
              ) : (
                <span>Make a more meaningful empty text</span>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <TodoForm handleCreate={handleCreate} isLoading={isLoading} />
    </PaperStyled>
  );
};
