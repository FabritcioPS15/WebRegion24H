import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import Header from './components/Header';
import FeaturedNews from './components/FeaturedNews';
import NewsGrid from './components/NewsGrid';
import PodcastSection from './components/PodcastSection';
import SportsSection from './components/SportsSection';
import HighlightSection from './components/HighlightSection';
import VideosSection from './components/VideosSection';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import NewsDetailPage from './components/NewsDetailPage';
import { Settings } from 'lucide-react';

const Home = ({ onAdminClick }: { onAdminClick: () => void }) => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="fixed bottom-8 right-8 z-[100]">
      <button
        onClick={onAdminClick}
        className="bg-accent text-white p-4 border border-white/20 shadow-2xl hover:bg-brand transition-all group"
        title="Panel de Administración"
      >
        <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </div>
    <FeaturedNews />
    <NewsGrid />
    <PodcastSection />
    <SportsSection />
    <HighlightSection />
    <VideosSection />
    <Footer />
  </div>
);

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
        <Routes>
          <Route path="/" element={<Home onAdminClick={handleAdminClick} />} />
          <Route path="/admin" element={<AdminPanel onBack={() => window.location.href = '/'} />} />
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
