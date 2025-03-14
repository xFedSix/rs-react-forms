import { useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';

const UncontrolledForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const file = formData.get('avatar') as File;
      if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          alert('Only JPEG и PNG files are allowed');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('The file size should not exceed 5 MB');
          return;
        }
      }

      console.log(Object.fromEntries(formData));
    }
  };

  const validatePassword = (password: string): string => {
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 'Low';
    if (hasNumber && hasUpper && hasLower && hasSpecial) {
      strength = 'Strong';
    } else if ((hasNumber && hasUpper) || (hasLower && hasSpecial)) {
      strength = 'Medium';
    }
    return strength;
  };

  return (
    <div>
      <h1>Uncontrolled Form</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            pattern="[A-Z][a-zA-Z]*"
            required
            title="First letter should be uppercase"
          />
        </div>

        <div>
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" min="0" required />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?:{}|<>])[A-Za-z\d!@#$%^&*(),.?:{}|<>]{8,}$"
            required
            onChange={(e) => {
              const strength = validatePassword(e.target.value);
              e.target.title = `Password strength: ${strength}`;
            }}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Conform password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>

        <div>
          <label>Gender:</label>
          <div className="genders-container">
            <input type="radio" id="male" name="gender" value="male" required />
            <label htmlFor="male">Male</label>
            <input type="radio" id="female" name="gender" value="female" />
            <label htmlFor="female">Female</label>
          </div>
        </div>

        <div>
          <label htmlFor="avatar">Photo:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept=".jpg,.jpeg,.png"
            required
          />
        </div>

        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            list="countries"
            required
          />
          <datalist id="countries">
            <option value="Russia" />
            <option value="Belarus" />
            <option value="Kazakhstan" />
            <option value="Ukraine" />
          </datalist>
        </div>

        <div className="agreement">
          <input type="checkbox" id="agreement" name="agreement" required />
          <label htmlFor="agreement">
            I accept the terms of the user agreement
          </label>
        </div>

        <button type="submit">Send</button>
      </form>
      <Link to="/">Return to main page</Link>
    </div>
  );
};

export default UncontrolledForm;
