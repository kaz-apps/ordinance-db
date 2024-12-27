import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrdinanceFiltersProps {
  selectedPrefecture: string;
  selectedCity: string;
  selectedBuildingType: string;
  minFloors: string;
  maxFloors: string;
  prefectures: string[];
  cities: string[];
  buildingTypes: string[];
  onPrefectureChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onBuildingTypeChange: (value: string) => void;
  onMinFloorsChange: (value: string) => void;
  onMaxFloorsChange: (value: string) => void;
}

export const OrdinanceFilters: React.FC<OrdinanceFiltersProps> = ({
  selectedPrefecture,
  selectedCity,
  prefectures,
  cities,
  onPrefectureChange,
  onCityChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select value={selectedPrefecture} onValueChange={onPrefectureChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="都道府県を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">すべての都道府県</SelectItem>
          {prefectures.map(prefecture => (
            <SelectItem key={prefecture} value={prefecture}>
              {prefecture}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCity} onValueChange={onCityChange} disabled={!selectedPrefecture}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="市区町村を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">すべての市区町村</SelectItem>
          {cities.map(city => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};