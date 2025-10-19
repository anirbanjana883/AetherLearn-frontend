import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import axios from 'axios';
import { serverUrl } from '../App';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// A simple hook to check screen width
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

function StudentHeatmap() {
  const [data, setData] = useState([]);
  const isMobile = useIsMobile(); // Use the hook to detect screen size

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/progress`, {
          withCredentials: true,
        });
        setData(result.data);
      } catch (error) {
        console.error("Could not fetch progress data", error);
      }
    };
    fetchProgress();
  }, []);

  const today = new Date();

  // --- RESPONSIVE DATE LOGIC ---
  // Calculate the start date based on screen size
  const getStartDate = () => {
    const date = new Date();
    if (isMobile) {
      // For mobile, show the last 3 months
      date.setMonth(date.getMonth() - 3);
    } else {
      // For desktop, show the last year
      date.setFullYear(date.getFullYear() - 1);
    }
    return date;
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-blue-300">Your Daily Progress</h3>
        {isMobile && <p className="text-xs text-slate-400 font-mono animate-pulse">Scrollable →</p>}
      </div>

      {/* --- RESPONSIVE WRAPPER --- */}
      {/* On mobile, this div will allow horizontal scrolling */}
      <div className={`text-white ${isMobile ? 'overflow-x-auto scrollbar-hide' : ''}`}>
        <div className={isMobile ? 'w-[700px]' : ''}> {/* Force a wider container for the heatmap on mobile */}
          <CalendarHeatmap
            startDate={getStartDate()}
            endDate={today}
            values={data}
            showMonthLabels={!isMobile} // Hide month labels on mobile for a cleaner look
            showWeekdayLabels={true}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'color-empty';
              if (value.count >= 4) return 'color-scale-4';
              if (value.count >= 3) return 'color-scale-3';
              if (value.count >= 2) return 'color-scale-2';
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
        <ReactTooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
}

export default StudentHeatmap;