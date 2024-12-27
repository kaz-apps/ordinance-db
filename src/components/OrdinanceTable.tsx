import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Ordinance } from '../types/ordinance';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { OrdinanceFilters } from './ordinance/OrdinanceFilters';
import { OrdinanceTableHeader } from './ordinance/OrdinanceTableHeader';
import { OrdinanceTableRow } from './ordinance/OrdinanceTableRow';

interface OrdinanceTableProps {
  ordinances: Ordinance[];
}

type SortConfig = {
  key: keyof Ordinance | 'buildingSize.floors' | 'buildingSize.height' | 'buildingSize.totalArea';
  direction: 'asc' | 'desc';
} | null;

const OrdinanceTable = ({ ordinances }: OrdinanceTableProps) => {
  const { toast } = useToast();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>('');
  const [minFloors, setMinFloors] = useState<string>('');
  const [maxFloors, setMaxFloors] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [items, setItems] = useState(ordinances);
  const [applicabilityStatus, setApplicabilityStatus] = useState<Record<string, 'applicable' | 'not-applicable' | null>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const buildingTypes = useMemo(() => {
    return Array.from(new Set(ordinances.map(ord => ord.buildingType)));
  }, [ordinances]);

  const prefectures = useMemo(() => {
    return Array.from(new Set(ordinances.map(ord => ord.prefecture)));
  }, [ordinances]);

  const cities = useMemo(() => {
    if (!selectedPrefecture) return [];
    return Array.from(
      new Set(
        ordinances
          .filter(ord => ord.prefecture === selectedPrefecture)
          .map(ord => ord.city)
      )
    );
  }, [ordinances, selectedPrefecture]);

  const handlePrefectureChange = (value: string) => {
    setSelectedPrefecture(value);
    setSelectedCity('');
  };

  const filteredOrdinances = useMemo(() => {
    return items.filter(ord => {
      if (selectedPrefecture && selectedPrefecture !== '_all' && ord.prefecture !== selectedPrefecture) return false;
      if (selectedCity && selectedCity !== '_all' && ord.city !== selectedCity) return false;
      if (selectedBuildingType && selectedBuildingType !== '_all' && ord.buildingType !== selectedBuildingType) return false;
      if (minFloors && ord.buildingSize.floors < parseInt(minFloors)) return false;
      if (maxFloors && ord.buildingSize.floors > parseInt(maxFloors)) return false;
      return true;
    });
  }, [items, selectedPrefecture, selectedCity, selectedBuildingType, minFloors, maxFloors]);

  const handleSort = (key: SortConfig['key']) => {
    if (!key) return;
    
    const direction = 
      sortConfig?.key === key && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    
    setSortConfig({ key, direction });
    
    const sorted = [...items].sort((a, b) => {
      let aValue = key.includes('.') 
        ? key.split('.').reduce((obj, key) => obj[key], a)
        : a[key];
      let bValue = key.includes('.')
        ? key.split('.').reduce((obj, key) => obj[key], b)
        : b[key];
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setItems(sorted);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleApplicabilityChange = (id: string, status: 'applicable' | 'not-applicable' | null) => {
    setApplicabilityStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const SortableRow = ({ ordinance, children }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: ordinance.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </TableRow>
    );
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
        applicabilityStatus[ordinance.id] || '未選択'
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

      <div className="border rounded-lg">
        <ScrollArea className="h-[600px]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <OrdinanceTableHeader onSort={handleSort} />
              <TableBody>
                <SortableContext items={filteredOrdinances} strategy={verticalListSortingStrategy}>
                  {filteredOrdinances.map((ordinance) => (
                    <SortableRow key={ordinance.id} ordinance={ordinance}>
                      <OrdinanceTableRow
                        ordinance={ordinance}
                        onApplicabilityChange={handleApplicabilityChange}
                        applicabilityStatus={applicabilityStatus}
                      />
                    </SortableRow>
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrdinanceTable;