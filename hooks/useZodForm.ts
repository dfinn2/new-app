import { useState } from 'react';
import { z } from 'zod';

export function useZodForm<T extends z.ZodType>(schema: T, initialValues: Partial<z.infer<T>> = {}) {
  type FormData = z.infer<T>;
  
  const [formData, setFormData] = useState<Partial<FormData>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = (): boolean => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            const path = err.path.join('.');
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleChange = (name: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (onSubmit: (data: FormData) => Promise<void>) => {
    setIsSubmitting(true);
    
    if (validate()) {
      try {
        await onSubmit(formData as FormData);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }
    
    setIsSubmitting(false);
  };
  
  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validate
  };
}