import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Ordinance } from '../../types/ordinance';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";

interface OrdinanceTableRowProps {
  ordinance: Ordinance;
  onApplicabilityChange: (id: string, status: 'not-applicable' | null) => void;
  applicabilityStatus: Record<string, 'not-applicable' | null>;
}

export const OrdinanceTableRow: React.FC<OrdinanceTableRowProps> = ({
  ordinance,
  onApplicabilityChange,
  applicabilityStatus,
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`not-applicable-${ordinance.id}`}
            checked={applicabilityStatus[ordinance.id] === 'not-applicable'}
            onCheckedChange={(checked) => {
              onApplicabilityChange(
                ordinance.id,
                checked ? 'not-applicable' : null
              );
            }}
          />
          <Label 
            htmlFor={`not-applicable-${ordinance.id}`}
            className="flex items-center space-x-1 cursor-pointer text-sm"
          >
            <XCircle className="h-4 w-4 text-red-500" />
            <span>非該当</span>
          </Label>
        </div>
      </TableCell>
      <TableCell>{ordinance.prefecture}</TableCell>
      <TableCell>{ordinance.city}</TableCell>
      <TableCell>{ordinance.category}</TableCell>
      <TableCell>{ordinance.subCategory}</TableCell>
      <TableCell>{ordinance.title}</TableCell>
      <TableCell>{ordinance.description}</TableCell>
      <TableCell>{ordinance.requirements}</TableCell>
      <TableCell>{ordinance.buildingType}</TableCell>
      <TableCell>{ordinance.buildingSize.floors}</TableCell>
    </TableRow>
  );
};