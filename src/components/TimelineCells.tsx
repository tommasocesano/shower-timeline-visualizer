
import { Input } from "./ui/input";

interface CellProps {
  rowIndex: number;
  feature: string;
  value: any;
  colIndex: number;
  featureColors: Record<string, string>;
  isColorCell?: boolean;
}

export const TimelineCell = ({ rowIndex, feature, value, colIndex, featureColors, isColorCell }: CellProps) => {
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
        <div className="text-black px-2 py-1 text-center w-full">
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
      if (value && value.startsWith('#')) {
        return (
          <div 
            className="w-[90%] h-[80%] rounded shadow-sm"
            style={{ backgroundColor: value }}
          />
        );
      }
      return null;
    default:
      return value ? (
        <div className="w-full h-full flex items-center justify-center">
          <div 
            className="w-[90%] h-[80%] rounded shadow-sm"
            style={{ 
              backgroundColor: featureColors[feature.toLowerCase()],
              opacity: 1
            }}
            title={`${feature} - Step ${colIndex + 1}`}
          />
        </div>
      ) : null;
  }
};
