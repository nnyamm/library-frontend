
import { put } from 'redux-saga/effects';
import { getAPI } from "../../api/actions";

import config from '../../config';


const _TTL_MINS = 10;
const _makeTTL = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + _TTL_MINS);
  return parseInt(now.getTime() / 1000, 10);
};

const _toMap = books => {
  const ttl = _makeTTL();
  return books.reduce((previous, current) => {
    return {
      ...previous,
      [current.id]: {
        ...current,
        ttl,
      },
    }
  }, {});
};

export function* fetchBookData (bookIds) {
  const api = yield put(getAPI());
  const response = yield api.get(`${config.PLATFORM_API_BASE_URL}/books?b_ids=${bookIds.join(',')}`);
  return _toMap(response.data);
}
