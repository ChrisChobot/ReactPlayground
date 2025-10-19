import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Checkbox from '../Checkbox';
import '@testing-library/jest-dom';

describe('Checkbox Component', () => {
    it('renders checkbox with label', () => {
        render(<Checkbox label="Test Checkbox" name="test"/>);

        const checkbox = screen.getByRole('checkbox');
        const label = screen.getByText('Test Checkbox');

        expect(checkbox).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    it('handles checked state', () => {
        render(<Checkbox label="Test Checkbox" name="test" checked onChange={() => {
        }}/>);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('calls onChange handler when clicked', () => {
        const handleChange = jest.fn();
        render(<Checkbox label="Test Checkbox" name="test" onChange={handleChange}/>);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays error message when error prop is provided', () => {
        const errorMessage = 'This field is required';
        render(<Checkbox label="Test Checkbox" name="test" error={errorMessage}/>);

        const errorElement = screen.getByText(errorMessage);
        expect(errorElement).toBeInTheDocument();
        expect(getComputedStyle(errorElement).color).toBe('rgb(255, 0, 0)');
    });

    it('applies custom id when provided', () => {
        const customId = 'custom-checkbox-id';
        render(<Checkbox label="Test Checkbox" name="test" id={customId}/>);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('id', customId);

        const label = screen.getByText('Test Checkbox').closest('label');
        expect(label).toHaveAttribute('for', customId);
    });

    it('uses name as id when id is not provided', () => {
        const name = 'test-checkbox';
        render(<Checkbox label="Test Checkbox" name={name}/>);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('id', name);

        const label = screen.getByText('Test Checkbox').closest('label');
        expect(label).toHaveAttribute('for', name);
    });

    it('applies disabled state', () => {
        render(<Checkbox label="Disabled Checkbox" name="disabled" disabled/>);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });
});
