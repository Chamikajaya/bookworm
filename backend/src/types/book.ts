export interface Book {
  id: string;
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
