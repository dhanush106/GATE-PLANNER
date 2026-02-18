import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectBoard from './pages/SubjectBoard';
import Revisions from './pages/Revisions';
import Mocks from './pages/Mocks';
import PYQs from './pages/PYQs';
import useStore from './store/useStore';
import { useEffect } from 'react';

const AppLayout = ({ children }) => {
  const isDarkMode = useStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-24 animate-fade-in overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

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
