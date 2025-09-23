import * as Yup from "yup";

const phoneNumberRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export const addNewAddressSchema = Yup.object().shape({
    addressLabel: Yup.string()
        .trim()
        .required("Required"),

    receiverName: Yup.string()
        .trim()
        .required("Required"),

    receiverPhoneNumber: Yup.string()
        .matches(phoneNumberRegex, "Valid Indonesian phone number please")
        .required("Required"),

    latLon: Yup.object().shape({
        lat: Yup.number()
            .notOneOf([0], "Latitude must be selected")
            .required("Latitude is required"),
        lon: Yup.number()
            .notOneOf([0], "Longitude must be selected")
            .required("Longitude is required"),
    }),

    addressDetails: Yup.string()
        .trim()
        .required("Required"),

    isDefault: Yup.boolean(), // optional, can still be false
});
