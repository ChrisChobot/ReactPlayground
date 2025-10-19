import React from 'react';
import styled from 'styled-components';
import {ErrorMessage} from './ErrorMessage';

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    margin-top: 10px;
    cursor: pointer;
`;

const CheckboxInput = styled.input`
    margin-right: 8px;
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
`;

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
    error?: string | undefined;
    id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({id, name, label, error, ...rest}) => {
    const inputId = id ?? (typeof name === 'string' ? name : undefined);

    return (
        <div>
            <CheckboxLabel htmlFor={inputId}>
                <CheckboxInput id={inputId} type="checkbox" name={name} {...rest} />
                {label}
            </CheckboxLabel>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
    );
};

export default Checkbox;