// src/slices/categorySlice.js

import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    selectedCategory: null
  },
  reducers: {
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload;
    }
  }
});

export const { selectCategory } = categorySlice.actions;

export default categorySlice.reducer;
