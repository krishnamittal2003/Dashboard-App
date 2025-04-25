// redux/dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  try {
    const serialized = localStorage.getItem('dashboards');
    return serialized
      ? JSON.parse(serialized)
      : {
          'CSPM Executive Dashboard': [
            { id: 1, name: 'Widget A', text: 'Random Text A' },
            { id: 2, name: 'Widget B', text: 'Random Text B' },
          ],
          'CWPP Dashboard': [],
        };
  } catch {
    return {};
  }
};

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('dashboards', JSON.stringify(state.categories));
  } catch {}
};

const initialState = {
  categories: loadFromLocalStorage(),
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidget: (state, action) => {
      const { category, widget } = action.payload;
      if (!state.categories[category]) {
        state.categories[category] = [];
      }
      state.categories[category].push(widget);
      saveToLocalStorage(state);
    },
    removeWidget: (state, action) => {
      const { category, id } = action.payload;
      state.categories[category] = state.categories[category].filter((w) => w.id !== id);
      saveToLocalStorage(state);
    },
    addDashboard: (state, action) => {
      const name = action.payload;
      if (!state.categories[name]) {
        state.categories[name] = [];
        saveToLocalStorage(state);
      }
    },
  },
});

export const { addWidget, removeWidget, addDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
