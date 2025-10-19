import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Wizard from '../Wizard';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();

    window.alert = jest.fn();
});

afterAll(() => {
    jest.restoreAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            status: 200,
            url: 'https://test-image-url.com',
            clone() {
                return this;
            },
        } as unknown as Response)
    ) as jest.MockedFunction<typeof fetch>;
});

const renderWizard = () => render(<Wizard />);

const fillStep1 = (name = 'Test User', email = 'test@example.com') => {
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: name } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: email } });
};

const goToStep2 = async () => {
    fillStep1();
    fireEvent.click(screen.getByText('Next'));
    await screen.findByText('Step 2');
};

const goToStep3 = async () => {
    await goToStep2();
    const checkbox = await screen.findByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText('Next'));
    await screen.findByText('Step 3');
};

// --- Tests ---
describe('Wizard Component', () => {
    it('renders the first step by default', () => {
        renderWizard();

        expect(screen.getByText('Step 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    });

    it('validates required fields on next step', async () => {
        renderWizard();

        fireEvent.click(screen.getByText('Next'));

        expect(await screen.findByText('Name is required.')).toBeInTheDocument();
        expect(await screen.findByText(/Email is required\.|Email is not valid\./)).toBeInTheDocument();
    });

    it('moves to the next step when validation passes', async () => {
        renderWizard();

        fillStep1();
        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(screen.getByText('Step 2')).toBeInTheDocument();
        });
    });

    it('can go back to the previous step', async () => {
        renderWizard();

        fillStep1();
        fireEvent.click(screen.getByText('Next'));
        await screen.findByText('Step 2');

        fireEvent.click(screen.getByText('Previous'));
        expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    it('submits the form on the last step', async () => {
        renderWizard();

        await goToStep3();
        fireEvent.click(screen.getByText('Submit'));

        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Wizard finished! Your data is being downloaded.');
    });
});
