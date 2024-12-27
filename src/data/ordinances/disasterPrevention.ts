import { Ordinance } from '../../types/ordinance';

export const disasterPreventionOrdinances: Ordinance[] = [
  {
    id: '7',
    prefecture: '東京都',
    city: '中央区',
    category: '防災基準',
    subCategory: '浸水対策',
    title: '浸水対策基準',
    description: '建築物の浸水対策に関する基準',
    requirements: '地下階の設置には防水板の設置が必須',
    buildingType: '事務所',
    buildingSize: {
      floors: 6,
      height: 20,
      totalArea: 4000
    },
    groupName: '防災'
  },
  {
    id: '11',
    prefecture: '神奈川県',
    city: '藤沢市',
    category: '環境基準',
    subCategory: '日照',
    title: '日影規制',
    description: '建築物による日影の規制基準',
    requirements: '隣地境界線から5m以内の範囲で4時間以上の日影を生じさせないこと',
    buildingType: '事務所',
    buildingSize: {
      floors: 3,
      height: 10,
      totalArea: 1500
    },
    groupName: '防災'
  }
];