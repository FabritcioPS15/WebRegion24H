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
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  live?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
}
