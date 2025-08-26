import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const isClient = typeof window !== 'undefined'
let store
if (isClient) {
  const { persistReducer } = require('redux-persist')

  const persistConfig = {
    key: 'client',
    storage,
    blacklist: ['general', 'page', 'user'],
  }

  store = createStore(persistReducer(persistConfig, rootReducer), applyMiddleware(thunk))
  store.__PERSISTOR = persistStore(store)
} else {
  store = createStore(rootReducer, applyMiddleware(thunk))
}

export default store
