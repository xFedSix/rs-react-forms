import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const HookForm = () => {
  const { handleSubmit } = useForm();

  const onSubmit = (data: Record<string, string>) => {
    console.log(data);
  };

  return (
    <div>
      <h1>React Hook Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>{}</form>
      <Link to="/">Return to main page</Link>
    </div>
  );
};

export default HookForm;
