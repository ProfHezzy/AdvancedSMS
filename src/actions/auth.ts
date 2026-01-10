'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: any,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false,
        });

        return { success: true, message: 'Login successful' };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { success: false, message: 'Invalid credentials.' };
                default:
                    return { success: false, message: 'Something went wrong.' };
            }
        }
        return { success: false, message: 'Login failed. Please try again.' };
    }
}
