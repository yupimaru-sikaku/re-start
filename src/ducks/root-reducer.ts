import { combineReducers } from '@reduxjs/toolkit';
import staffSlice from './staff/slice';
import providerSlice from './provider/slice';
import { providerApi } from './provider/query';
import { staffApi } from './staff/query';
import { userApi } from './user/query';
import { homeCareSupportApi } from './home-care-support/query';
import { behaviorApi } from './behavior/query';
import behaviorSupportSlice from './behavior/slice';

const rootReducer = combineReducers({
  provider: providerSlice.reducer,
  staff: staffSlice.reducer,
  behaviorSupport: behaviorSupportSlice.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [homeCareSupportApi.reducerPath]: homeCareSupportApi.reducer,
  [behaviorApi.reducerPath]: behaviorApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
