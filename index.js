"use strict";

const raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAniamtionFrame ||
  function (callback) {
    setTimeout(callback, 1000 / 60)
  };

const easeFunctions = {
  easeOut(t, d) {
    return -1 * t * (t - 2);
  },
};

const defaultOption = {
  animate: 'easeOut',
  duration: 0.5,
}

module.exports = function (option = defaultOption) {
  let startime = null;
  let initPosition = null;
  let wrapper = null;

  const reset = () => {
    startime = null;
    initPosition = null;
  }

  const getWrapperHeight = (wrapper) => {
    return wrapper === document.body ?
      wrapper.clientHeight :
      wrapper.scrollHeight;
    ;
  }

  const getViewHeight = (wrapper) => {
    return wrapper === document.body ?
      window.innerHeight :
      wrapper.clientHeight;
  };

  const doScroll = (option, timestamp, offsetY) => {
    if (!initPosition) {
      initPosition = wrapper.scrollTop;
    }

    if (!startime) startime = timestamp;
    var progress = (timestamp - startime) / 1000;

    var ease = easeFunctions[option.animate];
    var duration = option.duration;
    var distance = offsetY - initPosition;
    var t = Math.min(1, Math.max(progress / duration, 0));
    var v = ease(t, duration);

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

        var props = calcPosition(element, wrapper);
        var { stop, offsetY } = props;
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
    var offsetY = 0;
    var scrollY = wrapper.scrollTop;
    var atTop = offsetY === scrollY;
    return {
      stop: atTop,
      offsetY,
    };
  });

  const bottom = scrollMixin((element, wrapper) => {
    var scrollY = wrapper.scrollTop;
    var height = element.offsetHeight;
    var viewHeight = getViewHeight(wrapper);
    var wrapperHeight = getWrapperHeight(wrapper);
    var offsetY = wrapperHeight - viewHeight;
    var atBottom = wrapperHeight - viewHeight === scrollY;

    return {
      stop: atBottom,
      offsetY,
    };
  });

  const section = scrollMixin((element, wrapper) => {
    // offsetY represent element offsetTop to wrapper top 
    var offsetY = getNodeOffsetTop(element);
    // scrollY represent wrapper scroll offset
    var scrollY = wrapper.scrollTop;
    var height = element.offsetHeight;
    var wrapperHeight = getWrapperHeight(wrapper);
    var viewHeight = getViewHeight(wrapper);

    // when element reach top, offsetY must equal to scrollY
    var atBottom = wrapperHeight - viewHeight === scrollY;
    var atTop = offsetY === scrollY;
    var isLast = offsetY + height === wrapperHeight;

    console.log(atTop, atBottom, isLast);
    return {
      offsetY,
      stop: atTop || (isLast && atBottom)
    };
  });

  return {
    top,
    bottom,
    section,
  };
};
