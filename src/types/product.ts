export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images: string[]; // Add this line
  rating: {
    rate: number;
    count: number;
  };
}