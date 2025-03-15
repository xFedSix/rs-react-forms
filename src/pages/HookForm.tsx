import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const COUNTRIES = ['Russia', 'Belarus', 'Kazakhstan', 'Ukraine'];

interface FormInputs {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  avatar: FileList;
  country: string;
  agreement: boolean;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Z][a-zA-Z]*$/, 'First letter should be uppercase'),

  age: yup
    .number()
    .required('Age is required')
    .min(0, 'Age cannot be negative')
    .typeError('Age must be a number'),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),

  password: yup
    .string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?:{}|<>]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  gender: yup
    .string()
    .required('Please select gender')
    .oneOf(['male', 'female'], 'Invalid gender selection'),

  avatar: yup
    .mixed<FileList>()
    .required('Photo is required')
    .test(
      'is-file-list',
      'Value is not a FileList',
      (value): value is FileList => value instanceof FileList
    )
    .test('fileFormat', 'Only JPEG and PNG files are allowed', (value) => {
      if (!value || value.length === 0) return false;
      return ['image/jpeg', 'image/png'].includes(value[0].type);
    })
    .test('fileSize', 'File size should not exceed 5MB', (value) => {
      if (!value || value.length === 0) return false;
      return value[0].size <= 5 * 1024 * 1024;
    }),
  country: yup
    .string()
    .required('Country is required')
    .oneOf(COUNTRIES, 'Please select a valid country'),

  agreement: yup
    .boolean()
    .required('You must accept the terms')
    .oneOf([true], 'You must accept the terms')
});

const HookForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const password = watch('password');

  const validatePassword = (value: string): string => {
    const hasNumber = /\d/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (hasNumber && hasUpper && hasLower && hasSpecial) {
      return 'Strong';
    } else if ((hasNumber && hasUpper) || (hasLower && hasSpecial)) {
      return 'Medium';
    }
    return 'Low';
  };

  const onSubmit = (data: FormInputs) => {
    if (data.avatar[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Здесь можно отправить base64String в Redux store
        console.log({ ...data, avatar: base64String });
      };
      reader.readAsDataURL(data.avatar[0]);
    }
  };

  return (
    <div className="form-container">
      <h1>React Hook Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input {...register('name')} type="text" id="name" />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input {...register('age')} type="number" id="age" />
          {errors.age && <span className="error">{errors.age.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input {...register('email')} type="email" id="email" />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            {...register('password')}
            type="password"
            id="password"
            title={`Password strength: ${validatePassword(password || '')}`}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password:</label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <div className="gender-radio-group">
            <div>
              <input
                {...register('gender')}
                type="radio"
                value="male"
                id="male"
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                {...register('gender')}
                type="radio"
                value="female"
                id="female"
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
          {errors.gender && (
            <span className="error">{errors.gender.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Photo:</label>
          <input
            {...register('avatar')}
            type="file"
            id="avatar"
            accept=".jpg,.jpeg,.png"
          />
          {errors.avatar && (
            <span className="error">{errors.avatar.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input
            {...register('country')}
            type="text"
            id="country"
            list="countries"
          />
          <datalist id="countries">
            {COUNTRIES.map((country) => (
              <option key={country} value={country} />
            ))}
          </datalist>
          {errors.country && (
            <span className="error">{errors.country.message}</span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <input {...register('agreement')} type="checkbox" id="agreement" />
          <label htmlFor="agreement">
            I accept the terms of the user agreement
          </label>
          {errors.agreement && (
            <span className="error">{errors.agreement.message}</span>
          )}
        </div>

        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>
      <Link to="/" className="back-link">
        Back to main page
      </Link>
    </div>
  );
};

export default HookForm;
