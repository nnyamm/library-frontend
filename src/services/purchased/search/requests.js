import { put } from 'redux-saga/effects';

import config from '../../../config';

import { calcOffset } from '../../../utils/pagination';
import { makeURI } from '../../../utils/uri';

import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';

export function* fetchSearchItems(keyword, page) {
  const options = {
    keyword,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/search/', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchSearchItemsTotalCount(keyword) {
  const options = {
    keyword,
  };

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/search/count/', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}
