import { combineReducers } from '@reduxjs/toolkit';
import staffSlice from './staff/slice';
import providerSlice from './provider/slice';
import { providerApi } from './provider/query';
import { staffApi } from './staff/query';
import { userApi } from './user/query';
import { HomeCareApi } from './home-care/query';
import { behaviorApi } from './behavior/query';
import behaviorSlice from './behavior/slice';
import MobilitySlice from './mobility/slice';
import { mobilityApi } from './mobility/query';

const rootReducer = combineReducers({
  provider: providerSlice.reducer,
  staff: staffSlice.reducer,
  behavior: behaviorSlice.reducer,
  mobility: MobilitySlice.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [HomeCareApi.reducerPath]: HomeCareApi.reducer,
  [behaviorApi.reducerPath]: behaviorApi.reducer,
  [mobilityApi.reducerPath]: mobilityApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
