import React from 'react';
import { useSelector } from 'react-redux';

import { ITEMS_LIMIT_PER_SHELF } from 'constants/shelves';
import * as shelfSelectors from 'services/shelf/selectors';
import CheckCircle from 'svgs/CheckCircle.svg';

import * as styles from './sytles';

const SimpleShelf = ({ shelfId, isSelect, handleShelfSelectChange }) => {
  const shelfName = useSelector(state => shelfSelectors.getShelfName(state, shelfId));
  const shelfBookCount = useSelector(state => shelfSelectors.getShelfBookCount(state, shelfId));
  const disabled = shelfBookCount >= ITEMS_LIMIT_PER_SHELF;

  return (
    <div css={[styles.simpleShelf, disabled && styles.disabledShelf]}>
      <div css={styles.shelfCheckIconWrapper}>
        <label css={[styles.checkButton, disabled && styles.disabledCheckButton]}>
          <span css={[styles.checkIconBorder, isSelect && styles.checked]} />
          <CheckCircle css={styles.checkIcon} />
          <input
            type="radio"
            name="simpleShelves"
            css={styles.invisibleRadioInput}
            onChange={() => {
              handleShelfSelectChange(shelfId);
            }}
            disabled={disabled}
          />
        </label>
      </div>
      <div css={styles.shelfMetaWrapper}>
        <p css={styles.shelfName}>{shelfName}</p>
        <p css={styles.shelfBookCount}>{shelfBookCount > 0 ? shelfBookCount : ''}</p>
      </div>
    </div>
  );
};

export default SimpleShelf;
