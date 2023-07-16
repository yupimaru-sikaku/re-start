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
import userSlice from './user/slice';
import homeCareSlice from './home-care/slice';
import globalSlice from './global/slice';
import restartSlice from './restart/slice';
import { authApi } from './auth/query';
import { restartApi } from './restart/query';

const rootReducer = combineReducers({
  global: globalSlice.reducer,
  provider: providerSlice.reducer,
  user: userSlice.reducer,
  staff: staffSlice.reducer,
  accompany: accompanySlice.reducer,
  behavior: behaviorSlice.reducer,
  homeCare: homeCareSlice.reducer,
  mobility: mobilitySlice.reducer,
  schedule: scheduleSlice.reducer,
  restart: restartSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [accompanyApi.reducerPath]: accompanyApi.reducer,
  [behaviorApi.reducerPath]: behaviorApi.reducer,
  [homeCareApi.reducerPath]: homeCareApi.reducer,
  [mobilityApi.reducerPath]: mobilityApi.reducer,
  [scheduleApi.reducerPath]: scheduleApi.reducer,
  [restartApi.reducerPath]: restartApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
