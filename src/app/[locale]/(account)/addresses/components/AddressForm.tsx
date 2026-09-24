"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressFormData, addressSchema } from "../validation/address.schema";
import { FormField } from "@/components/forms/FormField";
import { SwitchField } from "@/components/forms/SwitchField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Address } from "@/types/user";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => void;
  isSubmitting: boolean;
  initialData?: Address | null;
}

export function AddressForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
}: AddressFormProps) {
  const t = useTranslations("addresses");
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      fullName: "",
      phone: "",
      street: "",
      city: "",
      governorate: "",
      postalCode: "",
      isDefault: false,
    },
  });

  // Reset form when opened with new data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          label: initialData.label,
          fullName: initialData.fullName,
          phone: initialData.phone,
          street: initialData.street,
          city: initialData.city,
          governorate: initialData.governorate,
          postalCode: initialData.postalCode || "",
          isDefault: initialData.isDefault,
        });
      } else {
        form.reset({
          label: "",
          fullName: "",
          phone: "",
          street: "",
          city: "",
          governorate: "",
          postalCode: "",
          isDefault: false,
        });
      }
    }
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("form.editTitle", { defaultMessage: "Edit Address" })
              : t("form.addTitle", { defaultMessage: "Add New Address" })}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-4"
          >
            <FormField
              control={form.control as any}
              name="label"
              label={t("form.label", { defaultMessage: "Address Label" })}
              placeholder={t("form.labelPlaceholder", {
                defaultMessage: "e.g. Home, Work",
              })}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="fullName"
                label={t("form.fullName", { defaultMessage: "Full Name" })}
                placeholder={t("form.fullNamePlaceholder", {
                  defaultMessage: "John Doe",
                })}
              />
              <FormField
                control={form.control as any}
                name="phone"
                label={t("form.phone", { defaultMessage: "Phone Number" })}
                placeholder={t("form.phonePlaceholder", {
                  defaultMessage: "+2010...",
                })}
              />
            </div>

            <FormField
              control={form.control as any}
              name="street"
              label={t("form.street", { defaultMessage: "Street Address" })}
              placeholder={t("form.streetPlaceholder", {
                defaultMessage: "Building, Street, Area",
              })}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="city"
                label={t("form.city", { defaultMessage: "City" })}
              />
              <FormField
                control={form.control as any}
                name="governorate"
                label={t("form.governorate", { defaultMessage: "Governorate" })}
              />
            </div>

            <FormField
              control={form.control as any}
              name="postalCode"
              label={t("form.postalCode", {
                defaultMessage: "Postal Code (Optional)",
              })}
            />

            <SwitchField
              control={form.control as any}
              name="isDefault"
              label={t("form.isDefault", {
                defaultMessage: "Set as default address",
              })}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("form.cancel", { defaultMessage: "Cancel" })}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("form.saving", { defaultMessage: "Saving..." })
                  : t("form.submit", { defaultMessage: "Save Address" })}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
