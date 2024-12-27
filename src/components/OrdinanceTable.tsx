import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Ordinance } from '../types/ordinance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // 建築用途の一覧を取得
  const buildingTypes = useMemo(() => {
    return Array.from(new Set(ordinances.map(ord => ord.buildingType)));
  }, [ordinances]);

  // 都道府県の一覧を取得
  const prefectures = useMemo(() => {
    return Array.from(new Set(ordinances.map(ord => ord.prefecture)));
  }, [ordinances]);

  // 選択された都道府県に基づいて市区町村の一覧を取得
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
    setSelectedCity(''); // Reset city selection when prefecture changes
  };

  // フィルタリングされた条例一覧
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

  // ソート関数
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

  // ドラッグ&ドロップによる並び替え
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      setItems(arrayMove(items, oldIndex, newIndex));
    }
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
      const headers = ['都道府県', '市区町村', 'カテゴリ', 'サブカテゴリ', 'タイトル', '説明', '要件', '建築用途', '階数', '高さ', '延床面積'];
      
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
        ordinance.buildingSize.totalArea
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
      <div className="flex flex-wrap gap-4">
        <Select value={selectedPrefecture} onValueChange={handlePrefectureChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="都道府県を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">すべての都道府県</SelectItem>
            {prefectures.map(prefecture => (
              <SelectItem key={prefecture} value={prefecture}>
                {prefecture}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedPrefecture}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="市区町村を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">すべての市区町村</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBuildingType} onValueChange={setSelectedBuildingType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="建築用途を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">すべての用途</SelectItem>
            {buildingTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="最小階数"
            value={minFloors}
            onChange={(e) => setMinFloors(e.target.value)}
            className="w-24 px-3 py-2 border rounded"
          />
          <span>～</span>
          <input
            type="number"
            placeholder="最大階数"
            value={maxFloors}
            onChange={(e) => setMaxFloors(e.target.value)}
            className="w-24 px-3 py-2 border rounded"
          />
          <span>階</span>
        </div>

        <Button onClick={exportToCSV} variant="outline" className="ml-auto">
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
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[150px]" onClick={() => handleSort('prefecture')}>
                    都道府県 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="w-[150px]" onClick={() => handleSort('city')}>
                    市区町村 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="w-[150px]" onClick={() => handleSort('category')}>
                    カテゴリ <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="w-[150px]" onClick={() => handleSort('subCategory')}>
                    サブカテゴリ <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="w-[200px]" onClick={() => handleSort('title')}>
                    タイトル <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="w-[250px]">説明</TableHead>
                  <TableHead>要件</TableHead>
                  <TableHead className="w-[150px]" onClick={() => handleSort('buildingType')}>
                    建築用途 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="w-[100px]" onClick={() => handleSort('buildingSize.floors')}>
                    階数 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={filteredOrdinances} strategy={verticalListSortingStrategy}>
                  {filteredOrdinances.map((ordinance) => (
                    <SortableRow key={ordinance.id} ordinance={ordinance}>
                      <TableCell>{ordinance.prefecture}</TableCell>
                      <TableCell>{ordinance.city}</TableCell>
                      <TableCell>{ordinance.category}</TableCell>
                      <TableCell>{ordinance.subCategory}</TableCell>
                      <TableCell>{ordinance.title}</TableCell>
                      <TableCell>{ordinance.description}</TableCell>
                      <TableCell>{ordinance.requirements}</TableCell>
                      <TableCell>{ordinance.buildingType}</TableCell>
                      <TableCell>{ordinance.buildingSize.floors}</TableCell>
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