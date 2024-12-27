import { Ordinance } from '../types/ordinance';

export const dummyOrdinances: Ordinance[] = [
  {
    id: '1',
    category: '建築基準',
    subCategory: '構造安全性',
    title: '耐震基準',
    description: '建築物の耐震性に関する基準',
    requirements: '震度6強までの地震に耐えうる構造であること'
  },
  {
    id: '2',
    category: '建築基準',
    subCategory: '構造安全性',
    title: '風圧力基準',
    description: '建築物の耐風性に関する基準',
    requirements: '風速50m/sまでの風圧に耐えうる構造であること'
  },
  {
    id: '3',
    category: '防火基準',
    subCategory: '避難設備',
    title: '非常口設置基準',
    description: '非常口の設置に関する基準',
    requirements: '床面積200㎡ごとに1か所以上の非常口を設置すること'
  },
  // ... 必要に応じて追加のダミーデータ
];