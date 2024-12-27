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
  selectedBuildingType,
  minFloors,
  maxFloors,
  prefectures,
  cities,
  buildingTypes,
  onPrefectureChange,
  onCityChange,
  onBuildingTypeChange,
  onMinFloorsChange,
  onMaxFloorsChange,
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

      <Select value={selectedBuildingType} onValueChange={onBuildingTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="建築用途を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">すべての用途</SelectItem>
          {buildingTypes.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="最小階数"
          value={minFloors}
          onChange={(e) => onMinFloorsChange(e.target.value)}
          className="w-24 px-3 py-2 border rounded"
        />
        <span>～</span>
        <input
          type="number"
          placeholder="最大階数"
          value={maxFloors}
          onChange={(e) => onMaxFloorsChange(e.target.value)}
          className="w-24 px-3 py-2 border rounded"
        />
        <span>階</span>
      </div>
    </div>
  );
};