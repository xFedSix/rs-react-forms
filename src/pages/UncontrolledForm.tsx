import { useRef, FormEvent, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { setUncontrolledFormData } from '../store/formSlice';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();

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
            const formDataWithAvatar = {
              ...data,
              avatar: base64String,
              name: data.name as string,
              age: Number(data.age),
              email: data.email as string,
              password: data.password as string,
              confirmPassword: data.confirmPassword as string,
              gender: data.gender as string,
              country: data.country as string,
              agreement: data.agreement === 'on'
            };
            dispatch(setUncontrolledFormData(formDataWithAvatar));
            console.log(formDataWithAvatar);
          };
          reader.readAsDataURL(file);
        }

        setErrors({});
        setIsFormValid(true);
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const validationErrors = err.inner.reduce(
            (acc, error) => {
              if (error.path) {
                acc[error.path] = error.message;
              }
              return acc;
            },
            {} as Record<string, string>
          );

          setErrors(validationErrors);
          setIsFormValid(false);

          Object.entries(validationErrors).forEach(([field, message]) => {
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

  useEffect(() => {
    setIsFormValid(Object.keys(errors).length === 0);
  }, [errors]);

  return (
    <div className="form-container">
      <h1>Uncontrolled Form</h1>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" min="0" required />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          {errors.email && <span className="error">{errors.email}</span>}
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
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <div className="gender-radio-group">
            <input type="radio" id="male" name="gender" value="male" required />
            <label htmlFor="male">Male</label>
            <input type="radio" id="female" name="gender" value="female" />
            <label htmlFor="female">Female</label>
          </div>
          {errors.gender && <span className="error">{errors.gender}</span>}
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
          {errors.avatar && <span className="error">{errors.avatar}</span>}
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
          {errors.country && <span className="error">{errors.country}</span>}
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="agreement" name="agreement" required />
          <label htmlFor="agreement">
            I accept the terms of the user agreement
          </label>
          {errors.agreement && (
            <span className="error">{errors.agreement}</span>
          )}
        </div>

        <button type="submit" disabled={!isFormValid}>
          Submit
        </button>
      </form>
      <Link to="/">Return to main page</Link>
    </div>
  );
};

export default UncontrolledForm;
