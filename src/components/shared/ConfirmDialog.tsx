'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
  /** 'destructive' shows red button (default for deletes) */
  variant?: 'destructive' | 'default';
}

/**
 * Global confirmation dialog — used for any dangerous action (delete, cancel, etc.).
 * Blocks action until user explicitly confirms.
 *
 * @example
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Delete Product"
 *   description="This cannot be undone."
 *   onConfirm={() => deleteProduct(id)}
 *   isPending={isDeleting}
 * />
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isPending = false,
  variant = 'destructive',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
