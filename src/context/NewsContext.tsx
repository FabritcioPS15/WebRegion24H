import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { NewsArticle, Podcast, Video } from '../types/news';
import { supabase } from '../lib/supabase';

interface NewsContextType {
  news: NewsArticle[];
  podcasts: Podcast[];
  videos: Video[];
  displayNews: NewsArticle[];
  displayPodcasts: Podcast[];
  displayVideos: Video[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addNews: (article: Omit<NewsArticle, 'id'>) => Promise<void>;
  updateNews: (id: string, article: Partial<NewsArticle>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addPodcast: (podcast: Omit<Podcast, 'id'>) => Promise<void>;
  updatePodcast: (id: string, podcast: Partial<Podcast>) => Promise<void>;
  deletePodcast: (id: string) => Promise<void>;
  addVideo: (video: Omit<Video, 'id'>) => Promise<void>;
  updateVideo: (id: string, video: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  uploadFile: (file: File, folder: 'news' | 'podcasts' | 'videos') => Promise<string>;
  changedIds: Set<string>;
  isPreviewMode: boolean;
  setIsPreviewMode: (value: boolean) => void;
  clearChanges: () => void;
  activeDraft: NewsArticle | Podcast | Video | null;
  setActiveDraft: (draft: NewsArticle | Podcast | Video | null) => void;
  isLoading: boolean;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeDraft, setActiveDraft] = useState<NewsArticle | Podcast | Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [newsRes, podcastsRes, videosRes] = await Promise.all([
          supabase.from('news').select('*').order('created_at', { ascending: false }),
          supabase.from('podcasts').select('*').order('created_at', { ascending: false }),
          supabase.from('videos').select('*').order('created_at', { ascending: false })
        ]);

        if (newsRes.data) setNews(newsRes.data);
        if (podcastsRes.data) setPodcasts(podcastsRes.data);
        if (videosRes.data) setVideos(videosRes.data);
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const uploadFile = async (file: File, folder: 'news' | 'podcasts' | 'videos') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const trackChange = (id: string) => {
    setChangedIds(prev => new Set(prev).add(id));
  };

  const addNews = async (article: Omit<NewsArticle, 'id'>) => {
    const { data, error } = await supabase.from('news').insert([article]).select();
    if (error) throw error;
    if (data && data[0]) {
      setNews([data[0], ...news]);
      trackChange(data[0].id);
    }
  };

  const updateNews = async (id: string, updates: Partial<NewsArticle>) => {
    const { data, error } = await supabase.from('news').update(updates).eq('id', id).select();
    if (error) throw error;
    if (data && data[0]) {
      setNews(news.map(article => article.id === id ? data[0] : article));
      trackChange(id);
    }
  };

  const deleteNews = async (id: string) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    setNews(news.filter(article => article.id !== id));
    setChangedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const addPodcast = async (podcast: Omit<Podcast, 'id'>) => {
    const { data, error } = await supabase.from('podcasts').insert([podcast]).select();
    if (error) throw error;
    if (data && data[0]) {
      setPodcasts([data[0], ...podcasts]);
      trackChange(data[0].id);
    }
  };

  const updatePodcast = async (id: string, updates: Partial<Podcast>) => {
    const { data, error } = await supabase.from('podcasts').update(updates).eq('id', id).select();
    if (error) throw error;
    if (data && data[0]) {
      setPodcasts(podcasts.map(p => p.id === id ? data[0] : p));
      trackChange(id);
    }
  };

  const deletePodcast = async (id: string) => {
    const { error } = await supabase.from('podcasts').delete().eq('id', id);
    if (error) throw error;
    setPodcasts(podcasts.filter(p => p.id !== id));
    setChangedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const addVideo = async (video: Omit<Video, 'id'>) => {
    const { data, error } = await supabase.from('videos').insert([video]).select();
    if (error) throw error;
    if (data && data[0]) {
      setVideos([data[0], ...videos]);
      trackChange(data[0].id);
    }
  };

  const updateVideo = async (id: string, updates: Partial<Video>) => {
    const { data, error } = await supabase.from('videos').update(updates).eq('id', id).select();
    if (error) throw error;
    if (data && data[0]) {
      setVideos(videos.map(v => v.id === id ? data[0] : v));
      trackChange(id);
    }
  };

  const deleteVideo = async (id: string) => {
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) throw error;
    setVideos(videos.filter(v => v.id !== id));
    setChangedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const clearChanges = () => {
    setChangedIds(new Set());
    setActiveDraft(null);
  };

  // Computed data for Public View / Preview
  const displayNews = ((isPreviewMode && activeDraft && 'content' in activeDraft)
    ? (activeDraft.id
      ? news.map(n => n.id === activeDraft.id ? activeDraft : n)
      : [{ ...activeDraft, id: 'new_draft_id' }, ...news]) as NewsArticle[]
    : news.filter(n => n.status === 'published' || !n.status))
    .filter(n => {
      const matchesCategory = selectedCategory === 'Todas' || selectedCategory === 'Más' || n.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.subtitle && n.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const displayPodcasts = ((isPreviewMode && activeDraft && 'description' in activeDraft && !('content' in activeDraft))
    ? (activeDraft.id
      ? podcasts.map(p => p.id === activeDraft.id ? activeDraft : p)
      : [{ ...activeDraft, id: 'new_draft_id' }, ...podcasts]) as Podcast[]
    : podcasts.filter(p => p.status === 'published' || !p.status))
    .filter(p => {
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

  const displayVideos = ((isPreviewMode && activeDraft && 'thumbnail' in activeDraft)
    ? (activeDraft.id
      ? videos.map(v => v.id === activeDraft.id ? activeDraft : v)
      : [{ ...activeDraft, id: 'new_draft_id' }, ...videos]) as Video[]
    : videos.filter(v => v.status === 'published' || !v.status))
    .filter(v => {
      const matchesSearch = !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

  const effectiveChangedIds = new Set(changedIds);
  if (activeDraft) {
    effectiveChangedIds.add(activeDraft.id || 'new_draft_id');
  }

  return (
    <NewsContext.Provider value={{
      news,
      podcasts,
      videos,
      displayNews,
      displayPodcasts,
      displayVideos,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      addNews,
      updateNews,
      deleteNews,
      addPodcast,
      updatePodcast,
      deletePodcast,
      addVideo,
      updateVideo,
      deleteVideo,
      uploadFile,
      changedIds: effectiveChangedIds,
      isPreviewMode,
      setIsPreviewMode,
      clearChanges,
      activeDraft,
      setActiveDraft,
      isLoading
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
