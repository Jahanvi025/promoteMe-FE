import * as yup from "yup";
const phoneRegExp = /^[0-9]*$/;
const passwordRefExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
const expiryDateRegExp = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

const maxWords = (count: number) => {
  return yup.string().test('max-words', `Maximum ${count} words allowed`, (value) => {
    if (!value) return true; // Allow empty strings
    const wordCount = value.trim().split(/\s+/).length;
    return wordCount <= count;
  });
};

export const signupSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  username: yup.string().required("Username is a required field"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is a required field"),
  mobile_number: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .length(10, "Phone number must be exactly 10 characters")
    .required("Phone number is a required field"),
  password: yup
    .string()
    .matches(passwordRefExp, "Enter strong password")
    .min(8)
    .max(32)
    .required("Password is a required field"),
  lastActiveRole: yup.string().optional(),

});

export const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is a required field"),
  password: yup.string().required("Password is a required field"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is a required field"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(passwordRefExp, "Enter strong password")
    .min(8)
    .max(32)
    .required("Password is a required field"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is a required field"),
});

export const editProfileSchema = yup.object().shape({
  displayName: yup.string().required("Name is a required field"),
  username: yup.string().required("Username is a required field"),
  bio: maxWords(250).optional(),
  mobile_number: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .length(10, "Phone number must be exactly 10 characters")
    .required("Phone number is a required field"),
  date_of_birth: yup.string().optional(),
  gender: yup.string().required("Gender is a required field"),
  yearly_Price: yup
    .number()
    .typeError('Yearly Price must be a valid number')
    .optional()
    .min(0, 'Yearly Price cannot be negative'),

  monthly_Price: yup
    .number()
    .typeError('Monthly Price must be a valid number')
    .optional()
    .min(0, 'Monthly Price cannot be negative'),
});

export const editFanProfileSchema = yup.object().shape({
  displayName: yup.string().required("Name is a required field"),
  username: yup.string().required("Username is a required field"),
  mobile_number: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .length(10, "Phone number must be exactly 10 characters")
    .required("Phone number is a required field"),
  gender: yup.string().required("Gender is a required field"),
});

export const bankDetailsSchmea = yup.object().shape({
  firstName: yup.string().required("First name is a required field"),
  lastName: yup.string().required("Last name is a required field"),
  bankName: yup.string().required("Bank name is a required field"),
  accountNumber: yup.string().required("Account Number is a required field"),
  country: yup.string().optional(),
  state: yup.string().required("State is a required field"),
  city: yup.string().required("City is a required field"),
  address: yup.string().required("Address is a required field"),
  bankRouting: yup.string().required("Bank routing is a required field"),
  bankSwiftCode: yup.string().required("Bank swift code is a required field"),
  currency: yup.string().optional(),
});

export const changePassword = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Current Password is a required field")
    .matches(passwordRefExp, "Enter strong password")
    .min(8)
    .max(32),
  newPassword: yup
    .string()
    .required("New Password is a required field")
    .matches(passwordRefExp, "Enter strong password")
    .min(8)
    .max(32),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is a required field"),
});

export const ProductSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  price: yup.number().required("Price is required")
    .min(1).transform((value, originalValue) =>
      originalValue === '' ? undefined : value
    ),
  stock: yup.number().required("Stock is required")
    .min(1)
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value
    ),
  description: maxWords(100).required("Product description is required")
});

export const addressSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  address: yup.string().required("Address is required"),
  contactNumber: yup
    .number()
    .required("Contact Number is required")
    .typeError("Enter Valid Contact Number"),
  zipCode: yup.number()
    .required("Zip Code is a required field")
    .typeError("Enter Valid Zip Code"),
  state: yup.string().required("State is required"),
});

export const addCardSchema = yup.object().shape({
  name: yup.string().required("Card holder name is a required field"),
  number: yup
    .number()
    .required("Card number is a required field")
    .typeError("Card number must be a number")
    .test(
      "len",
      "Card number must be exactly 16 digits",
      (val) => val ? val.toString().length === 16 : true
    ),
  expiryDate: yup
    .string()
    .required("Expiry date is a required field")
    .matches(expiryDateRegExp, "Expiry date must be in MM/YY format"),
  CVV: yup
    .number()
    .required("CVV is a required field")
    .typeError("CVV must be a number")
    .test(
      "len",
      "CVV must be exactly 3 or 4 digits",
      (val) => val ? val.toString().length === 3 || val.toString().length === 4 : true
    ),
});