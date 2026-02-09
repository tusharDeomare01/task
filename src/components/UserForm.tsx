'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, userFieldsConfig, UserFormData } from '@/lib/schema';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {userFieldsConfig.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} required={field.required}>
              {field.label}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name)}
              disabled={isSubmitting || isLoading}
              className={errors[field.name] ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {errors[field.name] && (
              <p className="text-sm text-red-600 mt-1">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
        >
          {(isSubmitting || isLoading) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {initialData ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
