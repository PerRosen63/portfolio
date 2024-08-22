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

export interface Page {
  content: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  } | null; // Use | null if featuredImage might be missing
}
