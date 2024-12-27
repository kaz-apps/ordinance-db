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
import { Ordinance } from '../types/ordinance';

interface OrdinanceTableProps {
  ordinances: Ordinance[];
}

const OrdinanceTable = ({ ordinances }: OrdinanceTableProps) => {
  return (
    <div className="w-full border rounded-lg">
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
  );
};

export default OrdinanceTable;