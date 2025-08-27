import {useState} from 'react'
import './App.css'
import {UserForm} from "./components/UserForm.tsx";
import type {User} from "./types/user.tsx";
import {UserDisplay} from "./components/UserDisplay.tsx";

function App() {  
    const [user, setUser] = useState<User>();

    return (
        <>
            <div>
                <UserForm onSubmit={setUser} />
                <UserDisplay user={user} />
            </div>
            
        </>
    )
}

export default App
