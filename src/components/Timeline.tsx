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
  const [downloadWidth, setDownloadWidth] = useState<number>(1920);
  const [featureColors, setFeatureColors] = useState<FeatureColor>({
    "pioggia interna": "#0EA5E9",
    "nebulizzazione": "#22D3EE",
    "pioggia esterna": "#7DD3FC",
    "aerato": "#38BDF8",
    "musica": "#818CF8",
    "aroma": "#4ADE80",
    "colore": "#A78BFA",
  });

  const FIXED_COLUMN_WIDTH = 160; // Width of the first column

  // Calculate suggested width based on number of steps
  const calculateSuggestedWidth = () => {
    if (!data || data.length === 0) return 1920;
    const numberOfSteps = data[0].length - 1; // Subtract 1 for the feature column
    const minStepWidth = 80; // Minimum width per step
    return FIXED_COLUMN_WIDTH + (numberOfSteps * minStepWidth);
  };

  // Calculate the dynamic width for each step column
  const calculateStepWidth = () => {
    if (!data || data.length === 0) return 100;
    const numberOfSteps = data[0].length - 1;
    const remainingWidth = downloadWidth - FIXED_COLUMN_WIDTH;
    return `${remainingWidth / numberOfSteps}px`;
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const suggestedWidth = calculateSuggestedWidth();
      setDownloadWidth(suggestedWidth);
      toast.success(`Suggested download width set to ${suggestedWidth}px`);
    }
  }, [data]);

  const handleColorChange = (feature: string, color: string) => {
    setFeatureColors(prev => ({
      ...prev,
      [feature.toLowerCase()]: color
    }));
  };

  const downloadImage = async (format: 'png' | 'svg') => {
    if (!timelineRef.current) return;
    
    try {
      if (format === 'svg') {
        const svgData = new XMLSerializer().serializeToString(timelineRef.current);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(svgBlob);
        link.download = 'timeline.svg';
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        const canvas = await html2canvas(timelineRef.current, {
          width: downloadWidth,
          height: timelineRef.current.offsetHeight,
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
          onclone: (clonedDoc) => {
            const timeline = clonedDoc.querySelector('[data-timeline]');
            if (timeline) {
              timeline.setAttribute('style', `width: ${downloadWidth}px; height: auto;`);
            }
          }
        });
        
        const link = document.createElement('a');
        link.download = 'timeline.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
      
      toast.success(`Timeline downloaded successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error(`Error downloading timeline as ${format.toUpperCase()}`);
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

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Label htmlFor="download-width">Download Width (px)</Label>
            <Input
              id="download-width"
              type="number"
              value={downloadWidth}
              onChange={(e) => setDownloadWidth(Number(e.target.value))}
              min={800}
              step={100}
              className="h-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Suggested width: {calculateSuggestedWidth()}px
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => downloadImage('svg')} variant="outline">
            Download SVG
          </Button>
          <Button onClick={() => downloadImage('png')} variant="outline">
            Download PNG
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="border rounded-lg shadow-sm" style={{ width: '100%' }}>
        <div ref={containerRef} className="overflow-x-auto">
          <div ref={timelineRef} data-timeline className="min-w-max" style={{ width: '100%' }}>
            {/* Timeline rows */}
            {features.map((feature, rowIndex) => {
              const isMusicRow = feature.toLowerCase() === 'musica';
              const isColorRow = feature.toLowerCase() === 'colore';
              
              return (
                <div key={rowIndex} className="flex border-b last:border-b-0 hover:bg-gray-50">
                  <div className="p-4 font-medium truncate border-r" style={{ width: `${FIXED_COLUMN_WIDTH}px`, minWidth: `${FIXED_COLUMN_WIDTH}px`, flexShrink: 0 }}>
                    {feature}
                  </div>
                  <div className="flex flex-1">
                    {isMusicRow ? (
                      <div className="flex-1 h-16 flex items-center justify-center">
                        <TimelineCell
                          rowIndex={rowIndex}
                          feature={feature}
                          value={data[rowIndex][1]}
                          colIndex={1}
                          featureColors={featureColors}
                        />
                      </div>
                    ) : (
                      data[rowIndex].slice(1).map((value, colIndex) => (
                        <div
                          key={colIndex}
                          className="h-16 border-l flex items-center justify-center"
                          style={{ 
                            width: calculateStepWidth(),
                            minWidth: calculateStepWidth()
                          }}
                        >
                          <TimelineCell
                            rowIndex={rowIndex}
                            feature={feature}
                            value={value}
                            colIndex={colIndex}
                            featureColors={featureColors}
                            isColorCell={isColorRow}
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