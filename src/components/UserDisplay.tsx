import {type JSX, useEffect, useState} from 'react';
import type {User} from '../types/user';

interface UserDisplayProps {
    user: User | undefined;
}

export function UserDisplay({user}: UserDisplayProps) {
    const [displayText, setDisplayText] = useState<JSX.Element>();

    useEffect(() => {
        if (user) {
            setDisplayText(
               <>My name is <b>{user.name} {user.surname}</b>. My favourite cities are: {user.favouriteCities.join(', ')}</>
            );
        } else {
            setDisplayText(<></>);
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