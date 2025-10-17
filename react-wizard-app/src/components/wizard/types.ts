import React from 'react';

export interface FormData {
  name: string;
  email: string;
  terms: boolean;
  imageUrl?: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;

export interface StepProps {
    formData: FormData;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: FormErrors;
    handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // <-- Add event type here
    onImageFetch?: (url: string) => void;
}