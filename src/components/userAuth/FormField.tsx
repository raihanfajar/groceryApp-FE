import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormFieldProps } from "./typesAndInterfaces";

export function FormField<T extends Record<string, string>>({
  id,
  label,
  type = "text",
  placeholder,
  formik,
}: FormFieldProps<T>) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-extrabold text-green-700">
        {label}
        {formik.touched[id] && formik.errors[id] && (
          <p className="ml-auto text-xs text-red-600">
            {formik.errors[id] as string}
          </p>
        )}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={formik.values[id]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className="mt-1 border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
      />
    </div>
  );
}
