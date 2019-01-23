/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import shortid from 'shortid';

import { TabBar as LNBTabBar, TabLinkItem } from '../../../components/TabBar';
import Responsive from '../Responsive';

import { URLMap } from '../../../constants/urls';

export const TabMenuTypes = {
  ALL_BOOKS: 'ALL BOOKS',
  FAVORITE: 'FAVORITE',
  SHELF_LIST: 'SHELF_LIST',
};

const styles = {
  LNBTabBarWrapper: css({
    height: 40,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #d1d5d9',
  }),
};

const TabMenus = [
  {
    type: TabMenuTypes.ALL_BOOKS,
    name: '모든 책',
    linkInfo: {
      href: URLMap.main.href,
      as: URLMap.main.as,
    },
  },
  {
    type: TabMenuTypes.FAVORITE,
    name: '선호 작품',
    linkInfo: {
      href: URLMap.main.href,
      as: URLMap.main.as,
    },
  },
  {
    type: TabMenuTypes.SHELF_LIST,
    name: '책장 목록',
    linkInfo: {
      href: URLMap.main.href,
      as: URLMap.main.as,
    },
  },
];

export const TabBar = ({ activeMenu }) => (
  <Responsive css={styles.LNBTabBarWrapper}>
    <LNBTabBar>
      {TabMenus.map(menu => (
        <TabLinkItem key={shortid.generate()} name={menu.name} isActive={activeMenu === menu.type} {...menu.linkInfo} />
      ))}
    </LNBTabBar>
  </Responsive>
);
