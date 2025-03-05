
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
    
    // Check for both English and Italian names for special rows
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature === 'musica' || lowerFeature === 'music') return 'music';
    if (lowerFeature === 'aroma' || lowerFeature === 'scent') return 'aroma';
    if (lowerFeature === 'colore' || lowerFeature === 'color') return 'color';
    
    return null;
  };

  const specialRow = isSpecialRow(rowIndex, feature);
  
  switch (specialRow) {
    case 'duration':
      return (
        <div className="text-black px-2 py-1 rounded">
          {value}s
        </div>
      );
    case 'temperature':
      return (
        <div className="text-black px-2 py-1 rounded">
          {value}°
        </div>
      );
    case 'music':
      return value ? (
        <div 
          className="flex items-center justify-center w-full h-full"
          style={{
            position: 'relative',
            overflow: 'visible'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '20%', // Shifted from 50% to 20% (30% to the left)
              transform: 'translate(-50%, -50%) rotate(-90deg)',
              transformOrigin: 'center center',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              width: 'auto',
              padding: '0 2px',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {value}
          </div>
        </div>
      ) : null;
    case 'aroma':
      return value ? (
        <div 
          className="flex items-center justify-center w-full h-full"
          style={{
            position: 'relative',
            overflow: 'visible'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '35%', // Shifted from 50% to 20% (30% to the left)
              transform: 'translate(-50%, -50%) rotate(-90deg)',
              transformOrigin: 'center center',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              width: 'auto',
              padding: '0 2px',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {value}
          </div>
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
