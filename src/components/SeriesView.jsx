/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { UnitOrderOptions } from '../constants/orderOptions';
import ViewType from '../constants/viewType';
import { ResponsiveBooks } from '../pages/base/Responsive';
import { getLocationHref } from '../services/router/selectors';
import BookOutline from '../svgs/BookOutline.svg';
import { makeWebViewerURI } from '../utils/uri';
import { Books } from './Books';
import Editable from './Editable';
import EmptyBookList from './EmptyBookList';
import HorizontalRuler from './HorizontalRuler';
import ResponsivePaginator from './ResponsivePaginator';
import SeriesToolBar from './SeriesToolBar';
import SkeletonBooks from './Skeleton/SkeletonBooks';

class SeriesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
  };

  makeEditingBarProps() {
    const { items, selectedBooks, onClickSelectAllBooks, onClickUnselectAllBooks } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    return {
      totalSelectedCount,
      isSelectedAllBooks,
      onClickSelectAllBooks,
      onClickUnselectAllBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
  }

  wrapActionBarProps() {
    const { actionBarProps } = this.props;

    const _wrapOnClick = onClick => () => {
      onClick();
      this.setState({ isEditing: false });
    };

    return {
      buttonProps: actionBarProps.buttonProps.map(buttonProp => ({
        ...buttonProp,
        onClick: _wrapOnClick(buttonProp.onClick),
      })),
    };
  }

  renderSeriesToolBar() {
    const {
      currentOrder,
      orderOptions,
      pageProps: { href, as },
    } = this.props;

    let orderTitle = null;

    if (orderOptions && orderOptions[currentOrder]) {
      orderTitle = orderOptions[currentOrder].title;
    }

    return (
      <SeriesToolBar
        orderTitle={orderTitle}
        toggleEditingMode={this.toggleEditingMode}
        currentOrder={currentOrder}
        orderOptions={orderOptions}
        href={href}
        as={as}
      />
    );
  }

  getEmptyBookListMessage(defaultMessage) {
    const { currentOrder } = this.props;

    const { orderType, orderBy } = UnitOrderOptions.parse(currentOrder);
    if (UnitOrderOptions.equal({ orderType, orderBy }, UnitOrderOptions.EXPIRE_DATE)) {
      return '대여 중인 도서가 없습니다.';
    }
    if (UnitOrderOptions.equal({ orderType, orderBy }, UnitOrderOptions.EXPIRED_BOOKS_ONLY)) {
      return '만료된 도서가 없습니다.';
    }
    return defaultMessage;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const {
      items,
      books,
      selectedBooks,
      onSelectedChange,
      isFetching,
      linkWebviewer,
      emptyProps: { message = '구매/대여하신 책이 없습니다.' } = {},
      locationHref,
    } = this.props;

    // Data 가져오는 상태면서 캐싱된 items가 없으면 Skeleton 노출
    if (isFetching && items.length === 0) {
      return <SkeletonBooks viewType={ViewType.LANDSCAPE} />;
    }

    // Data 가져오는 상태가 아니면서 Items가 비어있으면 0
    if (!isFetching && items.length === 0) {
      return <EmptyBookList IconComponent={BookOutline} message={this.getEmptyBookListMessage(message)} />;
    }

    const linkBuilder = _linkWebviewer => (libraryBookData, platformBookData) => {
      if (_linkWebviewer && platformBookData.support.web_viewer) {
        return (
          <a href={makeWebViewerURI(platformBookData.id, locationHref)} target="_blank" rel="noopener noreferrer">
            웹뷰어로 보기
          </a>
        );
      }

      if (platformBookData) {
        return (
          <a href={makeWebViewerURI(platformBookData.id, locationHref)} target="_blank" rel="noopener noreferrer">
            웹뷰어로 보기
          </a>
        );
      }
    };

    return (
      <Books
        libraryBookDTO={items}
        platformBookDTO={books}
        selectedBooks={selectedBooks}
        isSelectMode={isEditing}
        viewType={ViewType.LANDSCAPE}
        onSelectedChange={onSelectedChange}
        linkBuilder={linkBuilder(linkWebviewer)}
      />
    );
  }

  renderPaginator() {
    const {
      pageProps: { currentPage, totalPages, href, as, query },
    } = this.props;
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} href={href} as={as} query={query} />;
  }

  render() {
    const { isEditing } = this.state;

    return (
      <>
        <HorizontalRuler color="#d1d5d9" />
        <Editable
          allowFixed
          isEditing={isEditing}
          nonEditBar={this.renderSeriesToolBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.wrapActionBarProps()}
        >
          <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>
          {this.renderPaginator()}
        </Editable>
      </>
    );
  }
}

const mapStateToProps = state => ({
  locationHref: getLocationHref(state),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeriesView);
