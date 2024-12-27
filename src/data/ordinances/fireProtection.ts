import { Ordinance } from '../../types/ordinance';

export const fireProtectionOrdinances: Ordinance[] = [
  {
    id: '3',
    prefecture: '神奈川県',
    city: '横浜市',
    category: '防火基準',
    subCategory: '避難設備',
    title: '非常口設置基準',
    description: '非常口の設置に関する基準',
    requirements: '床面積200㎡ごとに1か所以上の非常口を設置すること',
    buildingType: '事務所',
    buildingSize: {
      floors: 10,
      height: 30,
      totalArea: 5000
    },
    groupName: '防火安全'
  },
  {
    id: '10',
    prefecture: '東京都',
    city: '世田谷区',
    category: '防火基準',
    subCategory: '消火設備',
    title: 'スプリンクラー設置基準',
    description: 'スプリンクラー設備の設置に関する基準',
    requirements: '3階以上の建築物には自動スプリンクラーを設置すること',
    buildingType: '共同住宅',
    buildingSize: {
      floors: 4,
      height: 12,
      totalArea: 2000
    },
    groupName: '防火安全'
  }
];