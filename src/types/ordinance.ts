export interface Ordinance {
  id: string;
  prefecture: string;
  city: string;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  requirements: string;
  buildingType: string; // 建築用途
  buildingSize: {
    floors: number;
    height: number;
    totalArea: number;
  };
}