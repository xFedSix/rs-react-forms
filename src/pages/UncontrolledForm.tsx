import { useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';

const UncontrolledForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1>Неконтролируемая форма</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        {}
      </form>
      <Link to="/">Return to main page</Link>
    </div>
  );
};

export default UncontrolledForm;
