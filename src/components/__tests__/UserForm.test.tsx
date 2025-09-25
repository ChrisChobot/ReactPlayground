import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import '@testing-library/jest-dom';
import { UserForm } from '../UserForm';

describe('UserForm', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByPlaceholderText('name')).toBeInTheDocument();    expect(screen.getByPlaceholderText('surname')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('5 cities separated by commas')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when all fields are valid', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('surname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('5 cities separated by commas'), { 
      target: { value: 'New York, London, Paris, Berlin, Madrid' } 
    });
    
    fireEvent.click(screen.getByText('Start'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Doe',
        favouriteCities: ['New York', 'London', 'Paris', 'Berlin', 'Madrid']
      });
    });
  });

  it('shows error when name contains invalid characters', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John@123' } });
    fireEvent.change(screen.getByPlaceholderText('surname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('5 cities separated by commas'), { 
      target: { value: 'New York, London, Paris, Berlin, Madrid' } 
    });
    
    fireEvent.click(screen.getByText('Start'));
    
    await waitFor(() => {
      expect(screen.getByText('Only letters, numbers, spaces, and hyphens are allowed')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when not enough cities are provided', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('surname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('5 cities separated by commas'), { 
      target: { value: 'New York, London' } 
    });
    
    fireEvent.click(screen.getByText('Start'));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter exactly 5 cities separated by commas')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('trims whitespace from inputs', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: '  John  ' } });
    fireEvent.change(screen.getByPlaceholderText('surname'), { target: { value: '  Doe  ' } });
    fireEvent.change(screen.getByPlaceholderText('5 cities separated by commas'), { 
      target: { value: '  New York  ,  London  ,  Paris  ,  Berlin  ,  Madrid  ' } 
    });
    
    fireEvent.click(screen.getByText('Start'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Doe',
        favouriteCities: ['New York', 'London', 'Paris', 'Berlin', 'Madrid']
      });
    });
  });
});
