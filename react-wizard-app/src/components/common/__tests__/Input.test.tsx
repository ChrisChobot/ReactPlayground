import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Input from '../Input';
import '@testing-library/jest-dom';

describe('Input Component', () => {
    it('renders the input with label', () => {
        render(<Input label="Test Label" name="test"/>);

        expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('displays error message when provided', () => {
        render(<Input label="Test Label" name="test" error="Test error"/>);

        expect(screen.getByText('Test error')).toBeInTheDocument();
        expect(getComputedStyle(screen.getByText('Test error')).color).toBe('rgb(255, 0, 0)');
    });

    it('calls onChange handler when input value changes', () => {
        const handleChange = jest.fn();
        render(<Input label="Test Label" name="test" onChange={handleChange}/>);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, {target: {value: 'test value'}});

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur handler when input loses focus', () => {
        const handleBlur = jest.fn();
        render(<Input label="Test Label" name="test" onBlur={handleBlur}/>);

        const input = screen.getByRole('textbox');
        fireEvent.blur(input);

        expect(handleBlur).toHaveBeenCalledTimes(1);
    });
});
