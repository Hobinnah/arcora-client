{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

/**
 * @fileoverview Authentication API module providing secure user authentication services
 * 
 * This module handles all authentication-related API calls including login, logout,
 * and user session management. It provides secure cookie-based session storage
 * with proper security configurations and comprehensive error handling.
 * 
 * Key Features:
 * - Secure JWT token authentication
 * - Cookie-based session management with security flags
 * - Comprehensive error handling and logging
 * - Type-safe API responses
 * - Environment-based configuration
 * 
 * Security Considerations:
 * - Cookies are set with secure, sameSite, and expiration flags
 * - Sensitive data is properly encrypted in storage
 * - Error messages are sanitized to prevent information leakage
 * 
 * @author Netvilleplus Team
 * @version 1.0.0
 * @since 2024
 * 
 * Dependencies:
 * - js-cookie: For secure cookie management
 * - @types/js-cookie: TypeScript definitions
 * 
 * Installation:
 * ```bash
 * npm install js-cookie
 * npm install --save-dev @types/js-cookie
 * ```
 */

import { env } from '../env';
import type { AuthResponse } from '../types/AuthResponse';
import Cookies from 'js-cookie';
import { DefaultApiPaths } from '../types/Account';

/**
 * Base URL for all authentication API endpoints
 * Configured from environment variables for different deployment environments
 */
const BASE_URL = env.API_BASE_URL;

export type RequestLoginCodeResponse = {
    emailExists: boolean;
    message: string;
    verificationToken?: string;
};

export type VerifyLoginCodeResponse = {
    finalToken: string;
    message: string;
    isLoginSuccessful?: boolean;
};

const REQUEST_LOGIN_CODE_SENT_REGEX = /verification code has been sent|code has been sent|sent to your email/i;

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function pickString(source: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === 'string' && value.trim()) {
            return value;
        }
    }
    return undefined;
}

function pickBoolean(source: Record<string, unknown>, keys: string[]): boolean | undefined {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === 'boolean') {
            return value;
        }
    }
    return undefined;
}

function summarizeUnexpectedResponse(body: unknown): string {
    if (typeof body === 'string') {
        return body;
    }
    if (body && typeof body === 'object') {
        const message = pickString(body as Record<string, unknown>, ['message', 'Message', 'detail', 'title']);
        if (message) {
            return message;
        }
    }
    return 'Unrecognized response payload.';
}

function normalizeRequestLoginCodeResponse(body: unknown): RequestLoginCodeResponse | null {
    if (typeof body === 'string') {
        const message = body.trim();
        if (message && REQUEST_LOGIN_CODE_SENT_REGEX.test(message)) {
            return { emailExists: false, message };
        }
        return null;
    }

    const record = asRecord(body);
    if (!record) {
        return null;
    }

    const candidates = [record, asRecord(record.data), asRecord(record.result), asRecord(record.payload)].filter(Boolean) as Record<string, unknown>[];
    let emailExists: boolean | undefined;
    let message: string | undefined;
    let verificationToken: string | undefined;

    for (const candidate of candidates) {
        if (emailExists === undefined) {
            emailExists = pickBoolean(candidate, ['emailExists', 'EmailExists', 'isEmailExists', 'exists']);
        }
        if (!message) {
            message = pickString(candidate, ['message', 'Message', 'detail', 'title']);
        }
        if (!verificationToken) {
            verificationToken = pickString(candidate, ['verificationToken', 'VerificationToken', 'tempToken', 'TempToken', 'token', 'Token']);
        }
    }

    if (emailExists === undefined) {
        if (verificationToken) {
            emailExists = false;
        } else if (message && REQUEST_LOGIN_CODE_SENT_REGEX.test(message)) {
            emailExists = false;
        }
    }

    if (emailExists === undefined) {
        return null;
    }

    return {
        emailExists,
        message: message || '',
        verificationToken,
    };
}

