export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  category: string;
  date: string;
  time?: string;
  image: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  breaking?: boolean;
  links?: { label: string; url: string }[];
  status?: 'published' | 'hidden' | 'draft' | 'pending';
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  link?: string;
  live?: boolean;
  status?: 'published' | 'hidden' | 'draft' | 'pending';
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  status?: 'published' | 'hidden' | 'draft' | 'pending';
}
