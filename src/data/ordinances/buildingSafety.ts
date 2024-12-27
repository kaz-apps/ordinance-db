import { Ordinance } from '../../types/ordinance';

export const buildingSafetyOrdinances: Ordinance[] = [
  {
    id: '1',
    prefecture: '東京都',
    city: '新宿区',
    category: '建築基準',
    subCategory: '構造安全性',
    title: '耐震基準',
    description: '建築物の耐震性に関する基準',
    requirements: '震度6強までの地震に耐えうる構造であること',
    buildingType: '事務所',
    buildingSize: {
      floors: 20,
      height: 80,
      totalArea: 10000
    },
    groupName: '建築安全'
  },
  {
    id: '2',
    prefecture: '東京都',
    city: '渋谷区',
    category: '建築基準',
    subCategory: '構造安全性',
    title: '風圧力基準',
    description: '建築物の耐風性に関する基準',
    requirements: '風速50m/sまでの風圧に耐えうる構造であること',
    buildingType: '共同住宅',
    buildingSize: {
      floors: 15,
      height: 45,
      totalArea: 8000
    },
    groupName: '建築安全'
  }
];