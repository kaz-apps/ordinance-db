import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Ordinance } from '../../types/ordinance';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { XCircle, Layers, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrdinanceTableRowProps {
  ordinance: Ordinance;
  onApplicabilityChange: (id: string, status: 'not-applicable' | null) => void;
  applicabilityStatus: Record<string, 'not-applicable' | null>;
  isGroupHeader?: boolean;
  isBlurred?: boolean;
}

export const OrdinanceTableRow: React.FC<OrdinanceTableRowProps> = ({
  ordinance,
  onApplicabilityChange,
  applicabilityStatus,
  isGroupHeader = false,
  isBlurred = false,
}) => {
  if (isGroupHeader) {
    return (
      <TableRow>
        <TableCell
          colSpan={10}
          className={cn(
            "bg-gray-700 text-white font-medium py-2 px-4 relative",
            isBlurred && "blur-[2px]"
          )}
        >
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>{ordinance.groupName}</span>
          </div>
          {isBlurred && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Lock className="h-5 w-5 text-white" />
            </div>
          )}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="relative">
      <TableCell className={cn(isBlurred && "blur-[2px] pointer-events-none")}>
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
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.prefecture}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.city}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.category}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.subCategory}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.title}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.description}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.requirements}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.buildingType}</TableCell>
      <TableCell className={cn(isBlurred && "blur-[2px]")}>{ordinance.buildingSize.floors}</TableCell>
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <Lock className="h-5 w-5 text-white" />
        </div>
      )}
    </TableRow>
  );
};