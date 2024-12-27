import React from 'react';
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

interface OrdinanceTableProps {
  ordinances: Ordinance[];
}

const OrdinanceTable = ({ ordinances }: OrdinanceTableProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    try {
      // CSVヘッダーの作成
      const headers = ['カテゴリ', 'サブカテゴリ', 'タイトル', '説明', '要件'];
      
      // データの変換
      const csvData = ordinances.map(ordinance => [
        ordinance.category,
        ordinance.subCategory || '',
        ordinance.title,
        ordinance.description,
        ordinance.requirements
      ]);
      
      // CSVフォーマットに変換
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // BOMを追加してShift-JISでエンコード
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8' });
      
      // ダウンロードリンクの作成
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
      <div className="flex justify-end">
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
                <TableHead className="w-[200px]">カテゴリ</TableHead>
                <TableHead className="w-[200px]">サブカテゴリ</TableHead>
                <TableHead className="w-[250px]">タイトル</TableHead>
                <TableHead className="w-[300px]">説明</TableHead>
                <TableHead>要件</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordinances.map((ordinance) => (
                <TableRow key={ordinance.id}>
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