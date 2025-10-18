import React from 'react';
import styled from 'styled-components';
import {StepProps} from './types';

const StepContainer = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
`;

const Summary = styled.div`
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
`;

const SummaryItem = styled.p`
    font-size: 1.1em;
    color: #555;
    margin: 10px 0;
`;

const SummaryImage = styled.img`
    margin-top: 15px;
    border-radius: 8px;
    max-width: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

const Step3: React.FC<StepProps> = ({formData}) => {
    return (
        <StepContainer>
            <h2>Confirmation</h2>
            <Summary>
                <SummaryItem><strong>Name:</strong> {formData.name}</SummaryItem>
                <SummaryItem><strong>Email:</strong> {formData.email}</SummaryItem>
                <SummaryItem><strong>Terms Accepted:</strong> {formData.terms ? 'Yes' : 'No'}</SummaryItem>
            </Summary>
            {formData.imageUrl && <SummaryImage src={formData.imageUrl} alt="Selected image"/>}
        </StepContainer>
    );
};

export default Step3;
