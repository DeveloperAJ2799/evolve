export type JournalEntry = {
  id: string;
  date: Date;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral' | string;
  moodKeywords: string[];
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  target: number; // e.g., hours
  progress: number;
};

export type Friend = {
  id: string;
  name: string;
  avatarUrl: string;
  status: string;
  mood: string;
};
