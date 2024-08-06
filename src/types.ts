export interface Post {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  years: {
    startYear: number;
  };
}
