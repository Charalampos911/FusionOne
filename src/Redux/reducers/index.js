// reducers/index.js
import { combineReducers } from 'redux';


import ApiReducer from '../features/ApiReducer';
import ThemesReducer from '../features/ThemeReducer';
// Import other slices if you have them

const rootReducer = combineReducers({
  Api: ApiReducer,
  Themes:ThemesReducer
});

export default rootReducer;