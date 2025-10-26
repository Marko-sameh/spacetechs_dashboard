import { useState, useCallback } from 'react';
import { validation } from '../utils';
interface ValidationRule {
  required?: boolean;
  email?: boolean;
  password?: boolean;
  url?: boolean;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null;
}
interface FormConfig<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule>>;
  onSubmit: (values: T) => Promise<void> | void;
}
/**
 * Unified form hook with validation
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: FormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validateField = useCallback((name: keyof T, value: string): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;
    if (rules.required && !validation.required(value)) {
      return `${String(name)} is required`;
    }
    if (rules.email && value && !validation.email(value)) {
      return 'Please enter a valid email address';
    }
    if (rules.password && value && !validation.password(value)) {
      return 'Password must be at least 8 characters long';
    }
    if (rules.url && value && !validation.url(value)) {
      return 'Please enter a valid URL';
    }
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }
    if (rules.custom) {
      return rules.custom(value);
    }
    return null;
  }, [validationRules]);
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValue(name as keyof T, finalValue);
  }, [setValue]);
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, String(values[fieldName] || ''));
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);
  return {
    values,
    errors,
    isSubmitting,
    setValue,
    handleChange,
    handleSubmit,
    reset,
    validateForm,
  };
}