"use client";

import { Button } from "@/components/ui/button";
import { useGetUserProfileInfo } from "@/hooks/userProfile/useGetUserProfileInfo";
import { useUpdateUserProfileInfo } from "@/hooks/userProfile/useUpdateUserProfileInfo";
import { cn } from "@/lib/utils";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { Form, Formik } from "formik";
import { Check, Pencil, X, User, Phone, Mail } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const SettingsPersonalInfo = () => {
  const { accessToken } = useUserAuthStore();
  const { data: userData, isLoading } = useGetUserProfileInfo(accessToken);
  const { mutateAsync, isPending: isUpdatingUser } =
    useUpdateUserProfileInfo(accessToken);

  const [editingField, setEditingField] = useState<
    "name" | "phone" | "email" | null
  >(null);

  if (isLoading || !userData) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        <span className="animate-pulse">Loading user info…</span>
      </div>
    );
  }

  return (
    <div className="md:col-span-2">
      <h3 className="mb-6 text-2xl font-bold text-gray-800">Personal Info</h3>

      <Formik
        enableReinitialize
        initialValues={{
          name: userData.name ?? "",
          phone: userData.phoneNumber ?? "",
          email: userData.email ?? "",
        }}
        validationSchema={ProfileSchema}
        validateOnBlur
        validateOnChange
        onSubmit={async (values) => {
          try {
            await mutateAsync({
              name: values.name,
              email: values.email,
              phoneNumber: values.phone,
            });
            setEditingField(null);
          } catch {
            // toast handled in hook
          }
        }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          setFieldTouched,
          errors,
          touched,
          dirty,
        }) => (
          <Form className="space-y-6">
            {(
              [
                { key: "name", label: "Name", icon: User },
                { key: "phone", label: "Phone", icon: Phone },
                { key: "email", label: "Email", icon: Mail },
              ] as const
            ).map(({ key, label, icon: Icon }) => {
              const field = key as "name" | "phone" | "email";
              const error = errors[field];
              const isTouched = touched[field];

              return (
                <div key={key} className="group">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        {label}
                      </label>

                      {editingField === field ? (
                        <div className="flex items-center gap-2">
                          <input
                            name={field}
                            className={cn(
                              "h-10 w-full rounded-lg border px-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none",
                              error && isTouched
                                ? "border-red-400"
                                : "border-gray-300",
                            )}
                            value={values[field]}
                            onChange={handleChange}
                            onBlur={() => setFieldTouched(field, true)}
                            autoFocus
                            disabled={isUpdatingUser}
                          />
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            disabled={isUpdatingUser}
                            className="rounded-lg p-2 hover:bg-gray-100"
                          >
                            <Check className="h-5 w-5 text-green-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue(
                                field,
                                field === "phone"
                                  ? userData.phoneNumber
                                  : userData[field],
                              );
                              setEditingField(null);
                            }}
                            disabled={isUpdatingUser}
                            className="rounded-lg p-2 hover:bg-gray-100"
                          >
                            <X className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 shadow-sm">
                          <span className="text-sm font-medium text-gray-800">
                            {values[field]}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingField(field);
                              setFieldTouched(field, true, false);
                            }}
                            className="rounded-lg p-1.5 hover:bg-white"
                          >
                            <Pencil className="h-4 w-4 text-gray-400 hover:text-green-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {dirty && (
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
                  disabled={isUpdatingUser}
                >
                  {isUpdatingUser ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SettingsPersonalInfo;
