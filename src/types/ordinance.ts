export interface Ordinance {
  id: string;
  prefecture: string;
  city: string;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  requirements: string;
}