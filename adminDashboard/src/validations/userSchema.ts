import * as yup from 'yup';

export const userSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email'),
  role: yup.string()
    .required('Role is required')
    .oneOf(['Admin', 'Editor', 'Viewer'])
}); 