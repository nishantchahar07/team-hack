'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ApiResponse, FormErrors, SignUpFormData, SignUpRequest } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = 'Full name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
            isValid = false;
        }

        if (!agreeToTerms) {
            errors.terms = 'Please agree to the Terms of Service';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const requestData: SignUpRequest = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone
            };

            const response: Response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data: ApiResponse = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                localStorage.setItem('email', formData.email);
                window.location.href = '/auth/verify';
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (): void => {
        setShowPassword(prev => !prev);
    };

    const toggleConfirmPasswordVisibility = (): void => {
        setShowConfirmPassword(prev => !prev);
    };

    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAgreeToTerms(e.target.checked);
        if (formErrors.terms) {
            setFormErrors(prev => ({
                ...prev,
                terms: undefined
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">

                <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">
                    Create an Account
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Sign up now to get started with an account.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name*
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address*
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="johndoe@gmail.com"
                            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number*
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91xxxxxxxxxx"
                            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {formErrors.phone && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password*
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className={`w-full px-3 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password*
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className={`w-full px-3 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={handleTermsChange}
                                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 ${formErrors.terms ? 'border-red-500' : ''
                                    }`}
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                                I have read and agree to the{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-500">
                                    Terms of Service
                                </a>
                            </label>
                        </div>
                        {formErrors.terms && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => window.location.href = '/auth/signin'}
                        type="button"
                        className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;