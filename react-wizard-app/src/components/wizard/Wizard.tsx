import React, {useCallback, useState} from 'react';
import * as Yup from 'yup';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import {FormData, FormErrors} from './types';
import styled from 'styled-components';

export const WizardBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const step1Schema = Yup.object({
    name: Yup.string().required('Name is required.'),
    email: Yup.string()
        .required('Email is required.')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid.'),
});

const step2Schema = Yup.object({
    terms: Yup.boolean().isTrue('You must accept the terms and conditions.'),
    imageUrl: Yup.string().url('Image URL must be a valid URL.').nullable(),
});

// fields that belong to each step
const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
    1: ['name', 'email'],
    2: ['terms', 'imageUrl'],
};

const Wizard: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        terms: false,
        imageUrl: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    const hasStepErrors = useCallback(
        (s: number) => {
            const fields = STEP_FIELDS[s] ?? [];
            return fields.some((f) => Boolean(errors[f]));
        },
        [errors]
    );

    const clearFieldsErrors = useCallback((fields: (keyof FormData)[]) => {
        setErrors(prev => {
            if (!prev) return prev;
            const copy = {...prev} as FormErrors;
            for (const f of fields) {
                if (f in copy) delete copy[f];
            }
            return copy;
        });
    }, [])

    const clearFieldError = useCallback((field: keyof FormData) => {
        clearFieldsErrors([field]);
    }, [clearFieldsErrors]);

    const clearStepErrors = useCallback((stepNumber: number) => {
        const fields = STEP_FIELDS[stepNumber] ?? [];
        if (fields.length > 0) clearFieldsErrors(fields);
    }, [clearFieldsErrors]);

    const validate = useCallback(
        async (
            fieldName?: keyof FormData,
            newestTouchedFields?: Record<string, boolean>,
            newestFormData?: FormData
        ): Promise<boolean> => {
            const data = newestFormData ?? formData;
            const touched = newestTouchedFields ?? touchedFields;

            try {
                if (step === 1) {
                    // field-level validation for touched fields
                    if (fieldName && newestTouchedFields) {
                        let anyError = false;
                        for (const [key, isTouched] of Object.entries(touched)) {
                            if (!isTouched) continue;

                            try {
                                await step1Schema.validateAt(key, data);
                                clearFieldError(key as keyof FormData);
                            } catch (err) {
                                if (err instanceof Yup.ValidationError) {
                                    anyError = true;
                                    setErrors((prev) => ({...prev, [err.path as keyof FormData]: err.message}));
                                }
                            }
                        }

                        return !anyError;
                    }

                    // full-step validation (used by Next button)
                    try {
                        await step1Schema.validate(data, {abortEarly: false});
                        clearStepErrors(1);
                        return true;
                    } catch (err) {
                        if (err instanceof Yup.ValidationError) {
                            const newErrors: FormErrors = {};
                            err.inner.forEach((e) => {
                                if (e.path) newErrors[e.path as keyof FormData] = e.message;
                            });
                            setErrors((prev) => ({...prev, ...newErrors}));
                        }
                        return false;
                    }
                }

                if (step === 2) {
                    try {
                        await step2Schema.validate(data, {abortEarly: false});
                        clearStepErrors(2);
                        return true;
                    } catch (err) {
                        if (err instanceof Yup.ValidationError) {
                            const newErrors: FormErrors = {};
                            err.inner.forEach((e) => {
                                if (e.path) newErrors[e.path as keyof FormData] = e.message;
                            });
                            setErrors((prev) => ({...prev, ...newErrors}));
                        }
                        return false;
                    }
                }

                return true;
            } catch (outerErr) {
                console.error('Validation failed unexpectedly', outerErr);
                return false;
            }
        },
        [formData, touchedFields, step, clearFieldError, clearStepErrors]
    );

    // handlers
    const handleBlur = useCallback(
        async (e: React.FocusEvent<HTMLInputElement>) => {
            const {name} = e.target;
            if (!touchedFields[name]) {
                const newTouched = {...touchedFields, [name]: true};
                setTouchedFields(newTouched);

                await validate(name as keyof FormData, newTouched, formData);
            }
        },
        [formData, touchedFields, validate]
    );

    const handleInput = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value, type, checked} = e.target;
            const newFormData = {...formData, [name]: type === 'checkbox' ? checked : value};
            const newTouched = {...touchedFields, [name]: true};

            setFormData(newFormData);
            setTouchedFields(newTouched);

            await validate(name as keyof FormData, newTouched, newFormData);
        },
        [formData, touchedFields, validate]
    );

    const handleImageFetch = useCallback((url: string) => {
        setFormData((prev) => ({...prev, imageUrl: url}));
    }, []);

    const handleSubmit = useCallback(() => {
        const data = `Name: ${formData.name}\nEmail: ${formData.email}\nTerms Accepted: ${formData.terms}\nImage URL: ${formData.imageUrl}`;
        const blob = new Blob([data], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wizard-data.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Wizard finished! Your data is being downloaded.');
    }, [formData]);

    const nextStep = useCallback(async () => {
        const ok = await validate();
        if (ok) setStep((p) => p + 1);
    }, [validate]);

    const prevStep = useCallback(() => setStep((p) => p - 1), []);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 formData={formData} handleInput={handleInput} errors={errors} handleBlur={handleBlur}/>;
            case 2:
                return <Step2 formData={formData} handleInput={handleInput} errors={errors}
                              onImageFetch={handleImageFetch}/>;
            case 3:
                return <Step3 formData={formData} handleInput={handleInput} errors={errors}/>;
            default:
                return <div>Wizard finished!</div>;
        }
    };

    return (
        <WizardBox>
            <h2>Step {step}</h2>
            {renderStep()}

            <div>
                {step > 1 && <button onClick={prevStep}>Previous</button>}
                {step === 1 && <button onClick={nextStep} disabled={hasStepErrors(1)}>Next</button>}
                {step === 2 && <button onClick={nextStep} disabled={hasStepErrors(2)}>Next</button>}
                {step === 3 && <button onClick={handleSubmit}>Submit</button>}
            </div>
        </WizardBox>
    );
};

export default Wizard;
