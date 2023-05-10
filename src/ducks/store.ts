import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch as rawUseDispatch } from 'react-redux';
import {
  useSelector as rawUseSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { providerApi } from 'src/ducks/provider/query';
import { staffApi } from 'src/ducks/staff/query';
import rootReducer, { RootState } from './root-reducer';
import { userApi } from './user/query';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { behaviorApi } from './behavior/query';
import { mobilityApi } from './mobility/query';
import { scheduleApi } from './schedule/query';
import { accompanyApi } from './accompany/query';
import { homeCareApi } from './home-care/query';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'provider',
    'staff',
    'user',
    'homeCare',
    'behavior',
    'mobility',
    'schedule',
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist の非シリアライズ可能なアクションを無視
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }).concat(
      providerApi.middleware,
      staffApi.middleware,
      userApi.middleware,
      homeCareApi.middleware,
      behaviorApi.middleware,
      mobilityApi.middleware,
      scheduleApi.middleware,
      accompanyApi.middleware
    ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => rawUseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> =
  rawUseSelector;
export const persistor = persistStore(store);
