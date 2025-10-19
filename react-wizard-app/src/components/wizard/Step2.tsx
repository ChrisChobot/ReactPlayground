import React, {useEffect} from 'react';
import styled from 'styled-components';
import {StepProps} from './types';
import {StepContainer} from './shared';
import {ErrorMessage} from '../common/ErrorMessage';

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const CheckboxInput = styled.input`
    margin-right: 5px;
`;

const RandomImage = styled.img`
    margin-top: 10px;
    border-radius: 4px;
    max-width: 200px;
`;

const Step2: React.FC<StepProps> = ({formData, handleInput, errors, onImageFetch}) => {
    useEffect(() => {
        if (!formData.imageUrl && onImageFetch) {
            fetch('https://picsum.photos/200')
                .then(response => {
                    if (response.url) {
                        onImageFetch(response.url);
                    }
                })
                .catch(err => console.error('Failed to fetch image:', err));
        }
    }, [formData.imageUrl, onImageFetch]);

    return (
        <StepContainer>
            {formData.imageUrl && <RandomImage src={formData.imageUrl} alt="Random unsplash image"/>}
            <CheckboxLabel>
                <CheckboxInput
                    type="checkbox"
                    name="terms"
                    checked={formData.terms || false}
                    onChange={handleInput}
                />
                I accept the terms and conditions
            </CheckboxLabel>
            {errors?.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}
        </StepContainer>
    );
};

export default Step2;
