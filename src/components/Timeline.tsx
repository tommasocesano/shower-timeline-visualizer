import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface TimelineProps {
  data: any[][];
}

interface FeatureColor {
  [key: string]: string;
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [featureColors, setFeatureColors] = useState<FeatureColor>({
    "pioggia interna": "#0EA5E9",
    "nebulizzazione": "#22D3EE",
    "pioggia esterna": "#7DD3FC",
    "aerato": "#38BDF8",
    "musica": "#818CF8",
    "aroma": "#4ADE80",
    "colore": "#A78BFA",
  });

  const handleColorChange = (feature: string, color: string) => {
    setFeatureColors(prev => ({
      ...prev,
      [feature.toLowerCase()]: color
    }));
  };

  const isSpecialRow = (rowIndex: number, feature: string): string | null => {
    if (rowIndex === 0) return 'duration';
    if (rowIndex === 1) return 'temperature';
    if (feature.toLowerCase() === 'musica') return 'music';
    if (feature.toLowerCase() === 'aroma') return 'aroma';
    if (feature.toLowerCase() === 'colore') return 'color';
    return null;
  };

  const renderCell = (rowIndex: number, feature: string, value: any, colIndex: number) => {
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
        if (colIndex === 1) {
          return (
            <div className="col-span-full bg-indigo-100 px-2 py-1 rounded">
              {value}
            </div>
          );
        }
        return null;
      case 'aroma':
        return value ? (
          <div className="bg-green-100 px-2 py-1 rounded">
            {value}
          </div>
        ) : null;
      case 'color':
        return value ? (
          <div 
            className="w-[90%] h-[80%] rounded shadow-sm"
            style={{ backgroundColor: value }}
            title={`Color: ${value}`}
          />
        ) : null;
      default:
        return value ? (
          <div 
            className={`w-[90%] h-[80%] rounded shadow-sm animate-fade-in`}
            style={{ backgroundColor: featureColors[feature.toLowerCase()] }}
            title={`${feature} - Step ${colIndex + 1}`}
          />
        ) : null;
    }
  };

  useEffect(() => {
    if (data.length === 0) return;
    
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
    
    toast.success("Timeline updated!");
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Upload an Excel file to see the timeline
      </div>
    );
  }

  const features = data.map((row) => row[0]).filter(Boolean);
  const steps = data[0]?.slice(1).length || 0;

  return (
    <div className="space-y-4">
      {/* Color controls */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        {features.map((feature, index) => {
          const specialRow = isSpecialRow(index, feature);
          if (specialRow) return null;
          
          return (
            <div key={feature} className="space-y-2">
              <Label htmlFor={`color-${feature}`}>{feature}</Label>
              <Input
                id={`color-${feature}`}
                type="color"
                value={featureColors[feature.toLowerCase()]}
                onChange={(e) => handleColorChange(feature, e.target.value)}
                className="h-10 w-full"
              />
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <div 
          ref={containerRef}
          className="overflow-x-auto"
        >
          <div className="min-w-max">
            {/* Header */}
            <div className="flex border-b bg-gray-50">
              <div className="w-40 p-4 font-medium">Feature</div>
              <div className="flex">
                {Array.from({ length: steps }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[100px] p-4 text-center font-medium border-l"
                  >
                    Step {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline rows */}
            {features.map((feature, rowIndex) => (
              <div key={rowIndex} className="flex border-b last:border-b-0 hover:bg-gray-50">
                <div className="w-40 p-4 font-medium truncate">
                  {feature}
                </div>
                <div className="flex">
                  {data[rowIndex].slice(1).map((value, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-[100px] h-16 border-l flex items-center justify-center`}
                    >
                      {renderCell(rowIndex, feature, value, colIndex + 1)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};