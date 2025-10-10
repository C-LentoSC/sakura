'use server';

import { registerSchema } from '@/app/lib/validations';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import type { FormState } from '@/types/auth';

export async function register(_prevState: FormState, formData: FormData): Promise<FormState> {
  // Validate form data
  const result = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = result.data;

  try {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return {
        errors: {
          email: ['Email already in use'],
        },
      };
    }

    // Hash password with bcrypt (cost factor 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with default USER role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // Auto-login: create session
    await createSession(user.id, false);
  } catch (error) {
    console.error('Registration error:', error);
    return {
      errors: {
        email: ['Registration failed. Please try again.'],
      },
    };
  }

  // Redirect to homepage after successful registration
  redirect('/');
}

