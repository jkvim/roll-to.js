/*
 * roll-to
 * scroll library
 * @author jkvim
 * @license MIT
 * @version 0.0.1
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.RollTo = factory());
}(this, (function () { 'use strict';

const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAniamtionFrame || function (callback) {
  setTimeout(callback, 1000 / 60);
};

const easeFunctions = {
  easeOut(t, d) {
    return -1 * t * (t - 2);
  }
};

const defaultOption = {
  animate: 'easeOut',
  duration: 0.5
};

const RollTo = function (option = defaultOption) {
  let startime = null;
  let initPosition = null;
  let wrapper = null;

  const reset = () => {
    startime = null;
    initPosition = null;
  };

  const getWrapperHeight = wrapper => {
    return wrapper === document.body ? wrapper.clientHeight : wrapper.scrollHeight;
    
  };

  const getViewHeight = wrapper => {
    return wrapper === document.body ? window.innerHeight : wrapper.clientHeight;
  };

  function getNodeOffsetTop(el) {
    var y = el.offsetTop;
    var node = el.offsetParent;
    return y + node.offsetTop;
  }

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

  const scrollMixin = calcPosition => {
    return element => {
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
    };
  };

  const top = scrollMixin((element, timestamp) => {
    let offsetY = 0;
    let scrollY = wrapper.scrollTop;
    let atTop = offsetY === scrollY;
    return {
      stop: atTop,
      offsetY
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
      offsetY
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
    let isLast = offsetY + height === wrapperHeight;

    return {
      offsetY,
      stop: atTop || isLast && atBottom
    };
  });

  return {
    top,
    bottom,
    section
  };
};

return RollTo;

})));
