import { Ordinance } from '../types/ordinance';

export const dummyOrdinances: Ordinance[] = [
  {
    id: '1',
    prefecture: '東京都',
    city: '新宿区',
    category: '建築基準',
    subCategory: '構造安全性',
    title: '耐震基準',
    description: '建築物の耐震性に関する基準',
    requirements: '震度6強までの地震に耐えうる構造であること'
  },
  {
    id: '2',
    prefecture: '東京都',
    city: '渋谷区',
    category: '建築基準',
    subCategory: '構造安全性',
    title: '風圧力基準',
    description: '建築物の耐風性に関する基準',
    requirements: '風速50m/sまでの風圧に耐えうる構造であること'
  },
  {
    id: '3',
    prefecture: '神奈川県',
    city: '横浜市',
    category: '防火基準',
    subCategory: '避難設備',
    title: '非常口設置基準',
    description: '非常口の設置に関する基準',
    requirements: '床面積200㎡ごとに1か所以上の非常口を設置すること'
  },
  {
    id: '4',
    prefecture: '神奈川県',
    city: '川崎市',
    category: '環境基準',
    subCategory: '騒音対策',
    title: '防音基準',
    description: '建築物の防音に関する基準',
    requirements: '外部騒音を30dB以上低減する構造であること'
  },
  {
    id: '5',
    prefecture: '埼玉県',
    city: 'さいたま市',
    category: '環境基準',
    subCategory: '緑化対策',
    title: '緑化率基準',
    description: '敷地内の緑化に関する基準',
    requirements: '敷地面積の20%以上を緑化すること'
  }
];