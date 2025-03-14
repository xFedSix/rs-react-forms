import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <h1>Forms in React</h1>
      <nav>
        <ul>
          <li>
            <Link to="/uncontrolled">Uncontrolled Form</Link>
          </li>
          <li>
            <Link to="/hook-form">React Hook Form</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainPage;
