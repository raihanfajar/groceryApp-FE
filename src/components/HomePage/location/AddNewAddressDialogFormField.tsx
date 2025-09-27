"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";

interface Props<T> {
  formik: FormikProps<T>;
  name: keyof T;
  label: string;
  placeholder: string;
  maxLength: number;
  baseCn: string; // inputBaseCn
  counter?: boolean;
  hint?: string; // default hint text
}

export default function AddNewAddressDialogFormField<T>({
  formik,
  name,
  label,
  placeholder,
  maxLength,
  baseCn,
  counter = true,
  hint,
}: Props<T>) {
  const field = formik.getFieldProps(name as string);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name] as string;

  return (
    <div className="space-y-1">
      <Label htmlFor={name as string}>{label}</Label>
      <Input
        {...field}
        id={name as string}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          baseCn,
          error && "border-red-500",
          "text-xs sm:text-base",
        )}
      />
      <div className="flex text-xs text-gray-500">
        <p id="goodOrBad" className={cn(error && "text-red-500")}>
          {error ? (formik.errors[name] as string) : hint}
        </p>
        {counter && (
          <p id="counter" className="ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
