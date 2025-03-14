import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

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

const HookForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<FormInputs>();

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
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    if (data.avatar[0]) {
      const file = data.avatar[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('avatar', {
          type: 'manual',
          message: 'Only JPEG and PNG files are allowed'
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('avatar', {
          type: 'manual',
          message: 'File size should not exceed 5MB'
        });
        return;
      }
    }

    console.log(data);
  };

  return (
    <div>
      <h1>React Hook Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            {...register('name', {
              required: 'Name is required',
              pattern: {
                value: /^[A-Z][a-zA-Z]*$/,
                message: 'First letter should be uppercase'
              }
            })}
            type="text"
            id="name"
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="age">Age:</label>
          <input
            {...register('age', {
              required: 'Age is required',
              min: { value: 0, message: 'Age cannot be negative' }
            })}
            type="number"
            id="age"
          />
          {errors.age && <span>{errors.age.message}</span>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            id="email"
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?:{}|<>]{8,}$/,
                message:
                  'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
              }
            })}
            type="password"
            id="password"
            title={`Password strength: ${validatePassword(password || '')}`}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm password:</label>
          <input
            {...register('confirmPassword', {
              required: 'Please confirm your password'
            })}
            type="password"
            id="confirmPassword"
          />
          {errors.confirmPassword && (
            <span>{errors.confirmPassword.message}</span>
          )}
        </div>

        <div>
          <label>Gender:</label>
          <div className="genders-container">
            <input
              {...register('gender', { required: 'Please select gender' })}
              type="radio"
              value="male"
              id="male"
            />
            <label htmlFor="male">Male</label>
            <input
              {...register('gender')}
              type="radio"
              value="female"
              id="female"
            />
            <label htmlFor="female">Female</label>
          </div>
          {errors.gender && <span>{errors.gender.message}</span>}
        </div>

        <div>
          <label htmlFor="avatar">Photo:</label>
          <input
            {...register('avatar', { required: 'Photo is required' })}
            type="file"
            id="avatar"
            accept=".jpg,.jpeg,.png"
          />
          {errors.avatar && <span>{errors.avatar.message}</span>}
        </div>

        <div>
          <label htmlFor="country">Country:</label>
          <input
            {...register('country', { required: 'Country is required' })}
            type="text"
            id="country"
            list="countries"
          />
          <datalist id="countries">
            <option value="Russia" />
            <option value="Belarus" />
            <option value="Kazakhstan" />
            <option value="Ukraine" />
          </datalist>
          {errors.country && <span>{errors.country.message}</span>}
        </div>

        <div className="agreement">
          <input
            {...register('agreement', {
              required: 'You must accept the terms'
            })}
            type="checkbox"
            id="agreement"
          />
          <label htmlFor="agreement">
            I accept the terms of the user agreement
          </label>
          {errors.agreement && <span>{errors.agreement.message}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
      <Link to="/">Back to main page</Link>
    </div>
  );
};

export default HookForm;
