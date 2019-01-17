/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import BookList from '../../../components/BookList';
import EmptyBookList from '../../../components/EmptyBookList';
import LibraryBook from '../../../components/LibraryBook/index';
import SkeletonUnitDetailView from '../../../components/Skeleton/SkeletonUnitDetailView';
import UnitDetailView from '../../../components/UnitDetailView';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import { URLMap } from '../../../constants/urls';
import { getBookDescriptions, getBooks, getUnit } from '../../../services/book/selectors';
import { getPageInfo as getHiddenPageInfo } from '../../../services/purchased/hidden/selectors';
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
  getIsFetchingBook,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getUnitId,
} from '../../../services/purchased/hiddenUnit/selectors';
import { toFlatten } from '../../../utils/array';
import BottomActionBar from '../../base/BottomActionBar';
import { TitleAndEditingBar } from '../../base/LNB';
import Responsive from '../../base/Responsive';

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
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    const titleBarProps = {
      title: unit.title,
      totalCount: totalCount.itemTotalCount,
      toggleEditingMode: this.toggleEditingMode,
      href: URLMap.hidden.href,
      as: URLMap.hidden.as,
      query: { page },
    };
    const editingBarProps = {
      isEditing,
      totalSelectedCount,
      isSelectedAllBooks,
      onClickSelectAllBooks: dispatchSelectAllBooks,
      onClickUnselectAllBooks: dispatchClearSelectedBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };

    return <TitleAndEditingBar titleBarProps={titleBarProps} editingBarProps={editingBarProps} />;
  }

  renderDetailView() {
    const { unit, items, books, bookDescriptions } = this.props;
    const primaryItem = items[0];
    const primaryBookId = primaryItem.b_id;
    const primaryBook = books[primaryBookId];
    const primaryBookDescription = bookDescriptions[primaryBookId];

    return <UnitDetailView unit={unit} book={primaryBook} bookDescription={primaryBookDescription} downloadable={false} />;
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
    return (
      <BottomActionBar
        isEditing={isEditing}
        selectedBooks={selectedBooks}
        buttonsProps={[
          {
            name: '선택 영구 삭제',
            onClick: this.handleOnClickDelete,
          },
          {
            name: '선택 숨김 해제',
            onClick: this.handleOnClickUnhide,
          },
        ]}
      />
    );
  }

  render() {
    const { unit, items, isFetchingBook } = this.props;
    return (
      <>
        <Head>
          <title>{unit.title} - 내 서재</title>
        </Head>
        {this.renderLNB()}
        <main>
          <Responsive>
            {items.length === 0 && isFetchingBook ? (
              <SkeletonUnitDetailView />
            ) : (
              <>
                {this.renderDetailView()}
                {this.renderBooks()}
              </>
            )}
          </Responsive>
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
  const bookDescriptions = getBookDescriptions(state, toFlatten(items, 'b_id'));

  const totalCount = getTotalCount(state);
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBook = getIsFetchingBook(state);

  const hiddenPageInfo = getHiddenPageInfo(state);
  return {
    pageInfo,
    items,
    unit,
    books,
    bookDescriptions,
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