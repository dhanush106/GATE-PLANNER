import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Sidebar from './components/Sidebar'; // New Sidebar
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectBoard from './pages/SubjectBoard';
import Revisions from './pages/Revisions';
import Mocks from './pages/Mocks';
import PYQs from './pages/PYQs';

const AppLayout = ({ children }) => (
  <div className="flex min-h-screen bg-base-bg text-text-main overflow-hidden">
    <Sidebar />
    <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden custom-scrollbar bg-section-bg/30">
      <div className="p-6 md:p-10">
        {children}
      </div>
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
