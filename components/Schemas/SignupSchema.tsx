import * as Yup from "yup";

const SignupSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters")
    .required("Password is required"),
  repeatedPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default SignupSchema;