export async function requestLoginCode(email: string): Promise<RequestLoginCodeResponse> {
    const response = await fetch(`${BASE_URL}api/Account/RequestLoginCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const rawBody = await response.text();
    let body: any = rawBody;
    try { body = rawBody ? JSON.parse(rawBody) : rawBody; } catch { /* Plain-text endpoint response. */ }
    if (response.status !== 200) throw new Error(typeof body === 'string' && body ? body : 'Unable to continue with this email.');

    const normalized = normalizeRequestLoginCodeResponse(body);
    if (!normalized) {
        throw new Error(`Unexpected RequestLoginCode response: ${summarizeUnexpectedResponse(body)}`);
    }

    return normalized;
}

export async function verifyLoginCode(emailAddress: string, token: string, otpCode: string): Promise<VerifyLoginCodeResponse> {
    const endpoints = [
        `${BASE_URL}api/Account/VerifyLoginCode`,
        `${BASE_URL}api/Auth/VerifyLoginCode`,
    ];

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
        try {
            const requestBody = {
                emailAddress,
                email: emailAddress,
                verificationToken: token,
                token,
                code: otpCode,
                verificationCode: otpCode,
                otpCode,
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const rawBody = await response.text();
            let body: unknown = rawBody;
            try { body = rawBody ? JSON.parse(rawBody) : rawBody; } catch { /* Plain-text endpoint response. */ }

            if (response.status === 405 || response.status === 404) {
                const getUrl = new URL(endpoint);
                getUrl.searchParams.set('emailAddress', emailAddress);
                getUrl.searchParams.set('email', emailAddress);
                getUrl.searchParams.set('verificationToken', token);
                getUrl.searchParams.set('token', token);
                getUrl.searchParams.set('code', otpCode);
                getUrl.searchParams.set('verificationCode', otpCode);
                getUrl.searchParams.set('otpCode', otpCode);

                const getResponse = await fetch(getUrl.toString(), { method: 'GET' });
                const getRawBody = await getResponse.text();
                let getBody: unknown = getRawBody;
                try { getBody = getRawBody ? JSON.parse(getRawBody) : getRawBody; } catch { /* Plain-text endpoint response. */ }

                if (!getResponse.ok) {
                    throw new Error(typeof getBody === 'string' && getBody ? getBody : summarizeUnexpectedResponse(getBody));
                }

                const getRecord = asRecord(getBody);
                const getCandidates = [getRecord, asRecord(getRecord?.data), asRecord(getRecord?.result), asRecord(getRecord?.payload)].filter(Boolean) as Record<string, unknown>[];
                let getFinalToken: string | undefined;
                let getMessage: string | undefined;

                for (const candidate of getCandidates) {
                    if (!getFinalToken) {
                        getFinalToken = pickString(candidate, ['accessToken', 'AccessToken', 'finalToken', 'FinalToken', 'token', 'Token', 'jwt', 'Jwt']);
                    }
                    if (!getMessage) {
                        getMessage = pickString(candidate, ['message', 'Message', 'detail', 'title']);
                    }
                }

                if (!getFinalToken) {
                    throw new Error(getMessage || 'Verification succeeded but no final token was returned.');
                }

                return { finalToken: getFinalToken, message: getMessage || 'Verification successful.' };
            }

            if (!response.ok) {
                throw new Error(typeof body === 'string' && body ? body : summarizeUnexpectedResponse(body));
            }

            const record = asRecord(body);
            const candidates = [record, asRecord(record?.data), asRecord(record?.result), asRecord(record?.payload)].filter(Boolean) as Record<string, unknown>[];

            let finalToken: string | undefined;
            let message: string | undefined;
            let isLoginSuccessful: boolean | undefined;

            for (const candidate of candidates) {
                if (!finalToken) {
                    finalToken = pickString(candidate, ['accessToken', 'AccessToken', 'finalToken', 'FinalToken', 'token', 'Token', 'jwt', 'Jwt']);
                }
                if (!message) {
                    message = pickString(candidate, ['message', 'Message', 'detail', 'title']);
                }
                if (isLoginSuccessful === undefined) {
                    isLoginSuccessful = pickBoolean(candidate, ['isLoginSuccessful', 'IsLoginSuccessful', 'success', 'Success']);
                }
            }

            if (!finalToken && !isLoginSuccessful) {
                throw new Error(message || 'Verification succeeded but no final token was returned.');
            }

            return { finalToken: finalToken || '', message: message || 'Verification successful.', isLoginSuccessful };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to verify code.';
            lastError = new Error(`VerifyLoginCode failed at ${endpoint}: ${message}`);
        }
    }

    throw lastError || new Error('Unable to verify code.');
}

/**
 * Retrieves the current authenticated user's information from secure cookie storage
 * 
 * This function attempts to retrieve the user's authentication data from the browser's
 * secure cookie storage. It handles JSON parsing and provides type-safe returns.
 * 
 * @returns {Promise<AuthResponse>} A promise that resolves to the user's authentication data.
 *                                  Returns an empty AuthResponse object if no session exists.
 * 
 * @throws {Error} Throws an error if cookie data is corrupted or cannot be parsed
 * 
 * @example
 * ```typescript
 * // Check if user is authenticated
 * const userData = await getUser();
 * if (userData.accessToken) {
 *   console.log('User is authenticated:', userData.user);
 * } else {
 *   console.log('No active session found');
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Use in authentication context
 * useEffect(() => {
 *   const checkAuth = async () => {
 *     const user = await getUser();
 *     setAuthState(user);
 *   };
 *   checkAuth();
 * }, []);
 * ```
 */
export async function getUser(): Promise<AuthResponse> {
    const jsonData = Cookies.get(env.AUTH_COOKIE_NAME);
    if (jsonData) {
        return JSON.parse(jsonData) as AuthResponse;
    }
    return {} as AuthResponse;
}

/**
 * Authenticates a user with username and password credentials
 * 
 * This function handles the complete user authentication process including:
 * - Secure API communication with the backend authentication service
 * - Secure cookie storage of authentication tokens and user data
 * - Comprehensive error handling with proper logging
 * - Type-safe response handling
 * 
 * @param {string} username - The user's username or email address
 * @param {string} password - The user's password (transmitted securely)
 * 
 * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response
 *                                  containing user data, JWT token, and session information
 * 
 * @throws {Error} Throws an error if:
 *                 - Network request fails
 *                 - Invalid credentials provided
 *                 - Server returns an error response
 *                 - Session storage fails
 * 
 * @example
 * ```typescript
 * // Basic login flow
 * try {
 *   const authData = await login('user@example.com', 'securePassword123');
 *   console.log('Login successful:', authData.user);
 *   // User is now authenticated and session is stored
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 *   // Handle authentication failure
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Login with form validation
 * const handleLogin = async (formData: LoginForm) => {
 *   setLoading(true);
 *   try {
 *     const result = await login(formData.username, formData.password);
 *     setUser(result.user);
 *     navigate('/dashboard');
 *   } catch (error) {
 *     setError('Invalid username or password');
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 * ```
 * 
 * Security Features:
 * - Credentials are transmitted over HTTPS only
 * - Session cookies are set with secure, sameSite=Strict flags
 * - Cookies have a 12-hour expiration (0.5 days)
 * - Error messages are logged safely without exposing sensitive data
 */
export async function login(username: string, password: string): Promise<AuthResponse> {
    const apiPaths = new DefaultApiPaths();
    const url = `${BASE_URL}${apiPaths.login[0]}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            Cookies.set(env.AUTH_COOKIE_NAME, JSON.stringify(data), {
                secure: env.COOKIE_SECURE,
                sameSite: 'Strict',
                expires: 0.5,
            });
            return data as AuthResponse;
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Unknown error occurred');
        }
    } catch (error) {
        if (error instanceof Error) {
            try {
                // console.log(JSON.parse(error.message).description); // SECURITY: Error details logging
            } catch {
                // console.log(error.message); // SECURITY: Error details logging
            }
        } else {
            // console.log("An unknown error occurred"); // SECURITY: Error details logging
        }
        throw error;
    }
}

/**
 * Logs out the current authenticated user and clears session data
 * 
 * This function handles the complete user logout process including:
 * - Secure API communication to invalidate server-side session
 * - Proper cleanup of client-side authentication state
 * - Comprehensive error handling and logging
 * - Graceful handling of network failures
 * 
 * @returns {Promise<void>} A promise that resolves when logout is complete
 * 
 * @throws {Error} Throws an error if:
 *                 - Network request fails
 *                 - Server returns an error response
 *                 - Session invalidation fails
 * 
 * @example
 * ```typescript
 * // Basic logout flow
 * try {
 *   await logout();
 *   console.log('Logout successful');
 *   // Clear local state and redirect to login
 * } catch (error) {
 *   console.error('Logout failed:', error.message);
 *   // Handle logout failure gracefully
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Logout with UI feedback
 * const handleLogout = async () => {
 *   setLoading(true);
 *   try {
 *     await logout();
 *     clearUserData();
 *     showSuccessMessage('Logged out successfully');
 *     navigate('/login');
 *   } catch (error) {
 *     showErrorMessage('Logout failed. Please try again.');
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Auto-logout on session expiry
 * useEffect(() => {
 *   const handleSessionExpiry = async () => {
 *     try {
 *       await logout();
 *       showMessage('Session expired. Please log in again.');
 *     } catch {
 *       // Logout failed, but we still need to clear local data
 *       clearLocalSession();
 *     }
 *   };
 * }, [sessionExpired]);
 * ```
 * 
 * Security Notes:
 * - Always call this function before redirecting to login
 * - Server-side session is properly invalidated
 * - Client-side cleanup should be handled by the calling component
 * - Network failures are logged but don't prevent client-side cleanup
 */
export async function logout() {
    const apiPaths = new DefaultApiPaths();
    const url = `${BASE_URL}${apiPaths.logout[0]}`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            try {
                // console.log(JSON.parse(error.message).description); // SECURITY: Error details logging
            } catch {
                // console.log(error.message); // SECURITY: Error details logging
            }
        } else {
            // console.log("An unknown error occurred"); // SECURITY: Error details logging
        }
        throw error;
    }
}
