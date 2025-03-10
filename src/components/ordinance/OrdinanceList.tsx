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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  // サブスクリプション状態の取得を改善
  const { data: subscription } = useQuery({
    queryKey: ['subscription', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) {
        console.error('Subscription fetch error:', error);
        return null;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const isPremiumUser = subscription?.plan === 'premium';
  console.log('Is Premium User:', isPremiumUser, 'Subscription:', subscription); // デバッグログを詳細化

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
              // プレミアムユーザーの場合は常にぼかしなし
              const shouldBlurGroup = isPremiumUser ? false : !isAuthenticated && groupIndex > 0;
              
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
                    // プレミアムユーザーの場合は常にぼかしなし
                    const shouldBlurRow = isPremiumUser ? false : 
                      !isAuthenticated ? (groupIndex > 0 || index > 0) : // 未認証: 最初の行以外をぼかす
                      (ordinance.category !== '調査'); // 無料ユーザー: 調査カテゴリ以外をぼかす

                    console.log('Row blur status:', {
                      isPremiumUser,
                      subscription,
                      isAuthenticated,
                      category: ordinance.category,
                      shouldBlurRow,
                      groupIndex,
                      index
                    });

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