/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { ButtonType } from './constants';

export const ActionButton = ({ name, onClick, type = ButtonType.NORMAL, disable = false, className = '' }) => (
  <button
    type="button"
    css={[styles.actionButton(disable), styles.actionButtonType(type)]}
    className={className}
    onClick={onClick}
    disabled={disable}
  >
    {name}
  </button>
);