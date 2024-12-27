import { Ordinance } from '../../types/ordinance';

export const surveyOrdinances: Ordinance[] = [
  {
    id: '12',
    prefecture: '東京都',
    city: '新宿区',
    category: '調査',
    subCategory: '基礎調査',
    title: '地盤調査基準',
    description: '建築物の地盤調査に関する基準',
    requirements: '建築物の建設前に地盤調査を実施すること',
    buildingType: '全ての建築物',
    buildingSize: {
      floors: 1,
      height: 3,
      totalArea: 100
    },
    groupName: '調査'
  },
  {
    id: '13',
    prefecture: '東京都',
    city: '渋谷区',
    category: '調査',
    subCategory: '事前調査',
    title: '周辺環境調査基準',
    description: '建築物の周辺環境への影響調査に関する基準',
    requirements: '日影・風害・電波障害等の環境調査を実施すること',
    buildingType: '全ての建築物',
    buildingSize: {
      floors: 1,
      height: 3,
      totalArea: 100
    },
    groupName: '調査'
  }
];