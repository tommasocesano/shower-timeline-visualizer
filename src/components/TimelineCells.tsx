import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CellProps {
  rowIndex: number;
  feature: string;
  value: any;
  colIndex: number;
  featureColors: Record<string, string>;
  onColorChange?: (color: string) => void;
}

export const TimelineCell = ({ rowIndex, feature, value, colIndex, featureColors, onColorChange }: CellProps) => {
  const isSpecialRow = (rowIndex: number, feature: string): string | null => {
    if (rowIndex === 0) return 'duration';
    if (rowIndex === 1) return 'temperature';
    if (feature.toLowerCase() === 'musica') return 'music';
    if (feature.toLowerCase() === 'aroma') return 'aroma';
    if (feature.toLowerCase() === 'colore') return 'color';
    return null;
  };

  const specialRow = isSpecialRow(rowIndex, feature);
  
  switch (specialRow) {
    case 'duration':
      return (
        <div className="text-black bg-white px-2 py-1 rounded">
          {value}s
        </div>
      );
    case 'temperature':
      return (
        <div className="text-black bg-white px-2 py-1 rounded">
          {value}°C
        </div>
      );
    case 'music':
      return value ? (
        <div className="text-black bg-white px-2 py-1 rounded">
          {value}
        </div>
      ) : null;
    case 'aroma':
      return value ? (
        <div className="text-black px-2 py-1">
          {value}
        </div>
      ) : null;
    case 'color':
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onColorChange?.(e.target.value)}
          className="w-20 h-8 text-xs"
          placeholder="#hex"
          style={{ backgroundColor: value || '#ffffff' }}
        />
      );
    default:
      return value ? (
        <div 
          className="w-[90%] h-[80%] rounded shadow-sm animate-fade-in flex items-center justify-center"
          style={{ backgroundColor: featureColors[feature.toLowerCase()] }}
          title={`${feature} - Step ${colIndex + 1}`}
        />
      ) : null;
  }
};