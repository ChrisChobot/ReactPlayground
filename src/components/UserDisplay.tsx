// src/components/UserDisplay.tsx
import {useEffect, useState} from 'react';
import type {User} from '../types/user';

interface UserDisplayProps {
    user: User | undefined;
}

export function UserDisplay({user}: UserDisplayProps) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (user) {
            setDisplayText(
                `My name is ${user.name} ${user.surname}. My favourite cities are: ${user.favouriteCities.join(', ')}`
            );
        } else {
            setDisplayText('');
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="user-display">
            <h3>User Information:</h3>
            <p>{displayText}</p>
        </div>
    );
}