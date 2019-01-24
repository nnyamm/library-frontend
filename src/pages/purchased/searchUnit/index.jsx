/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import SkeletonUnitDetailView from '../../../components/Skeleton/SkeletonUnitDetailView';
import UnitDetailView from '../../../components/UnitDetailView';
import { URLMap } from '../../../constants/urls';
import { getBookDescriptions, getBooks, getUnit } from '../../../services/book/selectors';
import { getSearchPageInfo } from '../../../services/purchased/search/selectors';
import {
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
  toggleSelectBook,
} from '../../../services/purchased/searchUnit/actions';
import {
  getIsFetchingBook,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
  getTotalCount,
  getUnitId,
  getPrimaryItem,
} from '../../../services/purchased/searchUnit/selectors';
import { toFlatten } from '../../../utils/array';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import Responsive from '../../base/Responsive';
import { UnitType } from '../../../constants/unitType';
import TitleBar from '../../../components/TitleBar';
import { UnitOrderOptions } from '../../../constants/orderOptions';
import SeriesView from '../../../components/SeriesView';

class searchUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(loadItems());
  }

  handleOnClickHide = () => {
    const { dispatchHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDownload = () => {
    const { dispatchDownloadSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  makeActionBarProps() {
    const { selectedBooks } = this.props;
    const disable = Object.keys(selectedBooks).length === 0;
    return {
      buttonsProps: [
        {
          name: '선택 숨기기',
          onClick: this.handleOnClickHide,
          disable,
        },
        {
          name: '선택 다운로드',
          onClick: this.handleOnClickDownload,
          disable,
        },
      ],
    };
  }

  renderTitleBar() {
    const {
      unit,
      totalCount,
      pageInfo: { keyword },
      searchPageInfo: { currentPage: page },
    } = this.props;

    const titleBarProps = {
      title: unit.title,
      showCount: !UnitType.isBook(unit.type),
      totalCount: totalCount.itemTotalCount,
      href: URLMap.search.href,
      as: URLMap.search.as,
      query: { keyword, page },
    };
    return <TitleBar {...titleBarProps} />;
  }

  renderDetailView() {
    const { unit, primaryItem, books, bookDescriptions } = this.props;
    if (!primaryItem) {
      return <SkeletonUnitDetailView />;
    }

    const primaryBook = books[primaryItem.b_id];
    const primaryBookDescription = bookDescriptions[primaryItem.b_id];
    if (!primaryBook || !primaryBookDescription) {
      return <SkeletonUnitDetailView />;
    }

    const downloadable = new Date(primaryItem.expire_date) > new Date();
    return (
      <UnitDetailView
        unit={unit}
        primaryItem={primaryItem}
        book={primaryBook}
        bookDescription={primaryBookDescription}
        downloadable={downloadable}
      />
    );
  }

  renderSeriesView() {
    const {
      unit,
      pageInfo: { order, orderType, orderBy, currentPage, totalPages, unitId },
      isFetchingBook,
      items,
      books,
      selectedBooks,
      dispatchToggleSelectBook,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;
    const orderOptions = UnitType.isSeries(unit.type) ? UnitOrderOptions.toSeriesList() : UnitOrderOptions.toShelfList();

    return (
      <SeriesView
        pageProps={{
          currentPage,
          totalPages,
          href: { pathname: URLMap.searchUnit.href, query: { unitId } },
          as: URLMap.searchUnit.as(unitId),
          query: { orderType, orderBy },
        }}
        actionBarProps={this.makeActionBarProps()}
        currentOrder={order}
        orderOptions={orderOptions}
        isFetching={isFetchingBook}
        items={items}
        books={books}
        selectedBooks={selectedBooks}
        onSelectedChange={dispatchToggleSelectBook}
        onClickSelectAllBooks={dispatchSelectAllBooks}
        onClickUnselectAllBooks={dispatchClearSelectedBooks}
      />
    );
  }

  render() {
    const { unit } = this.props;

    return (
      <>
        <Head>
          <title>{unit.title} - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {this.renderTitleBar()}
        <main>
          <Responsive>{this.renderDetailView()}</Responsive>
          {UnitType.isBook(unit.type) ? null : this.renderSeriesView()}
        </main>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);

  const unitId = getUnitId(state);
  const unit = getUnit(state, unitId);
  const primaryItem = getPrimaryItem(state);
  const items = getItemsByPage(state);

  const bookIds = toFlatten(items, 'b_id');
  if (primaryItem) {
    bookIds.push(primaryItem.b_id);
  }
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const bookDescriptions = getBookDescriptions(state, toFlatten(items, 'b_id'));

  const selectedBooks = getSelectedBooks(state);
  const totalCount = getTotalCount(state);

  const isFetchingBook = getIsFetchingBook(state);

  const searchPageInfo = getSearchPageInfo(state);
  return {
    pageInfo,
    items,
    unit,
    primaryItem,
    books,
    bookDescriptions,
    totalCount,
    selectedBooks,
    isFetchingBook,

    searchPageInfo,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(searchUnit);
