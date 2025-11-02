import {configureStore} from '@reduxjs/toolkit';
import {sessionApi} from './services/sessionApi';
import authReducer  from './slices/authSlice';
import {documentsApi} from "./services/documentsApi.ts";


export const store = configureStore({
    reducer: {
        [sessionApi.reducerPath] : sessionApi.reducer,
        [documentsApi.reducerPath] : documentsApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(sessionApi.middleware)
            .concat(documentsApi.middleware),

})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
