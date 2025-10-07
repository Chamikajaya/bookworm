export interface Book {
  id: string;
  entityType: string; // for GSI purposes
  title: string;
  category: BookCategory;
  description: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear: number;
  language: string;
  pageCount?: number;
  price: number;
  stockQuantity: number;
  coverImageKey?: string;
  coverImageUrl?: string; // URL to access the cover image  - generated when needed
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  category: BookCategory;
  description: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear: number;
  language: string;
  pageCount?: number;
  price: number;
  stockQuantity: number;
  coverImageKey?: string;
}

export interface UpdateBookInput {
  title?: string;
  description?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  language?: string;
  pageCount?: number;
  category?: BookCategory;
  price?: number;
  stockQuantity?: number;
  coverImageKey?: string;
}

export enum BookCategory {
  Fiction = "Fiction",
  NonFiction = "Non-Fiction",
  Science = "Science",
  History = "History",
  Biography = "Biography",
  Children = "Children",
  Fantasy = "Fantasy",
  Mystery = "Mystery",
  Romance = "Romance",
  SelfHelp = "Self-Help",
  Health = "Health",
}
