import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {UserDisplay} from '../UserDisplay';
import type {User} from '../../types/user';

describe('UserDisplay', () => {
    const mockUser: User = {
        name: 'John',
        surname: 'Doe',
        favouriteCities: ['New York', 'London', 'Paris', 'Berlin', 'Madrid']
    };

    it('renders user information when user is provided', () => {
        render(<UserDisplay user={mockUser}/>);

        expect(screen.getByText('User Information:')).toBeInTheDocument();
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/New York, London, Paris, Berlin, Madrid/)).toBeInTheDocument();

        const boldedName = screen.getByText('John Doe').closest('b');
        expect(boldedName).toBeInTheDocument();
    });

    it('renders user information with single city', () => {
        const user = {...mockUser, favouriteCities: ['Radom']};
        render(<UserDisplay user={user}/>);

        expect(screen.getByText('User Information:')).toBeInTheDocument();
        expect(screen.getByText(/Radom/)).toBeInTheDocument();
    });

    it('does not render when user is undefined', () => {
        const {container} = render(<UserDisplay user={undefined}/>);
        expect(container.firstChild).toBeNull();
    });

    it('dont display when cities are empty', () => {
        const user = {...mockUser, favouriteCities: []};
        render(<UserDisplay user={user}/>);

        expect(screen.queryByText(/User Information/)).not.toBeInTheDocument();
        expect(screen.queryByText(/My favourite cities are:/)).not.toBeInTheDocument();
    });

    it('display when name is empty', () => {
        const user = {...mockUser, name: ""};
        render(<UserDisplay user={user}/>);

        expect(screen.getByText(/User Information/)).toBeInTheDocument();
    });

    it('display when surname is empty', () => {
        const user = {...mockUser, surname: ""};
        render(<UserDisplay user={user}/>);

        expect(screen.getByText(/User Information/)).toBeInTheDocument();
    });

    it('dont display when name and surname is empty', () => {
        const user = {...mockUser, name: "", surname: ""};
        render(<UserDisplay user={user}/>);

        expect(screen.queryByText(/User Information/)).not.toBeInTheDocument();
    });
});