'use server';

import { loginSchema } from '@/app/lib/validations';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import type { FormState } from '@/types/auth';

export async function login(_prevState: FormState, formData: FormData): Promise<FormState> {
  // Get redirect URL from form data
  const redirectTo = formData.get('redirectTo') as string | null;
  // Validate form data
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    remember: formData.get('remember') === 'on',
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password, remember } = result.data;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Invalid credentials - don't reveal if email exists
    if (!user || !user.password) {
      return {
        errors: {
          email: ['Invalid email or password'],
        },
      };
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return {
        errors: {
          password: ['Invalid email or password'],
        },
      };
    }

    // Create session and set cookie
    await createSession(user.id, remember || false);
  } catch (error) {
    console.error('Login error:', error);
    return {
      errors: {
        email: ['An error occurred. Please try again.'],
      },
    };
  }

  // Redirect to homepage or the page they came from
  redirect(redirectTo && redirectTo !== '/login' ? redirectTo : '/');
}

