import { Ordinance } from '../../types/ordinance';

export const environmentalOrdinances: Ordinance[] = [
  {
    id: '4',
    prefecture: '神奈川県',
    city: '川崎市',
    category: '環境基準',
    subCategory: '騒音対策',
    title: '防音基準',
    description: '建築物の防音に関する基準',
    requirements: '外部騒音を30dB以上低減する構造であること',
    buildingType: '共同住宅',
    buildingSize: {
      floors: 8,
      height: 25,
      totalArea: 3000
    },
    groupName: '環境配慮'
  },
  {
    id: '5',
    prefecture: '埼玉県',
    city: 'さいたま市',
    category: '環境基準',
    subCategory: '緑化対策',
    title: '緑化率基準',
    description: '敷地内の緑化に関する基準',
    requirements: '敷地面積の20%以上を緑化すること',
    buildingType: '事務所',
    buildingSize: {
      floors: 5,
      height: 15,
      totalArea: 2000
    },
    groupName: '環境配慮'
  }
];