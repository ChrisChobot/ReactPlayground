import React, {useEffect} from 'react';
import styled from 'styled-components';
import {StepProps} from './types';
import {StepContainer} from './shared';
import Checkbox from '../common/Checkbox';

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
                    if (response.url) onImageFetch(response.url);
                })
                .catch(err => console.error('Failed to fetch image:', err));
        }
    }, [formData.imageUrl, onImageFetch]);

    return (
        <StepContainer>
            {formData.imageUrl && <RandomImage src={formData.imageUrl} alt="Random unsplash image"/>}

            <Checkbox
                name="terms"
                checked={formData.terms || false}
                onChange={handleInput}
                label="I accept the terms and conditions"
                error={errors?.terms}
            />
        </StepContainer>
    );
};

export default Step2;