import { useState } from 'react';
import { Ordinance } from '../../types/ordinance';

type SortConfig = {
  key: keyof Ordinance | 'buildingSize.floors' | 'buildingSize.height' | 'buildingSize.totalArea';
  direction: 'asc' | 'desc';
} | null;

export const useOrdinanceSort = (initialItems: Ordinance[]) => {
  const [items, setItems] = useState(initialItems);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleSort = (key: SortConfig['key']) => {
    if (!key) return;
    
    const direction = 
      sortConfig?.key === key && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    
    setSortConfig({ key, direction });
    
    const sorted = [...items].sort((a, b) => {
      let aValue = key.includes('.') 
        ? key.split('.').reduce((obj, key) => obj[key], a)
        : a[key];
      let bValue = key.includes('.')
        ? key.split('.').reduce((obj, key) => obj[key], b)
        : b[key];
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setItems(sorted);
  };

  return {
    items,
    setItems,
    handleSort,
  };
};