export const isPhone = () => document.documentElement.classList.contains('phone');
export const isTablet = () => document.documentElement.classList.contains('tablet');
export const isDesktop = () => !isPhone();

export const isWebPSupported = () => {
  const element = document.createElement('canvas');
  if (element?.getContext('2d')) {
    return element.toDataURL('image/webp').startsWith('data:image/webp');
  }
  return false;
};
