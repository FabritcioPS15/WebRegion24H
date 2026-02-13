import { Search, Menu, Youtube, Facebook, Twitter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useNews();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (scrollPos > 80) {
        setIsScrolled(true);
      } else if (scrollPos < 10) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Real Fixed Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-[60] transition-all duration-200 shadow-sm">
        {/* Top Bar */}
        <div className={`bg-accent text-white overflow-hidden transition-all duration-200 text-[10px] font-black tracking-[0.2em] text-center uppercase ${isScrolled ? 'h-0 py-0' : 'h-auto py-1.5'}`}>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
            Edición Digital • Perú y el Mundo
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Masthead */}
          <div className={`border-b border-gray-100 flex flex-col items-center transition-all duration-300 ${isScrolled ? 'py-2 md:py-2' : 'py-6 md:py-10'}`}>
            <div className={`w-full flex justify-between items-center text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest font-sans transition-all duration-200 ${isScrolled ? 'h-0 opacity-0 mb-0 overflow-hidden' : 'h-auto opacity-100 mb-6 md:mb-8'}`}>
              <span className="hidden md:block">{currentDate}</span>
              <div className="flex items-center gap-6">
                <Youtube className="h-4 w-4 cursor-pointer hover:text-brand transition-colors" />
                <Facebook className="h-4 w-4 cursor-pointer hover:text-brand transition-colors" />
                <Twitter className="h-4 w-4 cursor-pointer hover:text-brand transition-colors" />
              </div>
            </div>

            <Link to="/" className="text-center group">
              <motion.div
                layout
                className="flex flex-col items-center"
              >
                <h1 className={`font-serif font-black text-accent tracking-tighter leading-none transition-all duration-300 ${isScrolled ? 'text-2xl md:text-3xl' : 'text-4xl sm:text-6xl lg:text-8xl'}`}>
                  NOTICIAS <span className="text-brand">24H</span>
                </h1>
                <div className={`h-0.5 bg-brand transition-all duration-300 ${isScrolled ? 'w-full mt-1' : 'w-1/4 mx-auto mt-2 group-hover:w-full'}`} />
                <p className={`font-serif italic text-gray-400 tracking-widest transition-all duration-200 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100 text-xs md:text-sm mt-4'}`}>FUNDADO PARA LA EXCELENCIA INFORMATIVA</p>
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="relative border-t border-black py-0">
            <div className="flex items-center justify-between">
              <button
                className="lg:hidden py-4 px-2 text-accent"
                onClick={toggleMobileMenu}
              >
                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  Secciones
                </div>
              </button>

              <div className="lg:hidden flex-1 px-4">
                {isSearchOpen ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                  >
                    <Search className="h-4 w-4" /> Buscar
                  </button>
                )}
              </div>

              <ul className={`hidden lg:flex items-center w-full ${mobileMenuOpen ? 'flex' : ''} flex-col lg:flex-row justify-center`}>
                {['Información', 'Nacionales', 'Internacionales', 'Economía', 'Deportes', 'Región', 'Más'].map((item) => (
                  <li key={item} className="group list-none">
                    <button
                      onClick={() => setSelectedCategory(item)}
                      className={`block py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative font-sans ${selectedCategory === item ? 'text-brand' : 'text-accent/80 hover:text-brand'}`}
                    >
                      {item}
                      <span className={`absolute bottom-0 left-0 w-full h-1 bg-brand transition-transform origin-center ${selectedCategory === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    </button>
                  </li>
                ))}
                <li className="flex items-center px-4 relative">
                  <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-brand"
                      autoFocus={isSearchOpen}
                    />
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 hover:text-brand transition-colors"
                  >
                    {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </button>
                </li>
              </ul>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl overflow-hidden z-20"
              >
                {['Información', 'Nacionales', 'Internacionales', 'Economía', 'Deportes', 'Región', 'Más'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedCategory(item);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left block py-4 px-6 text-xs font-bold uppercase tracking-widest border-b border-gray-50 hover:bg-gray-50 ${selectedCategory === item ? 'text-brand bg-gray-50' : 'text-accent'}`}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer Header (Invisible placeholder to prevent layout shift) */}
      <div className="invisible pointer-events-none opacity-0 select-none" aria-hidden="true">
        <div className={`bg-accent text-white overflow-hidden transition-all duration-200 text-[10px] font-black tracking-[0.2em] text-center uppercase ${isScrolled ? 'h-0 py-0' : 'h-auto py-1.5'}`}>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand rounded-full" />
            Edición Digital • Perú y el Mundo
          </span>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`border-b border-gray-100 flex flex-col items-center transition-all duration-300 ${isScrolled ? 'py-2 md:py-2' : 'py-6 md:py-10'}`}>
            <div className={`w-full flex justify-between items-center text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest font-sans transition-all duration-200 ${isScrolled ? 'h-0 opacity-0 mb-0 overflow-hidden' : 'h-auto opacity-100 mb-6 md:mb-8'}`}>
              <span className="hidden md:block">{currentDate}</span>
              <div className="flex items-center gap-6">
                <Youtube className="h-4 w-4" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h1 className={`font-serif font-black text-accent tracking-tighter leading-none transition-all duration-300 ${isScrolled ? 'text-2xl md:text-3xl' : 'text-4xl sm:text-6xl lg:text-8xl'}`}>
                NOTICIAS <span className="text-brand">24H</span>
              </h1>
              <div className={`h-0.5 bg-brand transition-all duration-300 ${isScrolled ? 'w-full mt-1' : 'w-1/4 mx-auto mt-2'}`} />
              <p className={`font-serif italic text-gray-400 tracking-widest transition-all duration-200 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100 text-xs md:text-sm mt-4'}`}>FUNDADO PARA LA EXCELENCIA INFORMATIVA</p>
            </div>
          </div>
          <nav className="border-t border-black py-0">
            <div className="flex items-center justify-between">
              <div className="lg:hidden py-4 px-2">Spacer</div>
              <ul className="hidden lg:flex items-center w-full flex-col lg:flex-row justify-center">
                <li className="block py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-[11px]">SPACER</li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

