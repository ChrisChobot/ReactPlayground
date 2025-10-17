// src/components/wizard/Step1.tsx
import React from 'react';
import { StepProps } from './types';
import { StepContainer } from './shared';
import Input from '../common/Input';

const Step1: React.FC<StepProps> = ({ formData, handleInput, errors, handleBlur }) => {
    return (
        <StepContainer>
            <Input
                label="Name:"
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInput}
                onBlur={handleBlur}
                error={errors?.name}
            />

            <Input
                label="Email:"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInput}
                onBlur={handleBlur}
                error={errors?.email}
            />
        </StepContainer>
    );
};

export default Step1;