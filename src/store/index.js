import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import authReducer from './slices/authSlice'
import jobReducer from './slices/jobSlice'
import candidateReducer from './slices/candidateSlice'
import interviewReducer from './slices/interviewSlice'
import userReducer from './slices/userSlice'
import themeReducer from './slices/themeSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  candidates: candidateReducer,
  interviews: interviewReducer,
  users: userReducer,
  theme: themeReducer,
})

const persistConfig = {
  key: 'recruitEdge-root',
  storage,
  whitelist: ['auth', 'theme'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
