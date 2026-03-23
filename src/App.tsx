import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import AuthModal from './components/AuthModal';
import NewsDetailPage from './components/NewsDetailPage';
import PodcastDetailPage from './components/PodcastDetailPage';
import HomePage from './legacy-pages/HomePage';
import PodcastsPage from './legacy-pages/PodcastsPage';
import VideosPage from './legacy-pages/VideosPage';
import EditorPage from './legacy-pages/EditorPage';
import ScrollToTop from './components/ScrollToTop';
import LegalPage, { TermsContent, PrivacyContent, QualityContent } from './legacy-pages/LegalPage';

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
          <Route path="/podcast/:id" element={<PodcastDetailPage />} />
          <Route path="/terminos" element={<LegalPage title="Términos Legales" lastUpdated="22 de Marzo, 2026" content={<TermsContent />} />} />
          <Route path="/privacidad" element={<LegalPage title="Privacidad" lastUpdated="22 de Marzo, 2026" content={<PrivacyContent />} />} />
          <Route path="/calidad" element={<LegalPage title="Política de Calidad" lastUpdated="22 de Marzo, 2026" content={<QualityContent />} />} />
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
