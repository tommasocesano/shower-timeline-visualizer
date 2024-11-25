import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Timeline } from "@/components/Timeline";

const Index = () => {
  const [timelineData, setTimelineData] = useState<any[][]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shower Program Visualizer
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your shower program Excel file to visualize it as a timeline
          </p>
          
          <FileUpload onDataLoaded={setTimelineData} />
          <Timeline data={timelineData} />
        </div>
      </div>
    </div>
  );
};

export default Index;