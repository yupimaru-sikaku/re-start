import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';
import {
  useSelector as rawUseSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { providerApi } from 'src/ducks/provider/query';
import { staffApi } from 'src/ducks/staff/query';
import rootReducer, { RootState } from './root-reducer';
import { userApi } from './user/query';
import { homeCareSupportApi } from './home-care-support/query';

export const store = configureStore({
  reducer: {
    [providerApi.reducerPath]: providerApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [homeCareSupportApi.reducerPath]: homeCareSupportApi.reducer,
    ...rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      providerApi.middleware,
      staffApi.middleware,
      userApi.middleware,
      homeCareSupportApi.middleware
    ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
