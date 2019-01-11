/** @jsx jsx */
import { jsx } from '@emotion/core';
import { bookWrapperStyle } from '../styles/bookLayout';

const BookWrapper = ({ children }) => <div css={bookWrapperStyle}>{children}</div>;
export default BookWrapper;
