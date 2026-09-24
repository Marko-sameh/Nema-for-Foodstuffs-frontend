import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ReactNode } from 'react';

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  description?: string;
  render?: (field: any) => ReactNode; // Allow custom render for selects, etc.
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  disabled,
  description,
  render,
}: FormFieldProps<TFieldValues>) {
  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {render ? (
              render(field)
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value || ''}
              />
            )}
          </FormControl>
          {description && <p className="text-[0.8rem] text-muted-foreground">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
