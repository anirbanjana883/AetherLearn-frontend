import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isLoader: true, // Crucial for the Auth Foundation
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isLoader = false; // Stop loading when user data is set
    },
    // Adding this fixes the "SyntaxError: does not provide an export named setLoader"
    setLoader: (state, action) => {
      state.isLoader = action.payload;
    },
    addEnrolledCourse: (state, action) => {
      if (state.userData) {
        if (!state.userData.enrolledCourses) {
          state.userData.enrolledCourses = [];
        }
        const courseId = action.payload;
        if (!state.userData.enrolledCourses.includes(courseId)) {
          state.userData.enrolledCourses.push(courseId);
        }
      }
    },
  },
});

// Export both so AuthContext can use them
export const { setUserData, setLoader, addEnrolledCourse } = userSlice.actions;
export default userSlice.reducer;