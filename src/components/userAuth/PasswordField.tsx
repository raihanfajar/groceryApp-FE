import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PasswordFieldProps } from "./typesAndInterfaces";

export function PasswordField<T extends Record<string, string>>({
  id,
  label,
  placeholder,
  formik,
  withPopover,
}: PasswordFieldProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-extrabold text-green-700"
      >
        {label}
        {withPopover && formik.touched[id] && formik.errors[id] && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                tabIndex={-1}
                className="ml-auto text-red-600 hover:text-red-800"
                aria-label="Password requirements"
              >
                <FaInfoCircle size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="max-w-xs text-sm text-red-600">
              {formik.errors[id] as string}
            </PopoverContent>
          </Popover>
        )}
        {!withPopover && formik.touched[id] && formik.errors[id] && (
          <p className="ml-auto text-xs text-red-600">
            {formik.errors[id] as string}
          </p>
        )}
      </Label>

      <div className="relative mt-1">
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          className="border-black bg-white pr-10 font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
