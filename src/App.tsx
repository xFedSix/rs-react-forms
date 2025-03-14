import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UncontrolledForm from './pages/UncontrolledForm';
import HookForm from './pages/HookForm';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/uncontrolled" element={<UncontrolledForm />} />
        <Route path="/hook-form" element={<HookForm />} />
      </Routes>
    </Router>
  );
}

export default App;
