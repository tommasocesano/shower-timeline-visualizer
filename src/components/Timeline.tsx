import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface TimelineProps {
  data: any[][];
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateWidth = (duration: number) => {
    const baseWidth = 50; // px per time unit
    return `${duration * baseWidth}px`;
  };

  const getColorForFeature = (feature: string) => {
    const colors: { [key: string]: string } = {
      "pioggia interna": "bg-blue-500",
      "nebulizzazione": "bg-cyan-300",
      "pioggia esterna": "bg-blue-300",
      "aerato": "bg-sky-400",
      "musica": "bg-indigo-400",
      "aroma": "bg-green-400",
      "colore": "bg-purple-400",
      default: "bg-gray-400",
    };
    
    return colors[feature.toLowerCase()] || colors.default;
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
    <div className="mt-8 border rounded-lg shadow-sm overflow-hidden">
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
                  className="w-[50px] p-4 text-center font-medium border-l"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline rows */}
          {features.map((feature, rowIndex) => (
            <div key={rowIndex} className="flex border-b last:border-b-0">
              <div className="w-40 p-4 font-medium truncate">
                {feature}
              </div>
              <div className="flex">
                {data[rowIndex].slice(1).map((active, colIndex) => (
                  <div
                    key={colIndex}
                    className={`w-[50px] p-4 border-l flex items-center justify-center`}
                  >
                    {active && (
                      <div 
                        className={`w-full h-full rounded ${getColorForFeature(feature)} animate-fade-in`}
                        title={`${feature} - Step ${colIndex + 1}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};