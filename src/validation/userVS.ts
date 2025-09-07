import * as Yup from "yup";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const phoneNumberRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export const userRegisterSchema = Yup.object({
    name: Yup.string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),

    email: Yup.string()
        .trim()
        .matches(emailRegex, "Invalid email address")
        .required("Email is required"),

    phoneNumber: Yup.string()
        .trim()
        .matches(phoneNumberRegex, "Invalid Indonesian phone number")
        .required("Phone number is required"),

    password: Yup.string()
        .trim()
        .matches(
            passwordRegex,
            "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required("Password is required"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

export const userLoginSchema = Yup.object({
    email: Yup.string()
        .trim()
        .matches(emailRegex, "Invalid email address")
        .required("Email is required"),

    password: Yup.string()
        .trim()
        .required("Password is required"),
});