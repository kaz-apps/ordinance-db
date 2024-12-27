import React from 'react';
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ordinance } from '../../types/ordinance';
import { OrdinanceTableHeader } from './OrdinanceTableHeader';
import { OrdinanceTableRow } from './OrdinanceTableRow';

interface OrdinanceListProps {
  ordinances: Ordinance[];
  onApplicabilityChange: (id: string, status: 'not-applicable' | null) => void;
  applicabilityStatus: Record<string, 'not-applicable' | null>;
  onSort: (key: keyof Ordinance | 'buildingSize.floors' | 'buildingSize.height' | 'buildingSize.totalArea') => void;
}

export const OrdinanceList: React.FC<OrdinanceListProps> = ({
  ordinances,
  onApplicabilityChange,
  applicabilityStatus,
  onSort,
}) => {
  return (
    <div className="border rounded-lg">
      <ScrollArea className="h-[600px]">
        <Table>
          <OrdinanceTableHeader onSort={onSort} />
          <TableBody>
            {ordinances.map((ordinance) => (
              <OrdinanceTableRow
                key={ordinance.id}
                ordinance={ordinance}
                onApplicabilityChange={onApplicabilityChange}
                applicabilityStatus={applicabilityStatus}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};