import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface TextareaFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
  disabled?: boolean;
}

/**
 * react-hook-form + shadcn Textarea wrapper.
 *
 * @example
 * <TextareaField control={form.control} name="description" label="Description" rows={4} />
 */
export function TextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
  description,
  disabled,
}: TextareaFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          {description && (
            <p className="text-[0.8rem] text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
