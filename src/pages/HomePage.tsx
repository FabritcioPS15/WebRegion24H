import Header from '../components/Header';
import FeaturedNews from '../components/FeaturedNews';
import NewsGrid from '../components/NewsGrid';
import PodcastSection from '../components/PodcastSection';
import SportsSection from '../components/SportsSection';
import HighlightSection from '../components/HighlightSection';
import VideosSection from '../components/VideosSection';
import Footer from '../components/Footer';
import { Settings } from 'lucide-react';

import { useNews } from '../context/NewsContext';

interface HomeProps {
  onAdminClick: () => void;
}

const HomePage = ({ onAdminClick }: HomeProps) => {
  const { isLoading } = useNews();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
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
};

export default HomePage;
