import React from 'react';
import styled from 'styled-components';
import {ErrorMessage} from './ErrorMessage';

const InputRow = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
`;

const StyledLabel = styled.label`
    display: inline-flex;
    margin-bottom: 10px;
    font-size: 1.2em;
    min-width: 60px;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledInput = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
`;

const ErrorContainer = styled.div`
    margin-top: 4px;
    text-align: left;
    width: 100%;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({label, name, error, onBlur, ...rest}) => {
    const errorMessage = typeof error === 'object' ? error[name!] : error;
    return (
        <>
            <InputRow>
                <StyledLabel htmlFor={name}>{label}</StyledLabel>
                <InputWrapper>
                    <StyledInput id={name} name={name} onBlur={onBlur} {...rest} />
                    <ErrorContainer>{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}</ErrorContainer>
                </InputWrapper>
            </InputRow>
        </>
    );
};

export default Input;
