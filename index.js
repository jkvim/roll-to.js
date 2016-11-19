(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.RollTo = factory());
}(this, (function () { 'use strict';

const raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAniamtionFrame ||
  function (callback) {
    setTimeout(callback, 1000 / 60);
  };

// copy from https://gist.github.com/gre/1650294
const easeFunctions = {
  easeOut(t) {
    return -1 * t * (t - 2);
  },
  // no easing, no acceleration
  linear(t) {
    return t
  },
  // accelerating from zero velocity
  easeInQuad(t) {
    return t * t
  },
  // decelerating to zero velocity
  easeOutQuad(t) {
    return t * (2 - t)
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },
  // accelerating from zero velocity 
  easeInCubic(t) {
    return t * t * t
  },
  // decelerating to zero velocity 
  easeOutCubic(t) {
    return (--t) * t * t + 1
  },
  // acceleration until halfway, then deceleration 
  easeInOutCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },
  // accelerating from zero velocity 
  easeInQuart(t) {
    return t * t * t * t
  },
  // decelerating to zero velocity 
  easeOutQuart(t) {
    return 1 - (--t) * t * t * t
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  },
  // accelerating from zero velocity
  easeInQuint(t) {
    return t * t * t * t * t
  },
  // decelerating to zero velocity
  easeOutQuint(t) {
    return 1 + (--t) * t * t * t * t
  },
  // acceleration until halfway, then deceleration 
  easeInOutQuint(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  }
};

const defaultOption = {
  animate: 'easeOut',
  duration: 1,
};

const checkOption = (option) => {
  for (let key in defaultOption) {
    if (!(key in option)) {
      option[key] = defaultOption[key];
    }
  }
  if (!easeFunctions[option.animate]) {
    option.animate = defaultOption.animate;
  }
  if (option.duration <= 0) {
    option.duration = defaultOption.duration;
  }
};

const RollTo = function (option = defaultOption) {
  let startime = null;
  let initPosition = null;
  let wrapper = null;

  checkOption(option);

  const reset = () => {
    startime = null;
    initPosition = null;
  };

  const getWrapperHeight = (wrapper) => {
    return wrapper.scrollHeight;
  };

  const getViewHeight = (wrapper) => {
    return wrapper === document.body ?
      window.innerHeight :
      wrapper.clientHeight;
  };


  const getNodeOffsetTop = (el) => {
    var y = el.offsetTop;
    var node = el.offsetParent;
    return y + node.offsetTop;
  };

  const doScroll = (option, timestamp, offsetY) => {
    if (!initPosition) {
      initPosition = wrapper.scrollTop;
    }

    if (!startime) startime = timestamp;
    let progress = (timestamp - startime) / 1000;

    let ease = easeFunctions[option.animate];
    let duration = option.duration;
    let distance = offsetY - initPosition;
    let t = Math.min(1, Math.max(progress / duration, 0));
    let v = ease(t, duration);

    wrapper.scrollTop = initPosition + distance * v;
  };

  const scrollMixin = (calcPosition) => {
    return (element) => {
      function scroll(element, timestamp) {
        if (!element) {
          throw Error('required element as argument');
        }
        if (!wrapper) {
          wrapper = element.offsetParent;
        }

        let props = calcPosition(element, wrapper);
        let { stop, offsetY } = props;
        if (stop) {
          reset();
          return false;
        }
        doScroll(option, timestamp, offsetY);
        raf(scroll.bind(null, element));
      }
      raf(scroll.bind(null, element));
    }
  };

  const top = scrollMixin((element, timestamp) => {
    let offsetY = 0;
    let scrollY = wrapper.scrollTop;
    let atTop = offsetY === scrollY;
    return {
      stop: atTop,
      offsetY,
    };
  });

  const bottom = scrollMixin((element, wrapper) => {
    let scrollY = wrapper.scrollTop;
    let height = element.offsetHeight;
    let viewHeight = getViewHeight(wrapper);
    let wrapperHeight = getWrapperHeight(wrapper);
    let offsetY = wrapperHeight - viewHeight;
    let atBottom = wrapperHeight - viewHeight === scrollY;

    return {
      stop: atBottom,
      offsetY,
    };
  });

  const section = scrollMixin((element, wrapper) => {
    // offsetY represent element offsetTop to wrapper top 
    let offsetY = getNodeOffsetTop(element);
    // scrollY represent wrapper scroll offset
    let scrollY = wrapper.scrollTop;
    let height = element.offsetHeight;
    let wrapperHeight = getWrapperHeight(wrapper);
    let viewHeight = getViewHeight(wrapper);

    // when element reach top, offsetY must equal to scrollY

    let atBottom = wrapperHeight - viewHeight === scrollY;
    let atTop = offsetY === scrollY;
    let insideView = offsetY > scrollY && (offsetY - scrollY) < viewHeight;

    return {
      offsetY,
      stop: atTop || (insideView && atBottom)
    };
  });

  return {
    top,
    bottom,
    section,
  };
};

return RollTo;

})));
