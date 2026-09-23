// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Assuming rootReducer is combined from other slices
const store = configureStore({
  reducer: rootReducer, // rootReducer or individual slices can be provided here
  // Optionally add other middleware, devTools config, etc.

});

export default store;