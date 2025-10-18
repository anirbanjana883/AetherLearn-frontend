import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import aiimg from "../assets/SearchAi_bl.png";
import { useSelector } from "react-redux";
import Card from "../component/Card";
import { FaFilter, FaTimes, FaGhost } from "react-icons/fa";

function AllCourses() {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [visibleSideBar, setVisibleSideBar] = useState(false);

  const categories = [
    "Web Development", "UI/UX Designing", "App Development",
    "Blockchain", "AI / ML", "Data Science",
    "Data Analytics", "Ethical Hacking", "Others"
  ];

  const toggleCategory = (selectedCategory) => {
    setCategory((prev) =>
      prev.includes(selectedCategory)
        ? prev.filter((c) => c !== selectedCategory)
        : [...prev, selectedCategory]
    );
  };

  useEffect(() => {
    let courseCopy = courseData ? [...courseData] : [];
    if (category.length > 0) {
      courseCopy = courseCopy.filter((c) => category.includes(c.category));
    }
    setFilterCourses(courseCopy);
  }, [category, courseData]);

  return (
    <div className="w-full min-h-screen relative bg-[#030712] text-white">
      <Nav />

      {/* Mobile Filter Toggle Button */}
      <button
        className="lg:hidden fixed top-24 left-4 z-30 flex items-center gap-2 px-4 py-2 rounded-full
                   bg-[#0A0F1C]/60 backdrop-blur-md border border-blue-500/40 text-cyan-300
                   shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        onClick={() => setVisibleSideBar(true)} // Directly open sidebar
      >
        <FaFilter />
        <span>Filters</span>
      </button>

      {/* Backdrop Overlay for mobile */}
      {visibleSideBar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setVisibleSideBar(false)}
        ></div>
      )}

      {/* Filter Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-[280px] h-full overflow-y-auto z-50 lg:z-10
                   bg-[#0A0F1C]/80 backdrop-blur-2xl border-r border-blue-500/30
                   transition-transform duration-300 ease-in-out pt-24 lg:pt-28 p-6
                   ${visibleSideBar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full bg-black/30 transition-colors hover:bg-blue-500/20"
            >
              <FaArrowLeftLong className="text-lg text-blue-400" />
            </button>
            <h2 className="text-2xl font-bold text-slate-200">Filters</h2>
          </div>
          {/* Close button for mobile */}
          <button className="lg:hidden p-2" onClick={() => setVisibleSideBar(false)}>
            <FaTimes className="text-xl text-slate-400" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <button
            className="group relative flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-base font-semibold
                       bg-transparent border-2 border-cyan-500 text-cyan-300
                       transition-all duration-300 hover:bg-cyan-500/10 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
            onClick={() => navigate("/search")}
          >
            Search With AI
            <img src={aiimg} className="w-6 h-6 rounded-full transition-transform duration-300 group-hover:rotate-12" alt="AI Search" />
          </button>

          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4">Category</h3>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                    border border-blue-500/30
                    ${category.includes(cat)
                      ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                      : "bg-slate-900/50 text-slate-300 hover:bg-slate-800/70 hover:border-blue-500/60"
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="w-full transition-all duration-300 pt-32 pb-16 lg:pl-[320px]"
      >
        <div className="px-4 sm:px-6">
          {filterCourses?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8">
              {filterCourses.map((course) => (
                <div key={course._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <Card
                    thumbnail={course?.thumbnail}
                    title={course?.title}
                    category={course?.category}
                    price={course?.price}
                    id={course?._id}
                    reviews={course?.reviews}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24">
              <FaGhost className="text-cyan-500/20 text-8xl mb-6" />
              <h2 className="text-slate-300 font-semibold text-2xl">
                No Courses Found
              </h2>
              <p className="text-slate-400 text-base mt-2 max-w-sm">
                Try adjusting your filters or check back later for new content!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AllCourses;