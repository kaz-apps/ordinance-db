import { useState, useMemo } from 'react';
import { Ordinance } from '../../types/ordinance';

export const useOrdinanceFilters = (items: Ordinance[]) => {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>('');
  const [minFloors, setMinFloors] = useState<string>('');
  const [maxFloors, setMaxFloors] = useState<string>('');

  const buildingTypes = useMemo(() => {
    return Array.from(new Set(items.map(ord => ord.buildingType)));
  }, [items]);

  const prefectures = useMemo(() => {
    return Array.from(new Set(items.map(ord => ord.prefecture)));
  }, [items]);

  const cities = useMemo(() => {
    if (!selectedPrefecture) return [];
    return Array.from(
      new Set(
        items
          .filter(ord => ord.prefecture === selectedPrefecture)
          .map(ord => ord.city)
      )
    );
  }, [items, selectedPrefecture]);

  const handlePrefectureChange = (value: string) => {
    setSelectedPrefecture(value);
    setSelectedCity('');
  };

  const filteredOrdinances = useMemo(() => {
    return items.filter(ord => {
      if (selectedPrefecture && selectedPrefecture !== '_all' && ord.prefecture !== selectedPrefecture) return false;
      if (selectedCity && selectedCity !== '_all' && ord.city !== selectedCity) return false;
      if (selectedBuildingType && selectedBuildingType !== '_all' && ord.buildingType !== selectedBuildingType) return false;
      if (minFloors && ord.buildingSize.floors < parseInt(minFloors)) return false;
      if (maxFloors && ord.buildingSize.floors > parseInt(maxFloors)) return false;
      return true;
    });
  }, [items, selectedPrefecture, selectedCity, selectedBuildingType, minFloors, maxFloors]);

  return {
    selectedPrefecture,
    selectedCity,
    selectedBuildingType,
    minFloors,
    maxFloors,
    buildingTypes,
    prefectures,
    cities,
    filteredOrdinances,
    handlePrefectureChange,
    setSelectedCity,
    setSelectedBuildingType,
    setMinFloors,
    setMaxFloors,
  };
};