import { Ordinance } from '../../types/ordinance';

export const urbanPlanningOrdinances: Ordinance[] = [
  {
    id: '6',
    prefecture: '東京都',
    city: '港区',
    category: '景観基準',
    subCategory: '高さ制限',
    title: '建物高さ制限',
    description: '建築物の高さに関する制限',
    requirements: '住居地域における建物高さは45m以下とすること',
    buildingType: '共同住宅',
    buildingSize: {
      floors: 12,
      height: 40,
      totalArea: 6000
    },
    groupName: '都市計画'
  },
  {
    id: '8',
    prefecture: '神奈川県',
    city: '横浜市',
    category: '景観基準',
    subCategory: 'デザイン',
    title: '外観デザイン基準',
    description: '建築物の外観デザインに関する基準',
    requirements: '歴史的街並みとの調和を考慮したデザインとすること',
    buildingType: '共同住宅',
    buildingSize: {
      floors: 9,
      height: 30,
      totalArea: 4500
    },
    groupName: '都市計画'
  }
];