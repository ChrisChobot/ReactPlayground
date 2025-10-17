import type {User} from '../types/user';

interface UserDisplayProps {
    user: User | undefined;
}

export function UserDisplay({user}: UserDisplayProps) {
    if (!user || (!user.name.trim() && !user.surname.trim()) || user.favouriteCities.length === 0) {
        return <></>;
    }

    return (
        <div className="user-display">
            <h3>User Information:</h3>
            <p>
                My name is <b>{user.name} {user.surname}</b>. My favourite cities
                are: {user.favouriteCities.join(', ')}
            </p>
        </div>
    );
}