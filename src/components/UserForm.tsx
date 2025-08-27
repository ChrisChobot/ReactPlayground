import {type FormEvent, useState, useEffect} from 'react';
import type {User} from "../types/user.tsx";

interface UserFormProps {
    onSubmit: (user: User) => void;
}

interface FormErrors {
    name?: string;
    surname?: string;
    cities?: string;
}

export function UserForm({onSubmit}: UserFormProps) {
    const nameRegex = /^[a-zA-Z0-9- ]*$/;
    const citiesRegex = /^[a-zA-Z, -]*$/;

    const [tempName, setTempName] = useState('');
    const [tempSurname, setTempSurname] = useState('');
    const [tempFavouriteCities, setTempFavouriteCities] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [shake, setShake] = useState<(keyof FormErrors)[]>([]);

    const validateName = (value: string): string => {
        const errorMessages: string[] = [];
        if (!value.trim()) errorMessages.push("This field is required");
        if (!nameRegex.test(value)) errorMessages.push("Only letters, numbers, spaces, and hyphens are allowed");
        return errorMessages.join('\n');
    };

    const validateCities = (value: string): string => {
        const errorMessages: string[] = [];
        const cities = value.split(',').filter(city => city.trim() !== '');
        if (cities.length !== 5) errorMessages.push("Please enter exactly 5 cities separated by commas");
        if (!citiesRegex.test(value)) errorMessages.push("Only letters, spaces, commas, and hyphens are allowed");
        return errorMessages.join('\n');
    };

    const handleNameChange = (value: string, field: 'name' | 'surname') => {
        const error = validateName(value);

        if (field === 'name') setTempName(value);
        if (field === 'surname') setTempSurname(value);
        setErrors(prev => ({...prev, [field]: error}));
    };

    const handleCitiesChange = (value: string) => {
        const error = validateCities(value);
        setTempFavouriteCities(value);
        setErrors(prev => ({...prev, cities: error}));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setShake([]);

        const nameError = validateName(tempName);
        const surnameError = validateName(tempSurname);
        const citiesError = validateCities(tempFavouriteCities);

        const newErrors = {
            name: nameError,
            surname: surnameError,
            cities: citiesError
        };

        setErrors(newErrors);
        const hasAnyError = Object.values(newErrors).some(error => error);

        if (hasAnyError) {

            await new Promise(resolve => requestAnimationFrame(resolve));
            const errorKeys = Object.entries(newErrors)
                .filter(([_, error]) => error)
                .map(([key]) => key as keyof FormErrors);

            if (errorKeys.length > 0) {
                setShake(errorKeys);
            }
            return;
        }

        onSubmit({
            name: tempName.trim(),
            surname: tempSurname.trim(),
            favouriteCities: tempFavouriteCities.split(',').map(city => city.trim())
        });
    };

    useEffect(() => {
        if (shake.length > 0) {
            const timer = setTimeout(() => {
                setShake([]);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [shake]);

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={tempName}
                onChange={e => handleNameChange(e.target.value, 'name')}
                className={`${errors?.name ? 'error' : ''} ${shake.includes('name') ? 'shake' : ''}`}
                placeholder="Enter name"
            />
            {errors?.name && <div className="error-message">{errors.name}</div>}

            <input
                type="text"
                value={tempSurname}
                onChange={e => handleNameChange(e.target.value, 'surname')}
                className={`${errors?.surname ? 'error' : ''} ${shake.includes('surname') ? 'shake' : ''}`}
                placeholder="Enter surname"
            />
            {errors?.surname && <div className="error-message">{errors.surname}</div>}

            <input
                type="text"
                value={tempFavouriteCities}
                onChange={e => handleCitiesChange(e.target.value)}
                className={`${errors?.cities ? 'error' : ''} ${shake.includes('cities') ? 'shake' : ''}`}
                placeholder="Enter 5 cities separated by commas"
            />
            {errors?.cities && <div className="error-message">{errors.cities}</div>}
            <button type="submit">Start</button>
        </form>
    );
}