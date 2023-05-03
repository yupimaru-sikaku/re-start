import { combineReducers } from '@reduxjs/toolkit';
import staffReducer from 'src/ducks/staff/slice';

const rootReducer = combineReducers({
  staff: staffReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
