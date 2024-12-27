import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Ordinance } from '../types/ordinance';
import { OrdinanceFilters } from './ordinance/OrdinanceFilters';
import { OrdinanceList } from './ordinance/OrdinanceList';
import { useOrdinanceFilters } from './ordinance/useOrdinanceFilters';
import { useOrdinanceSort } from './ordinance/useOrdinanceSort';

interface OrdinanceTableProps {
  ordinances: Ordinance[];
}

const OrdinanceTable = ({ ordinances }: OrdinanceTableProps) => {
  const { toast } = useToast();
  const [applicabilityStatus, setApplicabilityStatus] = useState<Record<string, 'not-applicable' | null>>({});
  
  const {
    items,
    handleSort,
  } = useOrdinanceSort(ordinances);

  const {
    selectedPrefecture,
    selectedCity,
    selectedBuildingType,
    minFloors,
    maxFloors,
    buildingTypes,
    prefectures,
    cities,
    filteredOrdinances,
    handlePrefectureChange,
    setSelectedCity,
    setSelectedBuildingType,
    setMinFloors,
    setMaxFloors,
  } = useOrdinanceFilters(items);

  const handleApplicabilityChange = (id: string, status: 'not-applicable' | null) => {
    setApplicabilityStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const exportToCSV = () => {
    try {
      const headers = ['都道府県', '市区町村', 'カテゴリ', 'サブカテゴリ', 'タイトル', '概要', '要件', '建築用途', '階数', '高さ', '延床面積', '適用状態'];
      
      const csvData = filteredOrdinances.map(ordinance => [
        ordinance.prefecture,
        ordinance.city,
        ordinance.category,
        ordinance.subCategory || '',
        ordinance.title,
        ordinance.description,
        ordinance.requirements,
        ordinance.buildingType,
        ordinance.buildingSize.floors,
        ordinance.buildingSize.height,
        ordinance.buildingSize.totalArea,
        applicabilityStatus[ordinance.id] === 'not-applicable' ? '非該当' : '該当'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '建築設計条例一覧.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "エクスポート完了",
        description: "CSVファイルのダウンロードが開始されました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "エクスポート中にエラーが発生しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <OrdinanceFilters
          selectedPrefecture={selectedPrefecture}
          selectedCity={selectedCity}
          selectedBuildingType={selectedBuildingType}
          minFloors={minFloors}
          maxFloors={maxFloors}
          prefectures={prefectures}
          cities={cities}
          buildingTypes={buildingTypes}
          onPrefectureChange={handlePrefectureChange}
          onCityChange={setSelectedCity}
          onBuildingTypeChange={setSelectedBuildingType}
          onMinFloorsChange={setMinFloors}
          onMaxFloorsChange={setMaxFloors}
        />
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          CSVエクスポート
        </Button>
      </div>

      <OrdinanceList
        ordinances={filteredOrdinances}
        onApplicabilityChange={handleApplicabilityChange}
        applicabilityStatus={applicabilityStatus}
      />
    </div>
  );
};

export default OrdinanceTable;