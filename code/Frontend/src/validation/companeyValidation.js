import * as Yup from 'yup';

const companeyUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Email must be valid'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  image: Yup.string().optional(),
});

const companeyValidation = Yup.object().shape({
  companeyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  companeyEmail: Yup.string()
    .required('Company email is required')
    .email('Company email must be valid'),
  companeyPhone: Yup.string()
    .required('Company phone is required')
    .matches(/^[0-9\-\+\(\)\s]+$/, 'Phone must be a valid phone number')
    .min(10, 'Phone must be at least 10 characters'),
  companeyAddress: Yup.string()
    .required('Company address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  companeyDoc: Yup.string().required('Company document/logo is required'),
  companeyUsers: Yup.array()
    .of(companeyUserSchema)
    .min(1, 'At least one user is required')
    .required('Users are required'),
});

export default companeyValidation;
