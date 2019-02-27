import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import createApiMiddleware from '../api/middleware';
import rootReducer from './reducers';
import rootSaga from './sagas';
import bootstrap from './bootstrap';

const makeComposeEnhancer = isServer => {
  let composeEnhancer = compose;
  if (!isServer) {
    composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  return composeEnhancer;
};

const makeStore = (initialState, context) => {
  const composeEnhancer = makeComposeEnhancer(context.isServer);

  const apiMiddleware = createApiMiddleware(context);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [apiMiddleware, sagaMiddleware];

  const store = createStore(rootReducer, initialState, composeEnhancer(applyMiddleware(...middlewares)));

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  };
  store.runSagaTask();

  return store;
};

const injectStore = withRedux((initialState = {}, context) => {
  const preloadState = bootstrap.beforeCreatingStore(initialState, context);
  const store = makeStore(preloadState, context);
  bootstrap.afterCreatingStore(store, context);
  return store;
});
export default injectStore;
