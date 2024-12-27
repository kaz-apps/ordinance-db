import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Ordinance } from '../../types/ordinance';

interface OrdinanceTableHeaderProps {
  onSort: (key: keyof Ordinance | 'buildingSize.floors' | 'buildingSize.height' | 'buildingSize.totalArea') => void;
}

export const OrdinanceTableHeader: React.FC<OrdinanceTableHeaderProps> = ({ onSort }) => {
  return (
    <TableHeader className="sticky top-0 bg-background">
      <TableRow>
        <TableHead className="w-[100px]">適用状態</TableHead>
        <TableHead className="w-[150px]" onClick={() => onSort('prefecture')}>
          都道府県 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="w-[150px]" onClick={() => onSort('city')}>
          市区町村 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="w-[150px]" onClick={() => onSort('category')}>
          カテゴリ <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="w-[150px]" onClick={() => onSort('subCategory')}>
          サブカテゴリ <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="w-[200px]" onClick={() => onSort('title')}>
          タイトル <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="w-[250px]" onClick={() => onSort('description')}>
          概要 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead>要件</TableHead>
        <TableHead className="w-[150px]" onClick={() => onSort('buildingType')}>
          建築用途 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="w-[100px]" onClick={() => onSort('buildingSize.floors')}>
          階数 <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};