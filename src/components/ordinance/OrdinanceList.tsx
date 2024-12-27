import React from 'react';
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ordinance } from '../../types/ordinance';
import { OrdinanceTableHeader } from './OrdinanceTableHeader';
import { OrdinanceTableRow } from './OrdinanceTableRow';
import { useSession } from '@supabase/auth-helpers-react';

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
  const session = useSession();
  const isAuthenticated = !!session;

  // グループごとに条例をまとめる
  const groupedOrdinances = ordinances.reduce((acc, ordinance) => {
    const group = ordinance.groupName;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(ordinance);
    return acc;
  }, {} as Record<string, Ordinance[]>);

  return (
    <div className="border rounded-lg">
      <ScrollArea className="h-[600px]">
        <Table>
          <OrdinanceTableHeader onSort={onSort} />
          <TableBody>
            {Object.entries(groupedOrdinances).map(([groupName, groupOrdinances], groupIndex) => {
              // For unauthenticated users, only show the first group's first row clearly
              const shouldBlurGroup = !isAuthenticated && groupIndex > 0;
              
              return (
                <React.Fragment key={groupName}>
                  <OrdinanceTableRow
                    ordinance={groupOrdinances[0]}
                    onApplicabilityChange={onApplicabilityChange}
                    applicabilityStatus={applicabilityStatus}
                    isGroupHeader={true}
                    isBlurred={shouldBlurGroup}
                  />
                  {groupOrdinances.map((ordinance, index) => {
                    // For unauthenticated users, blur all rows except the first row of the first group
                    const shouldBlurRow = !isAuthenticated && (groupIndex > 0 || index > 0);
                    
                    return (
                      <OrdinanceTableRow
                        key={ordinance.id}
                        ordinance={ordinance}
                        onApplicabilityChange={onApplicabilityChange}
                        applicabilityStatus={applicabilityStatus}
                        isBlurred={shouldBlurRow}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};