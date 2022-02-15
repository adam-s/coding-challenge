import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
} from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import styled from '@emotion/styled';

interface FormProps {
  isLoading: boolean;
  handleCreate: (name: string) => void;
}

const RotatingLoader = styled(RotateRightIcon)`
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const TodoForm = ({ isLoading, handleCreate }: FormProps) => {
  const [name, setName] = useState('');
  return (
    <FormControl
      component="form"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
      }}
      onSubmit={() => handleCreate(name)}
    >
      <TextField
        name="name"
        type="text"
        value={name}
        disabled={isLoading}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          event.preventDefault();
          setName(event.target.value);
        }}
        placeholder="Enter a todo"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                color="primary"
                disabled={isLoading}
                onClick={() => {
                  setName('');
                  handleCreate(name);
                }}
              >
                {!isLoading ? <LibraryAddIcon /> : <RotatingLoader />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};
