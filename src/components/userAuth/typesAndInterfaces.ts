import { FormikProps } from "formik";

// !HOOKS
export interface baseUserResponse {
    status: string;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        oauthProvider: string | null;
        isVerified: boolean;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        accessToken: string;
    };
};

export interface baseError {
    response: {
        data: {
            message: string;
        },
        status: number
    }
}

// !FORM COMPONENTS
export type RegisterFormValues = {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
};

export type LoginFormValues = {
    email: string;
    password: string;
};

export type ResetPasswordFormValues = {
    newPassword: string;
    confirmPassword: string;
}

export type FormFieldProps<T extends Record<string, string>> = {
    id: keyof T & string;
    label: string;
    type?: string;
    placeholder?: string;
    formik: FormikProps<T>;
};

export type PasswordFieldProps<T extends Record<string, string>> = {
    id: keyof T & string;
    label: string;
    placeholder?: string;
    formik: FormikProps<T>;
    withPopover?: boolean;
};