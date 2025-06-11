import { useState, useEffect } from 'react';
import DeviceDetector from 'device-detector-js';

type ResponsiveConfig = Record<string, number>;
type ResponsiveInfo = Record<string, boolean>;

let responsiveConfig: ResponsiveConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

let info: ResponsiveInfo = {};

export const configResponsive = (config: ResponsiveConfig) => {
  responsiveConfig = config;
};

const clac = () => {
  if (typeof window === 'undefined') {
    return {
      shouldUpdate: false,
      info,
    };
  }
  const width = window.innerWidth;
  const newInfo: ResponsiveInfo = {};
  let shouldUpdate = false;

  for (const key of Object.keys(responsiveConfig)) {
    newInfo[key] = width >= responsiveConfig[key];
    // 如果发生改变，则出发更新
    if (newInfo[key] !== info[key]) {
      shouldUpdate = true;
    }
  }
  if (shouldUpdate) {
    info = newInfo;
  }
  return {
    shouldUpdate,
    info,
  };
};

const useResponsive = () => {
  const deviceDetector = new DeviceDetector();
  const userAgent =
    typeof window === 'undefined' ? '' : window.navigator.userAgent;
  const device = deviceDetector.parse(userAgent);

  if (device.client?.type === 'browser') {
    clac();
  }
  const [state, setState] = useState<ResponsiveInfo>(() => clac().info);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const getSize = () => {
      const res = clac();
      if (res.shouldUpdate) {
        setState(res.info);
      }
    };
    window.addEventListener('resize', getSize);
    return () => {
      window.removeEventListener('resize', getSize);
    };
  }, []);
  return state;
};

export default useResponsive;
