'use client';

import { Search, Menu, Youtube, Facebook, Twitter, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppLink from './AppLink';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, news } = useNews();

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

  // Filtrar noticias en tiempo real
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return news
      .filter(article => 
        article.title?.toLowerCase().includes(query) ||
        article.subtitle?.toLowerCase().includes(query) ||
        article.category?.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [searchQuery, news]);

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length >= 2);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
    setIsSearchOpen(false);
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

            <AppLink to="/" className="text-center group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
            </AppLink>
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
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Buscar..."
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setShowResults(false); }}>
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    {/* Mobile Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto z-50">
                        {searchResults.map((article) => (
                          <Link
                            key={article.id}
                            href={`/articulo/${article.slug || article.id}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                          >
                            {article.image && (
                              <img src={article.image} alt="" className="w-12 h-12 object-cover flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-accent truncate">{article.title}</p>
                              <p className="text-[10px] text-gray-500">{article.category}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
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
                {['Información', 'Nacionales', 'Internacionales', 'Economía', 'Deportes', 'Región', 'Empresarial', 'Más'].map((item) => (
                  <li key={item} className="group list-none">
                    <button
                      onClick={() => {
                        setSelectedCategory(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`block py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative font-sans ${selectedCategory === item ? 'text-brand' : 'text-accent/80 hover:text-brand'}`}
                    >
                      {item}
                      <span className={`absolute bottom-0 left-0 w-full h-1 bg-brand transition-transform origin-center ${selectedCategory === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    </button>
                  </li>
                ))}
                <li className="flex items-center px-4 relative">
                  <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Buscar..."
                        className="w-full bg-gray-50 border border-gray-200 pl-3 pr-8 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-brand"
                        autoFocus={isSearchOpen}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => { setSearchQuery(''); setShowResults(false); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                      {/* Desktop Search Results Dropdown */}
                      {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl max-h-72 overflow-y-auto z-50">
                          {searchResults.map((article) => (
                            <Link
                              key={article.id}
                              href={`/articulo/${article.slug || article.id}`}
                              onClick={handleResultClick}
                              className="flex items-center gap-3 p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            >
                              {article.image && (
                                <img src={article.image} alt="" className="w-14 h-14 object-cover flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-accent truncate">{article.title}</p>
                                <p className="text-[10px] text-gray-500">{article.category}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl p-3 z-50">
                          <p className="text-xs text-gray-500 text-center">No se encontraron resultados</p>
                        </div>
                      )}
                    </div>
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
                {['Información', 'Nacionales', 'Internacionales', 'Economía', 'Deportes', 'Región', 'Empresarial', 'Más'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedCategory(item);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
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

