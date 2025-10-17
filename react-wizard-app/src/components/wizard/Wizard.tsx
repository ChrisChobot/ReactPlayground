import React, {useState} from 'react';
import * as Yup from 'yup';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import {FormData, FormErrors} from './types';

const step1Schema = Yup.object({
    name: Yup.string().required('Name is required.'),
    email: Yup.string().required('Email is required.')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid.'),
});

const Wizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        terms: false,
        imageUrl: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});


    const stepFields: Record<number, (keyof FormData)[]> = {
        1: ['name', 'email'],
        2: ['terms'],
        3: ['imageUrl'],
    };

    const hasStepErrors = (step: number): boolean => {
        const fields = stepFields[step];
        return fields.some((field) => errors[field] != null);
    };
    /*  const [isInitialMount, setIsInitialMount] = useState(true);
    
      useEffect(() => {
        if (isInitialMount) {
          setIsInitialMount(false);
        } else {
          validate();
        }
      }, [formData, step]);*/
    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const {name} = e.target;

        if(!touchedFields[name]){
            await new Promise(resolve => {
                setTouchedFields(prev => {
                    const newState = {...prev, [name]: true};
                    resolve(newState); // Resolve with the new state
                    return newState;
                });
            }).then((newState: any) => {
                // Now validate with the new state
                validate(name as keyof FormData, newState);
            });
        }       

    };

    const validate = async (fieldName?: keyof FormData, tt?: Record<string, boolean>, newestFormData?:FormData): Promise<boolean> => {
        try {
            if (step === 1) {
                if (fieldName && tt) {
                   let anyError = false;
                        for (const [key, value] of Object.entries(tt)) {
                            if (value) {
                                try {
                                await step1Schema.validateAt(key, newestFormData);
                                setErrors(prev => ({
                                    ...prev,
                                    [key]: undefined
                                }));
                                } catch (err) {
                                    if (err instanceof Yup.ValidationError) {
                                        anyError = true;
                                        const newErrors: FormErrors = {};
                                        err.errors.forEach(error => {
                                            newErrors[err.path as keyof FormData] = error;
                                        });
                                        setErrors(prev => ({
                                            ...prev,
                                            [err.path!]: newErrors
                                        }));
                                    }
                                }
                            }
                        }
                    return !anyError;
                } else {
                    // For 'Next' button, validate all fields
                    await step1Schema.validate(formData, {abortEarly: false});
                    setErrors({});
                    return true;
                }
                //  await step1Schema.validate(formData, { abortEarly: false });
            } else if (step === 2) {
                if (!(newestFormData?.terms ?? formData.terms)) {
                    setErrors({terms: 'You must accept the terms and conditions.'});
                    return false;
                }
            }
            setErrors({});
            return true;
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: FormErrors = {};
                err.inner.forEach(error => {
                    if (error.path) {
                        newErrors[error.path as keyof FormData] = error.message;
                    }
                });
                setErrors( newErrors);
            }
            return false;
        }
    };

    const nextStep = async () => {
        if (await validate()) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        setTouchedFields(prev => {
            return {...prev, [name]: true};
        });

        await new Promise(resolve => {
            const {name, value, type, checked} = e.target;

            const newState = {...formData, [name]: type === 'checkbox' ? checked : value};
            setFormData(prev => ({
                ...prev, [name]: type === 'checkbox' ? checked : value
            }));
            
           
            resolve(newState);
        }).then((newState: any) => {
            // Now validate with the new state
            const {name} = e.target;
            validate(name as keyof FormData, { ...touchedFields, [name]: true }, newState);
        });
    };

    const handleImageFetch = (url: string) => {
        setFormData(prev => ({...prev, imageUrl: url}));
    };

    const handleSubmit = () => {
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
    };

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
        <div>
            <h2>Step {step}</h2>
            {renderStep()}
            <div>
                {step > 1 && <button onClick={prevStep}>Previous</button>}
                {step === 1 && <button onClick={nextStep} disabled={hasStepErrors(1)}>Next</button>}
                {step === 2 && <button onClick={nextStep} disabled={hasStepErrors(2)}>Next</button>}
                {step === 3 && <button onClick={handleSubmit}>Submit</button>}
            </div>
        </div>
    );
};

export default Wizard;
