import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    addEnrolledCourse: (state, action) => {
      if (state.userData) {
        // Make sure enrolledCourses array exists
        if (!state.userData.enrolledCourses) {
          state.userData.enrolledCourses = [];
        }

        // Add new course if not already present
        const courseId = action.payload;
        if (!state.userData.enrolledCourses.includes(courseId)) {
          state.userData.enrolledCourses.push(courseId);
        }
      }
    },
  },
});

export const { setUserData, addEnrolledCourse } = userSlice.actions;
export default userSlice.reducer;
