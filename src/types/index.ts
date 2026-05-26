export interface User {
  id: string;
  email: string;
  nickname: string;
}

export interface Article {
  id: string;
  title: string;
  imageUrl: string;
  timeAgo: string;
  tags: string[];
  category?: string;
  url?: string;
  verified?: boolean;
  trusted?: boolean;
}
