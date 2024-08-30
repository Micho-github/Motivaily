import * as Yup from "yup";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

export default LoginSchema;