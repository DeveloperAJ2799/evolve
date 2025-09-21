export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
};