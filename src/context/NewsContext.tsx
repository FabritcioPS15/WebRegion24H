import { createContext, useContext, useState, ReactNode } from 'react';
import { NewsArticle, Podcast, Video } from '../types/news';

interface NewsContextType {
  news: NewsArticle[];
  podcasts: Podcast[];
  videos: Video[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  addNews: (article: Omit<NewsArticle, 'id'>) => void;
  updateNews: (id: string, article: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;
  addPodcast: (podcast: Omit<Podcast, 'id'>) => void;
  updatePodcast: (id: string, podcast: Partial<Podcast>) => void;
  deletePodcast: (id: string) => void;
  addVideo: (video: Omit<Video, 'id'>) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const initialNews: NewsArticle[] = [
  {
    id: '1',
    title: "Gobierno anuncia nuevas medidas económicas para el segundo semestre",
    subtitle: "Último momento",
    content: "El gobierno ha anunciado un conjunto de medidas económicas que entrarán en vigor a partir del próximo semestre...",
    category: "Economía",
    date: "22 de enero de 2025",
    time: "14:30",
    image: "https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg?auto=compress&cs=tinysrgb&w=1200",
    author: "Redacción",
    tags: ["economía", "gobierno", "medidas"],
    featured: true,
    breaking: true
  },
  {
    id: '2',
    title: "Importante: se anunciará una medida sanitaria hoy",
    content: "Las autoridades sanitarias han convocado a una conferencia de prensa para anunciar nuevas medidas...",
    category: "Salud",
    date: "22 de enero de 2025",
    time: "13:45",
    image: "https://images.pexels.com/photos/3958456/pexels-photo-3958456.jpeg?auto=compress&cs=tinysrgb&w=600",
    author: "Redacción",
    tags: ["salud", "medidas", "anuncio"],
    featured: false,
    breaking: true
  },
  {
    id: '3',
    title: "Incremento del salario mínimo en debate",
    content: "El debate sobre el incremento del salario mínimo continúa en el congreso...",
    category: "Economía",
    date: "22 de enero de 2025",
    time: "12:00",
    image: "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=600",
    author: "Redacción",
    tags: ["salario", "economía", "debate"],
    featured: false,
    breaking: false
  },
  {
    id: '4',
    title: "Apertura de hubs digitales en la región",
    content: "Se anuncia la apertura de nuevos centros digitales para fomentar la tecnología...",
    category: "Tecnología",
    date: "22 de enero de 2025",
    time: "10:15",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600",
    author: "Redacción",
    tags: ["tecnología", "hubs", "región"],
    featured: false,
    breaking: false
  },
  {
    id: '5',
    title: "Así cambiará la Av. Arequipa para priorizar el transporte público",
    content: "El proyecto de remodelación de la Av. Arequipa busca mejorar el transporte público...",
    category: "Urbanismo",
    date: "22 de enero de 2025",
    image: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Redacción",
    tags: ["urbanismo", "transporte", "avenida"],
    featured: false,
    breaking: false
  },
  {
    id: '6',
    title: "Nuevo centro de salud comunitario",
    content: "Se inaugura un nuevo centro de salud para atender a la comunidad...",
    category: "Salud",
    date: "22 de enero de 2025",
    image: "https://images.pexels.com/photos/127873/pexels-photo-127873.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Redacción",
    tags: ["salud", "centro", "comunidad"],
    featured: false,
    breaking: false
  },
  {
    id: '7',
    title: "Plan de reforestación en zonas urbanas",
    content: "Se lanza un ambicioso plan de reforestación para las zonas urbanas...",
    category: "Medio Ambiente",
    date: "21 de enero de 2025",
    image: "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Redacción",
    tags: ["reforestación", "medio ambiente", "urbano"],
    featured: false,
    breaking: false
  },
  {
    id: '8',
    title: "Innovación tecnológica en educación pública",
    content: "Se implementan nuevas tecnologías en la educación pública del país...",
    category: "Educación",
    date: "21 de enero de 2025",
    image: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Redacción",
    tags: ["educación", "tecnología", "innovación"],
    featured: false,
    breaking: false
  }
];

const initialPodcasts: Podcast[] = [
  {
    id: '1',
    title: "Implementación de IA en las aulas de nivel primaria",
    description: "Exploramos cómo la inteligencia artificial está transformando la educación primaria, con entrevistas a docentes y expertos en tecnología educativa.",
    duration: "45 minutos",
    image: "https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=1200",
    live: true
  }
];

const initialVideos: Video[] = [
  {
    id: '1',
    title: "Entrevista exclusiva: Ministro de Economía",
    description: "Hablamos con el ministro sobre las nuevas medidas económicas",
    thumbnail: "https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: "15:30",
    category: "Entrevistas"
  }
];

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const addNews = (article: Omit<NewsArticle, 'id'>) => {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString()
    };
    setNews([...news, newArticle]);
  };

  const updateNews = (id: string, updates: Partial<NewsArticle>) => {
    setNews(news.map(article =>
      article.id === id ? { ...article, ...updates } : article
    ));
  };

  const deleteNews = (id: string) => {
    setNews(news.filter(article => article.id !== id));
  };

  const addPodcast = (podcast: Omit<Podcast, 'id'>) => {
    const newPodcast: Podcast = {
      ...podcast,
      id: Date.now().toString()
    };
    setPodcasts([...podcasts, newPodcast]);
  };

  const updatePodcast = (id: string, updates: Partial<Podcast>) => {
    setPodcasts(podcasts.map(podcast =>
      podcast.id === id ? { ...podcast, ...updates } : podcast
    ));
  };

  const deletePodcast = (id: string) => {
    setPodcasts(podcasts.filter(podcast => podcast.id !== id));
  };

  const addVideo = (video: Omit<Video, 'id'>) => {
    const newVideo: Video = {
      ...video,
      id: Date.now().toString()
    };
    setVideos([...videos, newVideo]);
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(videos.map(video =>
      video.id === id ? { ...video, ...updates } : video
    ));
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  return (
    <NewsContext.Provider value={{
      news,
      podcasts,
      videos,
      selectedCategory,
      setSelectedCategory,
      addNews,
      updateNews,
      deleteNews,
      addPodcast,
      updatePodcast,
      deletePodcast,
      addVideo,
      updateVideo,
      deleteVideo
    }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
