export interface Ordinance {
  id: string;
  prefecture: string;
  city: string;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  requirements: string;
  buildingType: string;
  buildingSize: {
    floors: number;
    height: number;
    totalArea: number;
  };
  groupName: string;
}