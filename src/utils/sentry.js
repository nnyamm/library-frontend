import { init, captureMessage, captureException, captureEvent, configureScope } from '@sentry/browser';
import config from '../config';

export const initializeSentry = () => {
  init({
    dsn: config.SENTRY_DSN,
  });
};

const configure = () => {
  configureScope(scope => {
    // TODO: 필요한 ExtraData, Tag, User 셋팅
    // scope.setExtra('battery', 0.7);
    // scope.setTag('user_mode', 'admin');
    // scope.setUser({ id: '4711' });
  });
};

export default {
  configure,
  captureMessage,
  captureException,
  captureEvent,
};