'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';

import Header from '../components/Header';
import FeaturedNews from '../components/FeaturedNews';
import NewsGrid from '../components/NewsGrid';
import PodcastSection from '../components/PodcastSection';
import SportsSection from '../components/SportsSection';
import HighlightSection from '../components/HighlightSection';
import VideosSection from '../components/VideosSection';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export default function HomeShell() {
  const [showAuth, setShowAuth] = useState(false);

  const handleAdminClick = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="fixed bottom-8 right-8 z-[100]">
        <button
          onClick={handleAdminClick}
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

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

