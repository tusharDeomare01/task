export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export type UserFormData = Omit<User, 'id'>;

export interface FieldConfig {
  name: keyof UserFormData;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date';
  placeholder: string;
  required: boolean;
}
