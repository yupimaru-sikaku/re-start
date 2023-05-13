import { combineReducers } from '@reduxjs/toolkit';
import staffSlice from './staff/slice';
import providerSlice from './provider/slice';
import { providerApi } from './provider/query';
import { staffApi } from './staff/query';
import { userApi } from './user/query';
import { behaviorApi } from './behavior/query';
import behaviorSlice from './behavior/slice';
import mobilitySlice from './mobility/slice';
import { mobilityApi } from './mobility/query';
import scheduleSlice from './schedule/slice';
import { scheduleApi } from './schedule/query';
import { homeCareApi } from './home-care/query';
import accompanySlice from './accompany/slice';
import { accompanyApi } from './accompany/query';

const rootReducer = combineReducers({
  provider: providerSlice.reducer,
  staff: staffSlice.reducer,
  behavior: behaviorSlice.reducer,
  mobility: mobilitySlice.reducer,
  schedule: scheduleSlice.reducer,
  accompany: accompanySlice.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [homeCareApi.reducerPath]: homeCareApi.reducer,
  [behaviorApi.reducerPath]: behaviorApi.reducer,
  [mobilityApi.reducerPath]: mobilityApi.reducer,
  [scheduleApi.reducerPath]: scheduleApi.reducer,
  [accompanyApi.reducerPath]: accompanyApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
