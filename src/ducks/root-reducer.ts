import { combineReducers } from '@reduxjs/toolkit';
import staffSlice from './staff/slice';
import providerSlice from './provider/slice';
import { providerApi } from './provider/query';
import { staffApi } from './staff/query';
import { userApi } from './user/query';
import { homeCareSupportApi } from './home-care-support/query';

const rootReducer = combineReducers({
  staff: staffSlice.reducer,
  provider: providerSlice.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [homeCareSupportApi.reducerPath]: homeCareSupportApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
