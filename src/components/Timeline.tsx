import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import { TimelineCell } from "./TimelineCells";

interface TimelineProps {
  data: any[][];
}

interface FeatureColor {
  [key: string]: string;
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
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

  const downloadImage = async () => {
    if (!timelineRef.current) return;
    
    try {
      // Create a clone of the timeline element
      const clone = timelineRef.current.cloneNode(true) as HTMLElement;
      clone.style.width = '1920px';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        width: 1920,
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: true
      });
      
      document.body.removeChild(clone);
      
      const link = document.createElement('a');
      link.download = 'timeline.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success("Timeline downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading timeline");
      console.error(error);
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

  return (
    <div className="space-y-4 font-['Sarabun']">
      {/* Color controls */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        {features.map((feature, index) => {
          if (index <= 1 || feature.toLowerCase() === 'musica' || 
              feature.toLowerCase() === 'aroma' || feature.toLowerCase() === 'colore') return null;
          
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

      <div className="flex justify-end">
        <Button onClick={downloadImage} variant="outline">
          Download PNG
        </Button>
      </div>

      {/* Timeline */}
      <div className="border rounded-lg shadow-sm overflow-hidden" style={{ width: '1920px' }}>
        <div ref={containerRef} className="overflow-x-auto">
          <div ref={timelineRef} className="min-w-max" style={{ width: '1920px' }}>
            {/* Timeline rows */}
            {features.map((feature, rowIndex) => {
              if (rowIndex === 0) return null;
              
              const isMusicRow = feature.toLowerCase() === 'musica';
              
              return (
                <div key={rowIndex} className="flex border-b last:border-b-0 hover:bg-gray-50">
                  <div className="w-40 p-4 font-medium truncate">
                    {feature}
                  </div>
                  <div className="flex flex-1">
                    {isMusicRow ? (
                      <>
                        <div className="w-[100px] h-16 border-l flex items-center justify-center">
                          <TimelineCell
                            rowIndex={rowIndex}
                            feature={feature}
                            value={data[rowIndex][1]}
                            colIndex={1}
                            featureColors={featureColors}
                          />
                        </div>
                        <div className="flex-1 h-16 border-l flex items-center">
                          <TimelineCell
                            rowIndex={rowIndex}
                            feature={feature}
                            value={data[rowIndex][1]}
                            colIndex={1}
                            featureColors={featureColors}
                          />
                        </div>
                      </>
                    ) : (
                      data[rowIndex].slice(1).map((value, colIndex) => (
                        <div
                          key={colIndex}
                          className="w-[100px] h-16 border-l flex items-center justify-center"
                        >
                          <TimelineCell
                            rowIndex={rowIndex}
                            feature={feature}
                            value={value}
                            colIndex={colIndex}
                            featureColors={featureColors}
                            onColorChange={
                              feature.toLowerCase() === 'colore' 
                                ? (color) => {
                                    const newData = [...data];
                                    newData[rowIndex][colIndex + 1] = color;
                                  }
                                : undefined
                            }
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};