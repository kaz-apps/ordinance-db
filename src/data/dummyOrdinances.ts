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
  },
  {
    id: '6',
    prefecture: '東京都',
    city: '港区',
    category: '景観基準',
    subCategory: '高さ制限',
    title: '建物高さ制限',
    description: '建築物の高さに関する制限',
    requirements: '住居地域における建物高さは45m以下とすること'
  },
  {
    id: '7',
    prefecture: '東京都',
    city: '中央区',
    category: '防災基準',
    subCategory: '浸水対策',
    title: '浸水対策基準',
    description: '建築物の浸水対策に関する基準',
    requirements: '地下階の設置には防水板の設置が必須'
  },
  {
    id: '8',
    prefecture: '神奈川県',
    city: '横浜市',
    category: '景観基準',
    subCategory: 'デザイン',
    title: '外観デザイン基準',
    description: '建築物の外観デザインに関する基準',
    requirements: '歴史的街並みとの調和を考慮したデザインとすること'
  },
  {
    id: '9',
    prefecture: '埼玉県',
    city: '川口市',
    category: '環境基準',
    subCategory: '省エネ',
    title: '省エネ基準',
    description: '建築物の省エネルギー対策に関する基準',
    requirements: 'ZEB Ready以上の省エネ性能を確保すること'
  },
  {
    id: '10',
    prefecture: '東京都',
    city: '世田谷区',
    category: '防火基準',
    subCategory: '消火設備',
    title: 'スプリンクラー設置基準',
    description: 'スプリンクラー設備の設置に関する基準',
    requirements: '3階以上の建築物には自動スプリンクラーを設置すること'
  },
  {
    id: '11',
    prefecture: '神奈川県',
    city: '藤沢市',
    category: '環境基準',
    subCategory: '日照',
    title: '日影規制',
    description: '建築物による日影の規制基準',
    requirements: '隣地境界線から5m以内の範囲で4時間以上の日影を生じさせないこと'
  },
  {
    id: '12',
    prefecture: '埼玉県',
    city: '所沢市',
    category: '建築基準',
    subCategory: '基礎工事',
    title: '地盤調査基準',
    description: '建築物の地盤調査に関する基準',
    requirements: '建築面積300㎡以上の建物には地盤調査が必須'
  },
  {
    id: '13',
    prefecture: '東京都',
    city: '江東区',
    category: '防災基準',
    subCategory: '津波対策',
    title: '津波対策基準',
    description: '建築物の津波対策に関する基準',
    requirements: '海抜3m以下の地域では1階を駐車場等の非居住用途とすること'
  },
  {
    id: '14',
    prefecture: '神奈川県',
    city: '相模原市',
    category: '建築基準',
    subCategory: '耐火',
    title: '耐火構造基準',
    description: '建築物の耐火構造に関する基準',
    requirements: '地上4階以上の建築物は耐火建築物とすること'
  },
  {
    id: '15',
    prefecture: '埼玉県',
    city: '越谷市',
    category: '環境基準',
    subCategory: '排水',
    title: '雨水排水基準',
    description: '建築物の雨水排水に関する基準',
    requirements: '敷地面積1,000㎡以上の開発では雨水貯留施設の設置が必要'
  }
];