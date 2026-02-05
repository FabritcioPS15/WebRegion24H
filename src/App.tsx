import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import AuthModal from './components/AuthModal';
import NewsDetailPage from './components/NewsDetailPage';
import HomePage from './pages/HomePage';
import PodcastsPage from './pages/PodcastsPage';
import VideosPage from './pages/VideosPage';
import EditorPage from './pages/EditorPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [showAuth, setShowAuth] = useState(false);

  const handleAdminClick = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    window.location.href = '/admin';
  };

  return (
    <Router>
      <NewsProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage onAdminClick={handleAdminClick} />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/admin" element={<EditorPage />} />
          <Route path="/articulo/:id" element={<NewsDetailPage />} />
        </Routes>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      </NewsProvider>
    </Router>
  );
}

export default App;
