import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectBoard from './pages/SubjectBoard';
import Revisions from './pages/Revisions';
import Mocks from './pages/Mocks';
import PYQs from './pages/PYQs';

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-950 text-slate-200 pt-16">
    <Navbar />
    <main className="max-w-dvw mx-auto p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/subjects" element={<AppLayout><Subjects /></AppLayout>} />
          <Route path="/subjects/:id" element={<AppLayout><SubjectBoard /></AppLayout>} />
          <Route path="/revisions" element={<AppLayout><Revisions /></AppLayout>} />
          <Route path="/mocks" element={<AppLayout><Mocks /></AppLayout>} />
          <Route path="/pyqs" element={<AppLayout><PYQs /></AppLayout>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
