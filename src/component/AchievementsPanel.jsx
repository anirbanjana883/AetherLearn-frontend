import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { FaPlay, FaFire, FaCrown, FaBook, FaTasks, FaQuestionCircle } from 'react-icons/fa'; // Import all possible icons

// --- Icon Map ---
// This object maps the string from your database to the actual icon component.
const iconMap = {
  FaPlay: <FaPlay />,
  FaFire: <FaFire />,
  FaCrown: <FaCrown />,
  FaBook: <FaBook />,
  FaTasks: <FaTasks />,
};

function AchievementsPanel() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/achievements/my-achievements`, { withCredentials: true });
        setAchievements(result.data);
      } catch (error) {
        console.error("Failed to fetch achievements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
      <h3 className="text-xl font-bold text-blue-300 mb-6">Achievements Unlocked</h3>
      
      {loading ? (
        <p className="text-slate-400">Loading achievements...</p>
      ) : achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(ach => (
            <div key={ach._id} className="group flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-blue-500/20 transition-all duration-300 hover:bg-slate-700/70 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <div className="text-3xl text-cyan-400 p-3 bg-slate-900 rounded-md shadow-lg transition-colors duration-300 group-hover:text-white">
                {iconMap[ach.icon] || <FaQuestionCircle />}
              </div>
              <div>
                <p className="font-bold text-white">{ach.name}</p>
                <p className="text-xs text-slate-400">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-sm text-center py-8">
          No achievements unlocked yet. Keep learning to earn your first badge!
        </p>
      )}
    </div>
  );
}

export default AchievementsPanel;