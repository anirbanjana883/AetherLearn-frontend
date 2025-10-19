import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

// A custom component for the tooltip to match your futuristic theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-md border border-blue-500/30 rounded-lg p-3 shadow-lg">
        <p className="font-bold text-cyan-300">{`${label}`}</p>
        <p className="text-white">{`Progress: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

function CourseProgressChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/stats/course-progress`, { withCredentials: true });
        // Sort data from highest to lowest progress for better visualization
        const sortedData = result.data.sort((a, b) => b.progress - a.progress);
        setChartData(sortedData);
      } catch (error) {
        console.error("Failed to fetch course progress data", error);
      }
    };
    fetchCourseProgress();
  }, []);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border  border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.3)] p-6 transition-all duration-500 hover:shadow-[0_0_45px_rgba(37,99,235,0.6)] h-[450px]">
      <h3 className="text-xl font-bold text-blue-300 mb-6">Course Activity Overview</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          layout="vertical" // Creates a horizontal bar chart
          margin={{ top: 5, right: 40, left: 20, bottom: 20 }}
        >
          {/* Define the gradient for the bars */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        
          <CartesianGrid stroke="rgba(59, 130, 246, 0.1)" strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            stroke="#60a5fa" 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            label={{ value: 'Completion %', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 14 }}
          />
          <YAxis 
            type="category" 
            dataKey="courseTitle" 
            width={100} 
            stroke="#60a5fa" 
            tick={{ fill: '#e2e8f0', fontSize: 12, width: 90 }} 
            tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
            content={<CustomTooltip />}
            animationDuration={300}
          />
          <Bar dataKey="progress" fill="url(#barGradient)" barSize={20} radius={[0, 5, 5, 0]}>
            <LabelList dataKey="progress" position="right" formatter={(value) => `${value}%`} style={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 'bold' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CourseProgressChart;