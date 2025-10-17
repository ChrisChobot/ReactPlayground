import React from 'react';
import styled from 'styled-components';
import { ErrorMessage } from '../wizard/shared';

const StyledLabel = styled.label`
  margin-bottom: 10px;
  font-size: 1.2em;
`;

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, onBlur, ...rest }) => {
  const errorMessage = typeof error === 'object' ? error[name!] : error;
  return (
    <>
      <StyledLabel>
        {label}
        <StyledInput name={name} onBlur={onBlur} {...rest} />
      </StyledLabel>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
};

export default Input;
