import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serialized = localStorage.getItem('dashboardState');
    return serialized ? JSON.parse(serialized) : undefined;
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem('dashboardState', serialized);
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  preloadedState: {
    dashboard: loadState() || undefined,
  },
});

// Subscribe to store updates
store.subscribe(() => {
  saveState(store.getState().dashboard);
});

export default store;
