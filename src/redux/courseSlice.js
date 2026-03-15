import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    creatorCourseData: [], // Courses created by the logged-in educator
    courseData: [],        // All public courses
    selectedCourse: null,  // The specific course being viewed (Deeply Populated)
  },
  reducers: {
    setCreatorCourseData: (state, action) => {
      state.creatorCourseData = action.payload;
    },
    setCourseData: (state, action) => {
      state.courseData = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    // FAANG TIP: Add a clearer to prevent data leaking between course views
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    }
  }
});

export const { 
    setCreatorCourseData, 
    setCourseData, 
    setSelectedCourse, 
    clearSelectedCourse 
} = courseSlice.actions;

export default courseSlice.reducer;