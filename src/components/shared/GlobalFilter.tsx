'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export type FilterType = 'radio' | 'checkbox' | 'range' | 'search';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig {
  id: string;          // e.g. 'categories', 'brands', 'minPrice', 'search'
  title: string;
  type: FilterType;
  options?: FilterOption[]; // For radio/checkbox
  min?: number;        // For range
  max?: number;        // For range
  step?: number;       // For range
  rangeIds?: [string, string]; // e.g. ['minPrice', 'maxPrice'] for range type if splitting values
}

export interface GlobalFilterProps {
  schema: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

export function GlobalFilter({ schema, values, onChange }: GlobalFilterProps) {
  // Helper to handle updating a single value
  const handleChange = (id: string, value: any) => {
    onChange({ ...values, [id]: value });
  };

  // Helper to handle checkbox arrays
  const handleCheckboxChange = (id: string, optionValue: string | number, checked: boolean) => {
    const currentArray = Array.isArray(values[id]) ? values[id] : [];
    let newArray;
    if (checked) {
      newArray = [...currentArray, optionValue];
    } else {
      newArray = currentArray.filter((val: any) => val !== optionValue);
    }
    onChange({ ...values, [id]: newArray.length > 0 ? newArray : undefined });
  };

  return (
    <div className="space-y-8">
      {schema.map((filter) => {
        switch (filter.type) {
          case 'search':
            return (
              <FilterSearch 
                key={filter.id} 
                config={filter} 
                value={values[filter.id] || ''} 
                onChange={(val) => handleChange(filter.id, val || undefined)} 
              />
            );

          case 'radio':
            return (
              <div key={filter.id} className="space-y-3">
                <h3 className="font-semibold text-lg">{filter.title}</h3>
                <RadioGroup 
                  value={values[filter.id] || ''} 
                  onValueChange={(val) => handleChange(filter.id, val || undefined)}
                >
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <RadioGroupItem value="" id={`${filter.id}-all`} />
                    <Label htmlFor={`${filter.id}-all`}>All</Label>
                  </div>
                  {filter.options?.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2 space-x-reverse mb-2">
                      <RadioGroupItem value={String(opt.value)} id={`${filter.id}-${opt.value}`} />
                      <Label htmlFor={`${filter.id}-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            );

          case 'checkbox':
            return (
              <div key={filter.id} className="space-y-3">
                <h3 className="font-semibold text-lg">{filter.title}</h3>
                <div className="space-y-2">
                  {filter.options?.map((opt) => {
                    const currentArray = Array.isArray(values[filter.id]) ? values[filter.id] : [];
                    const isChecked = currentArray.includes(opt.value);
                    return (
                      <div key={opt.value} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox 
                          id={`${filter.id}-${opt.value}`} 
                          checked={isChecked}
                          onCheckedChange={(checked) => handleCheckboxChange(filter.id, opt.value, checked as boolean)}
                        />
                        <Label htmlFor={`${filter.id}-${opt.value}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );

          case 'range':
            const minId = filter.rangeIds ? filter.rangeIds[0] : `${filter.id}_min`;
            const maxId = filter.rangeIds ? filter.rangeIds[1] : `${filter.id}_max`;
            const minVal = values[minId] ?? filter.min ?? 0;
            const maxVal = values[maxId] ?? filter.max ?? 1000;
            
            return (
              <FilterRange 
                key={filter.id}
                config={filter}
                minVal={minVal}
                maxVal={maxVal}
                onChange={(newMin, newMax) => {
                  onChange({
                    ...values,
                    [minId]: newMin !== filter.min ? newMin : undefined,
                    [maxId]: newMax !== filter.max ? newMax : undefined,
                  });
                }}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

// Sub-components for complex state like search debouncing and slider
function FilterSearch({ config, value, onChange }: { config: FilterConfig; value: string; onChange: (v: string) => void }) {
  const [localVal, setLocalVal] = useState(value);
  const debouncedVal = useDebounce(localVal, 400);

  useEffect(() => {
    onChange(debouncedVal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedVal]);

  return (
    <div className="space-y-3">
      {config.title && <h3 className="font-semibold text-lg">{config.title}</h3>}
      <div className="relative">
        <Search className="absolute start-3 rtl:start-auto rtl:end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}...`}
          className="ps-10 rtl:ps-3 rtl:pe-10"
        />
      </div>
    </div>
  );
}

function FilterRange({ config, minVal, maxVal, onChange }: { config: FilterConfig; minVal: number; maxVal: number; onChange: (min: number, max: number) => void }) {
  const [range, setRange] = useState([minVal, maxVal]);
  const debouncedRange = useDebounce(range, 400);

  useEffect(() => {
    onChange(debouncedRange[0], debouncedRange[1]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRange]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{config.title}</h3>
      <Slider 
        min={config.min ?? 0} 
        max={config.max ?? 1000} 
        step={config.step ?? 10} 
        value={range}
        onValueChange={(val) => setRange(Array.isArray(val) ? [...val] : [val as number])}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{range[0]} EGP</span>
        <span>{range[1]} EGP</span>
      </div>
    </div>
  );
}
