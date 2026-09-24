import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  description?: string;
  disabled?: boolean;
}

/**
 * react-hook-form + shadcn Select wrapper.
 * Drop-in for any enum/select field in every form.
 *
 * @example
 * <SelectField
 *   control={form.control}
 *   name="unitType"
 *   label="Unit Type"
 *   options={[{ label: 'By Weight', value: 'WEIGHT' }, { label: 'By Piece', value: 'PIECE' }]}
 * />
 */
export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder: externalPlaceholder,
  options,
  description,
  disabled,
}: SelectFieldProps<TFieldValues>) {
  const t = useTranslations('common');
  const placeholder = externalPlaceholder || t('forms.selectOption', { defaultMessage: 'Select an option' });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <p className="text-[0.8rem] text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
