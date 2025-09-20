"use client";

import { Button } from "@/components/ui/button";
import { useGetUserProfileInfo } from "@/hooks/userProfile/useGetUserProfileInfo";
import { useUpdateUserProfileInfo } from "@/hooks/userProfile/useUpdateUserProfileInfo";
import { cn } from "@/lib/utils";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { Form, Formik } from "formik";
import { Check, Pencil, X } from "lucide-react";
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
    return <div className="p-4 text-gray-600">Loading user info…</div>;
  }

  return (
    <div className="md:col-span-2">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Info</h3>

      <Formik
        enableReinitialize
        initialValues={{
          name: userData.name ?? "",
          phone: userData.phoneNumber ?? "",
          email: userData.email ?? "",
        }}
        validationSchema={ProfileSchema}
        validateOnBlur
        validateOnChange // 👈 real-time validation
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
          <Form className="space-y-6 text-gray-700">
            {(["name", "phone", "email"] as const).map((field) => {
              const label =
                field === "name"
                  ? "Name"
                  : field === "phone"
                    ? "Phone"
                    : "Email";

              const error = errors[field];
              const isTouched = touched[field];

              return (
                <div
                  key={field}
                  className="flex flex-col sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="font-medium sm:w-40">{label}:</span>

                  {/* Editing */}
                  {editingField === field ? (
                    <div className="flex-1">
                      <input
                        name={field}
                        className={cn(
                          "mt-1 w-full rounded-md border px-2 py-1 text-gray-700 focus:outline-none sm:mt-0",
                          error && isTouched
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-green-500",
                        )}
                        value={values[field]}
                        onChange={handleChange}
                        onBlur={() => setFieldTouched(field, true)} // persist touched on blur
                        autoFocus
                        disabled={isUpdatingUser}
                      />
                      {/* {error && isTouched && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      )} */}
                    </div>
                  ) : (
                    <span className="mt-1 w-full flex-1 font-semibold sm:mt-0">
                      {values[field]}
                    </span>
                  )}

                  {/* Icons */}
                  {editingField === field ? (
                    <div className="mt-2 ml-auto flex gap-2 sm:mt-0">
                      <Check
                        size={18}
                        className={`cursor-pointer text-green-600 hover:text-green-700 ${
                          isUpdatingUser ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        onClick={() => {
                          if (!isUpdatingUser) {
                            setEditingField(null);
                          }
                        }}
                      />
                      <X
                        size={18}
                        className={`cursor-pointer text-gray-500 hover:text-red-500 ${
                          isUpdatingUser ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        onClick={() => {
                          if (!isUpdatingUser) {
                            // reset to original
                            setFieldValue(
                              field,
                              userData[
                                field === "phone" ? "phoneNumber" : field
                              ],
                            );
                            setEditingField(null);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <Pencil
                      size={18}
                      className="mt-2 ml-auto cursor-pointer text-gray-500 hover:text-green-600 sm:mt-0"
                      onClick={() => {
                        if (!isUpdatingUser) {
                          setEditingField(field);
                          // Mark touched immediately so error shows if invalid
                          setFieldTouched(field, true, false);
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}

            {dirty && (
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-green-600 px-6 text-white hover:bg-green-700 sm:w-auto"
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
