import React from 'react';
import { TableCell } from "@/components/ui/table";
import { Ordinance } from '../../types/ordinance';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckSquare, XSquare } from "lucide-react";

interface OrdinanceTableRowProps {
  ordinance: Ordinance;
  onApplicabilityChange: (id: string, status: 'applicable' | 'not-applicable' | null) => void;
  applicabilityStatus: Record<string, 'applicable' | 'not-applicable' | null>;
}

export const OrdinanceTableRow: React.FC<OrdinanceTableRowProps> = ({
  ordinance,
  onApplicabilityChange,
  applicabilityStatus,
}) => {
  return (
    <>
      <TableCell>
        <RadioGroup
          value={applicabilityStatus[ordinance.id] || ''}
          onValueChange={(value) => 
            onApplicabilityChange(
              ordinance.id, 
              value as 'applicable' | 'not-applicable' | null
            )
          }
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="applicable" id={`applicable-${ordinance.id}`} />
            <Label htmlFor={`applicable-${ordinance.id}`}>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-applicable" id={`not-applicable-${ordinance.id}`} />
            <Label htmlFor={`not-applicable-${ordinance.id}`}>
              <XSquare className="h-4 w-4 text-red-500" />
            </Label>
          </div>
        </RadioGroup>
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
    </>
  );
};