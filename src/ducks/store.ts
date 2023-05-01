import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';
import {
  useSelector as rawUseSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { providerApi } from 'src/ducks/provider/query';
import { staffApi } from 'src/ducks/staff/query';

export const store = configureStore({
  reducer: {
    [providerApi.reducerPath]: providerApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
  },
  // 使い方が不明
  // preloadedState: load(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(providerApi.middleware, staffApi.middleware),
});

// 追記は任意ですが、refetchOnFocus/refetchOnReconnectという機能を利用するためには下記が必要です
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
