import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface SwitchFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  disabled?: boolean;
}

/**
 * react-hook-form + shadcn Switch wrapper.
 * Used for boolean toggles: isFeatured, isActive, isDefault, etc.
 *
 * @example
 * <SwitchField control={form.control} name="isFeatured" label="Featured Product" />
 */
export function SwitchField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: SwitchFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-lg border p-4 gap-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base cursor-pointer">{label}</FormLabel>
            {description && (
              <FormDescription className="text-sm">{description}</FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
