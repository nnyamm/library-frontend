/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { jsx } from '@emotion/core';
import EmptyBookList from '../../../components/EmptyBookList';
import ResponsivePaginator from '../../../components/ResponsivePaginator';

import Responsive from '../../base/Responsive';
import EditingBar from '../../../components/EditingBar';
import BookList from '../../../components/BookList';
import LibraryBook from '../../../components/LibraryBook/index';
import { BottomActionBar, BottomActionButton } from '../../../components/BottomActionBar';

import { getBooks, getUnit } from '../../../services/book/selectors';
import {
  clearSelectedBooks,
  deleteSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
  toggleSelectBook,
  unhideSelectedBooks,
} from '../../../services/purchased/hiddenUnit/actions';
import {
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getUnitId,
  getIsFetchingBook,
} from '../../../services/purchased/hiddenUnit/selectors';
import { getPageInfo as getHiddenPageInfo } from '../../../services/purchased/hidden/selectors';
import { URLMap } from '../../../constants/urls';

import { toFlatten } from '../../../utils/array';
import SkeletonUnitSection from '../../../components/Skeleton/SkeletonUnitSection';
import * as styles from './styles';
import TitleBar from '../../../components/TitleBar';

class HiddenUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing });
  };

  handleOnClickUnhide = () => {
    const { dispatchUnHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchUnHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDelete = () => {
    const { dispatchDeleteSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDeleteSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  renderLNB() {
    const { isEditing } = this.state;
    const {
      items,
      selectedBooks,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
      unit,
      totalCount,
      hiddenPageInfo: { currentPage: page },
    } = this.props;
    const selectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = selectedCount === items.length;
    return (
      <div css={styles.LNBWrapper}>
        <TitleBar
          title={unit.title}
          totalCount={totalCount.itemTotalCount}
          onClickEditingMode={this.toggleEditingMode}
          href={URLMap.hidden.href}
          as={URLMap.hidden.as}
          query={{ page }}
        />
        {isEditing && (
          <EditingBar
            totalSelectedCount={selectedCount}
            isSelectedAllBooks={isSelectedAllBooks}
            onClickSelectAllBooks={dispatchSelectAllBooks}
            onClickUnselectAllBooks={dispatchClearSelectedBooks}
            onClickSuccessButton={this.toggleEditingMode}
          />
        )}
      </div>
    );
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook } = this.props;

    if (items.length === 0) {
      return <EmptyBookList message="숨김 도서가 없습니다." />;
    }

    return (
      <BookList>
        {items.map(item => (
          <LibraryBook
            key={item.b_id}
            item={item}
            book={books[item.b_id]}
            isEditing={isEditing}
            checked={!!selectedBooks[item.b_id]}
            onChangeCheckbox={() => dispatchToggleSelectBook(item.b_id)}
          />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages, unitId },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={{ pathname: URLMap.hiddenUnit.href, query: { unitId } }}
        as={URLMap.hiddenUnit.as(unitId)}
      />
    );
  }

  renderBottomActionBar() {
    const { isEditing } = this.state;
    const { selectedBooks } = this.props;
    if (!isEditing) {
      return null;
    }

    const disable = Object.keys(selectedBooks).length === 0;
    return (
      <BottomActionBar>
        <BottomActionButton name="선택 영구 삭제" css={styles.MainButtonActionLeft} onClick={this.handleOnClickDelete} disable={disable} />
        <BottomActionButton name="선택 숨김 해제" css={styles.MainButtonActionRight} onClick={this.handleOnClickUnhide} disable={disable} />
      </BottomActionBar>
    );
  }

  render() {
    const { unit, isFetchingBook } = this.props;
    return (
      <>
        <Head>
          <title>{unit.title} - 내 서재</title>
        </Head>
        {this.renderLNB()}
        <main>
          <Responsive>{isFetchingBook ? <SkeletonUnitSection /> : this.renderBooks()}</Responsive>
        </main>
        {this.renderPaginator()}
        {this.renderBottomActionBar()}
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);

  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);

  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const totalCount = getTotalCount(state);
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBook = getIsFetchingBook(state);

  const hiddenPageInfo = getHiddenPageInfo(state);
  return {
    pageInfo,
    items,
    unit,
    books,
    totalCount,
    selectedBooks,
    isFetchingBook,

    hiddenPageInfo,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchUnhideSelectedBooks: unhideSelectedBooks,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HiddenUnit);
