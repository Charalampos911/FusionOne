import { createSlice } from '@reduxjs/toolkit';

const themeList = ['white-blue', 'white-green', 'neon-blue', 'neon-green'];

// Load initial theme from localStorage if available, otherwise default to 'white-blue'
const initialTheme = localStorage.getItem('theme') || 'white-blue';

const ThemesReducer = createSlice({
  name: 'theme',
  initialState: {
    current: themeList.includes(initialTheme) ? initialTheme : 'white-blue',
    device: null
  },
  reducers: {
    cycleTheme: (state) => {
      const nextIdx = (themeList.indexOf(state.current) + 1) % themeList.length;
      state.current = themeList[nextIdx];
      
      // Persist to localStorage and apply attribute directly
      localStorage.setItem('theme', state.current);
      document.documentElement.setAttribute('data-theme', state.current);
    },
    setDevice: (state, action) => {
      state.device = action.payload;
    },
    setTheme: (state, action) => {
      if (themeList.includes(action.payload)) {
        state.current = action.payload;
        localStorage.setItem('theme', state.current);
        document.documentElement.setAttribute('data-theme', state.current);
      }
    }
  }
});

export const { cycleTheme, setDevice, setTheme } = ThemesReducer.actions;
export default ThemesReducer.reducer;