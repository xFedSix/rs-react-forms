import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Link, useLocation } from 'react-router-dom';

type NewDataSource = 'uncontrolled' | 'hook';

interface LocationState {
  newDataSource?: NewDataSource;
}

const MainPage: React.FC = () => {
  const { uncontrolledFormData, hookFormData } = useSelector(
    (state: RootState) => state.avatar
  );
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const [isNewUncontrolledData, setNewUncontrolledData] = useState(false);
  const [isNewHookData, setNewHookData] = useState(false);

  useEffect(() => {
    if (state.newDataSource === 'uncontrolled') {
      setNewUncontrolledData(true);
      const timer = setTimeout(() => {
        setNewUncontrolledData(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (state.newDataSource === 'hook') {
      setNewHookData(true);
      const timer = setTimeout(() => {
        setNewHookData(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.newDataSource]);

  return (
    <div className="main-page">
      <h1>Main Page</h1>
      <div className={`data-tile ${isNewUncontrolledData ? 'new-data' : ''}`}>
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
      <div className={`data-tile ${isNewHookData ? 'new-data' : ''}`}>
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
