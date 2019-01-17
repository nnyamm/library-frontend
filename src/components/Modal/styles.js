export const modal = isActive => {
  const active = isActive
    ? {
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
        pointerEvents: 'auto',
      }
    : {};
  return {
    display: 'block',
    position: 'absolute',
    width: 200,
    maxHeight: 235,
    right: 8,
    top: -6,
    zIndex: 9999,
    background: 'rgba(255, 255, 255, .98)',
    borderRadius: 4,
    boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.05)',
    opacity: 0,
    transform: 'translate3d(0, 20px, 0)',
    transition: 'opacity .3s, transform .3s',
    pointerEvents: 'none',
    overflowX: 'hidden',
    overflowY: 'auto',
    ...active,
  };
};

export const itemGroup = {
  padding: '4px 0',
  borderTop: `1px solid #e6e8eb`,
  '&:first-of-type': {
    borderTop: 0,
  },
};

export const groupTitle = {
  width: '100%',
  boxSizing: 'border-box',
  lineHeight: '16px',
  fontSize: 13,
  color: '#808991',
  padding: '16px 14px 2px 14px',
};

export const item = {
  display: 'block',
  position: 'relative',
  minWidth: 200,
  boxSizing: 'border-box',
  padding: '11px 11px 10px 42px',
  fontSize: 15,
  color: '#40474d',
  textAlign: 'left',
};

export const icon = {
  position: 'absolute',
  width: 18,
  height: 18,
  left: 14,
  top: '50%',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#9ea7ad',
};

export const modalBackground = isActive => {
  const active = isActive ? { pointerEvents: 'initial', zIndex: 9000 } : {};

  return {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: -9999,
    ...active,
  };
};

export const transparentCloseButtonContainer = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

export const transparentCloseButton = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
};