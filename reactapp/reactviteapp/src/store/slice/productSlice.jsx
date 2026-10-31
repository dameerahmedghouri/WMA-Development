import {createSlice} from '@reduxjs/toolkit'

const initialState = createSlice({
  name: 'product',
  initialState: {
    products: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchProductsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },
    fetchProductsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {fetchProductsStart, fetchProductsSuccess, fetchProductsFailure} = initialState.actions;

export default initialState.reducer;