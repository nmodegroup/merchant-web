let cache = null;
export function getSafeArea() {
  return new Promise((resolve, reject) => {
    if (cache != null) {
      resolve(cache);
    } else {
      wx.getSystemInfo({
        success: ({ model, screenHeight, statusBarHeight }) => {
          const iphoneX = /iphone x/i.test(model);
          const iphoneNew = /iPhone11/i.test(model) && screenHeight === 812;
          cache = {
            isIPhoneX: iphoneX || iphoneNew,
            statusBarHeight
          };
          resolve(cache);
        },
        fail: reject
      });
    }
  });
}
