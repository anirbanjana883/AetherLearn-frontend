import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

import axios from 'axios';
import { serverUrl } from '../App'; // Your server URL from App.js
import { Tooltip as ReactTooltip } from 'react-tooltip' // For showing data on hover

function StudentHeatmap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/progress`, {
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
  
  // Calculate the date one year ago to set the start date for the heatmap
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
      <h3 className="text-xl font-bold text-blue-300 mb-6">Your Daily Progress</h3>
      <div className="text-white">
        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={data}
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return 'color-empty';
            }
            // This creates a color scale based on the number of activities
            if (value.count >= 4) return 'color-scale-4';
            if (value.count >= 3) return 'color-scale-3';
            if (value.count >= 2) return 'color-scale-2';
            return 'color-scale-1';
          }}
          // Configuration for the tooltip that appears on hover
          tooltipDataAttrs={value => {
            if (!value || !value.date) return null;
            return {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': `${value.count || 0} activities on ${value.date}`
            };
          }}
        />
        {/* The actual tooltip component from the library */}
        <ReactTooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
}

export default StudentHeatmap;