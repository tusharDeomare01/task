import { z } from 'zod';
import { FieldConfig } from '@/types/user';

export const userSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
});

export type UserFormData = z.infer<typeof userSchema>;

export const userFieldsConfig: FieldConfig[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter first name',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter last name',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
    required: true,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'john.doe@example.com',
    required: true,
  },
];
