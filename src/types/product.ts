import type { Review } from './review';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  category: string;
  image: string;
  images: string[]; // Add this line
  rating: {
    rate: number;
    count: number;
  };
  reviews: Review[];
}