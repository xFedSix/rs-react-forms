import { useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const COUNTRIES = ['Russia', 'Belarus', 'Kazakhstan', 'Ukraine'];

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
    .mixed()
    .required('Photo is required')
    .test('fileFormat', 'Only JPEG and PNG files are allowed', (value) => {
      if (!value) return false;
      const file = value as File;
      return ['image/jpeg', 'image/png'].includes(file.type);
    })
    .test('fileSize', 'File size should not exceed 5MB', (value) => {
      if (!value) return false;
      const file = value as File;
      return file.size <= 5 * 1024 * 1024;
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

const UncontrolledForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const validatePassword = (password: string): string => {
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasNumber && hasUpper && hasLower && hasSpecial) {
      return 'Strong';
    } else if ((hasNumber && hasUpper) || (hasLower && hasSpecial)) {
      return 'Medium';
    }
    return 'Low';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const data = Object.fromEntries(formData);

      data.agreement = (formData.get('agreement') ===
        'on') as unknown as FormDataEntryValue;

      try {
        await schema.validate(data, { abortEarly: false });

        const file = formData.get('avatar') as File;
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            console.log({ ...data, avatar: base64String });
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const errors = err.inner.reduce(
            (acc, error) => {
              if (error.path) {
                acc[error.path] = error.message;
              }
              return acc;
            },
            {} as Record<string, string>
          );

          Object.entries(errors).forEach(([field, message]) => {
            const element = formRef.current?.querySelector(`[name="${field}"]`);
            if (element) {
              (element as HTMLInputElement).setCustomValidity(message);
              (element as HTMLInputElement).reportValidity();
            }
          });
        }
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Uncontrolled Form</h1>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" min="0" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={(e) => {
              const strength = validatePassword(e.target.value);
              e.target.title = `Password strength: ${strength}`;
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <div className="radio-group">
            <input type="radio" id="male" name="gender" value="male" required />
            <label htmlFor="male">Male</label>
            <input type="radio" id="female" name="gender" value="female" />
            <label htmlFor="female">Female</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Photo:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept=".jpg,.jpeg,.png"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            list="countries"
            required
          />
          <datalist id="countries">
            {COUNTRIES.map((country) => (
              <option key={country} value={country} />
            ))}
          </datalist>
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="agreement" name="agreement" required />
          <label htmlFor="agreement">
            I accept the terms of the user agreement
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>
      <Link to="/">Return to main page</Link>
    </div>
  );
};

export default UncontrolledForm;
