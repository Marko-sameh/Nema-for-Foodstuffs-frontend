'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

interface ImageUploadFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  /** 'single' replaces on every drop, 'multiple' appends */
  mode?: 'single' | 'multiple';
  maxFiles?: number;
  maxSize?: number; // bytes
}

/**
 * react-dropzone-powered image upload field integrated with react-hook-form.
 * Stores File objects in the form state — serialize to FormData before submitting.
 *
 * @example
 * <ImageUploadField control={form.control} name="thumbnailFile" label="Thumbnail" mode="single" />
 */
export function ImageUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  mode = 'single',
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5 MB
}: ImageUploadFieldProps<TFieldValues>) {
  const t = useTranslations('common');
  const { field, fieldState } = useController({ control, name });

  const files: File[] = Array.isArray(field.value)
    ? field.value
    : field.value
    ? [field.value]
    : [];

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (mode === 'single') {
        field.onChange(accepted[0] ?? null);
      } else {
        field.onChange([...files, ...accepted].slice(0, maxFiles));
      }
    },
    [field, files, mode, maxFiles],
  );

  const remove = (index: number) => {
    if (mode === 'single') {
      field.onChange(null);
    } else {
      const next = files.filter((_, i) => i !== index);
      field.onChange(next);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: mode === 'single' ? 1 : maxFiles,
    maxSize,
    multiple: mode === 'multiple',
  });

  const previews = files.map((f) => ({
    name: f.name,
    url: URL.createObjectURL(f),
  }));

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}

      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30',
        )}
      >
        <Input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? t('forms.dropFiles', { defaultMessage: 'Drop files here…' }) : t('forms.dragDrop', { defaultMessage: 'Drag & drop or click to browse' })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('forms.fileConstraints', { size: Math.round(maxSize / (1024 * 1024)), defaultMessage: 'JPG, PNG, WEBP · max {size} MB' })}
          {mode === 'multiple' && t('forms.upToFiles', { count: maxFiles, defaultMessage: ' · up to {count} files' })}
        </p>
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previews.map((p, i) => (
            <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="absolute top-1 end-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {fieldState.error && (
        <FormMessage>{fieldState.error.message}</FormMessage>
      )}
    </FormItem>
  );
}
