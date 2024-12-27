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
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Ordinance } from '../types/ordinance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrdinanceTableProps {
  ordinances: Ordinance[];
}

const OrdinanceTable = ({ ordinances }: OrdinanceTableProps) => {
  const { toast } = useToast();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

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

  // フィルタリングされた条例一覧
  const filteredOrdinances = useMemo(() => {
    return ordinances.filter(ord => {
      if (selectedPrefecture && ord.prefecture !== selectedPrefecture) return false;
      if (selectedCity && ord.city !== selectedCity) return false;
      return true;
    });
  }, [ordinances, selectedPrefecture, selectedCity]);

  // 都道府県が変更された時の処理
  const handlePrefectureChange = (value: string) => {
    setSelectedPrefecture(value);
    setSelectedCity(''); // 都道府県が変更されたら市区町村の選択をリセット
  };

  const exportToCSV = () => {
    try {
      const headers = ['都道府県', '市区町村', 'カテゴリ', 'サブカテゴリ', 'タイトル', '説明', '要件'];
      
      const csvData = filteredOrdinances.map(ordinance => [
        ordinance.prefecture,
        ordinance.city,
        ordinance.category,
        ordinance.subCategory || '',
        ordinance.title,
        ordinance.description,
        ordinance.requirements
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
        <div className="flex gap-4">
          <Select value={selectedPrefecture} onValueChange={handlePrefectureChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="都道府県を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">すべての都道府県</SelectItem>
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
              <SelectItem value="">すべての市区町村</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          CSVエクスポート
        </Button>
      </div>

      <div className="border rounded-lg">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[150px]">都道府県</TableHead>
                <TableHead className="w-[150px]">市区町村</TableHead>
                <TableHead className="w-[150px]">カテゴリ</TableHead>
                <TableHead className="w-[150px]">サブカテゴリ</TableHead>
                <TableHead className="w-[200px]">タイトル</TableHead>
                <TableHead className="w-[250px]">説明</TableHead>
                <TableHead>要件</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrdinances.map((ordinance) => (
                <TableRow key={ordinance.id}>
                  <TableCell>{ordinance.prefecture}</TableCell>
                  <TableCell>{ordinance.city}</TableCell>
                  <TableCell>{ordinance.category}</TableCell>
                  <TableCell>{ordinance.subCategory}</TableCell>
                  <TableCell>{ordinance.title}</TableCell>
                  <TableCell>{ordinance.description}</TableCell>
                  <TableCell>{ordinance.requirements}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrdinanceTable;