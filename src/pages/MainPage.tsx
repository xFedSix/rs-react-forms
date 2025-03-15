import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Link, useLocation } from 'react-router-dom';

const MainPage: React.FC = () => {
  const { uncontrolledFormData, hookFormData } = useSelector(
    (state: RootState) => state.avatar
  );
  const location = useLocation();
  const [isNewData, setIsNewData] = useState(false);

  useEffect(() => {
    if (location.state?.newData) {
      setIsNewData(true);
      const timer = setTimeout(() => {
        setIsNewData(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="main-page">
      <h1>Main Page</h1>

      <div className={`data-tile ${isNewData ? 'new-data' : ''}`}>
        <ul>
          <li>
            <Link to="/uncontrolled">Uncontrolled Form</Link>
          </li>
        </ul>
        <h2>Uncontrolled Form Data</h2>
        {uncontrolledFormData ? (
          <pre>{JSON.stringify(uncontrolledFormData, null, 2)}</pre>
        ) : (
          <p>No data</p>
        )}
      </div>
      <div className={`data-tile ${isNewData ? 'new-data' : ''}`}>
        <ul>
          <li>
            <Link to="/hook-form">React Hook Form</Link>
          </li>
        </ul>
        <h2>Hook Form Data</h2>
        {hookFormData ? (
          <pre>{JSON.stringify(hookFormData, null, 2)}</pre>
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
