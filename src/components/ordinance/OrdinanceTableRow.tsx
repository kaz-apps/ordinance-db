import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Ordinance } from '../../types/ordinance';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { XCircle, Layers } from "lucide-react";

interface OrdinanceTableRowProps {
  ordinance: Ordinance;
  onApplicabilityChange: (id: string, status: 'not-applicable' | null) => void;
  applicabilityStatus: Record<string, 'not-applicable' | null>;
  isGroupHeader?: boolean;
}

export const OrdinanceTableRow: React.FC<OrdinanceTableRowProps> = ({
  ordinance,
  onApplicabilityChange,
  applicabilityStatus,
  isGroupHeader = false,
}) => {
  return (
    <TableRow className={isGroupHeader ? "bg-muted/30" : ""}>
      <TableCell>
        <div className="flex items-center space-x-2">
          {isGroupHeader ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span className="font-medium">{ordinance.groupName}</span>
            </div>
          ) : (
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
          )}
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