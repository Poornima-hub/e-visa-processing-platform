import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ApplicationList from './pages/ApplicationList';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetail from './pages/ApplicationDetail';
// import Tasks from './pages/Tasks';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/tasks" element={<Tasks />} /> */}
        <Route path="/" element={<ApplicationList />} />
        <Route path="/applications/new" element={<ApplicationForm />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
