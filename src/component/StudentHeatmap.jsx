import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css'; 
import './Heatmap.css'; 

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

// 🚨 Accept 'data' as a prop from the parent StudentDashboard
function StudentHeatmap({ data }) {
  const isMobile = useIsMobile();

  const today = new Date();
  const getStartDate = () => {
    const date = new Date();
    isMobile ? date.setMonth(date.getMonth() - 4) : date.setFullYear(date.getFullYear() - 1);
    return date;
  };

  return (
    <div className="bg-[#0A0F1C] border border-blue-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group transition-all hover:border-blue-500/40">
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Learning Consistency</h3>
          <p className="text-xs text-slate-500 mt-1">Visualize your daily dedication</p>
        </div>
        
        {/* Your awesome Legend */}
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase">Less</span>
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-blue-900/20 border border-blue-500/10"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-600/40"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase">More</span>
        </div>
      </div>

      <div className={`heatmap-container text-white relative z-10 ${isMobile ? 'overflow-x-auto custom-scrollbar' : ''}`}>
        <div className={isMobile ? 'w-[600px] pb-4' : 'w-full'}>
          <CalendarHeatmap
            startDate={getStartDate()}
            endDate={today}
            values={data || []} // 🚨 Safely use the prop here
            gutterSize={4}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'color-empty';
              // Logic: Scales color intensity based on activityCount
              if (value.count >= 5) return 'color-scale-4';
              if (value.count >= 3) return 'color-scale-3';
              if (value.count >= 1) return 'color-scale-2';
              return 'color-scale-1';
            }}
            tooltipDataAttrs={value => {
              if (!value || !value.date) return null;
              return {
                'data-tooltip-id': 'heatmap-tooltip',
                'data-tooltip-content': `${value.count || 0} activities on ${value.date}`
              };
            }}
          />
        </div>
        <ReactTooltip id="heatmap-tooltip" effect="solid" className="custom-tooltip bg-[#0F172A] border border-blue-500 font-bold rounded-lg z-50" />
      </div>
    </div>
  );
}

export default StudentHeatmap;