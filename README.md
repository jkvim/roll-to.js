# roll-to.js
> An tiny scroll library, inspired by [sweet-scroll](https://github.com/tsuyoshiwada/sweet-scroll), sweet scroll is awesome.

[![Build Status](https://travis-ci.org/jkvim/roll-to.js.svg?branch=master)](https://travis-ci.org/jkvim/roll-to.js)
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[npm-url]: https://npmjs.org/package/roll-to
[downloads-image]: http://img.shields.io/npm/dm/roll-to.svg
[npm-image]: http://img.shields.io/npm/v/roll-to.svg


## Example
[example](https://jkvim.github.io/roll-to.js/) This example have adapt for mobile view, 
you can try it on chrome devtool and switch to mobile dev model

## Install
    npm install roll-to

## API
### `RollTo(option)`
#### `option`
- **animate:**  {String} transition animation, you can select of [Animate](#animate)
- **duration:** {Number} transition duration, use millisecond as unit

#### `return`    {Object} an instance to do scroll operation

### `rollTo.top(element)`
**element:** anyone element inside scroll wrapper

### `rollTo.bottom(element)`
**element:** anyone element inside scroll wrapper

### `rollTo.section(element)`
**element:** the element you want to scroll to top

### Animate
- linear
- easeOut
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint

## Usage

```html
<body>
  <header>
    <ul>
      <li><a class="nav-one" href="#one">One</a></li>
      <li><a class="nav-two" href="#two">Two</a></li>
      <li><a class="nav-three" href="#three">Three</a></li>
      <li><a class="nav-four" href="#four">Four</a></li>
   </ul>
  </header>
 <main>
   <section class="item-one"></section>
   <section class="item-two"></section>
   <section class="item-three"></section>
   <section class="item-four"></section>
  </main>
  <script>
    const rollTo = new RollTo();
    var buttons = document.querySelectorAll('li');
    var sections = document.querySelectorAll('section');

    for (let i = 0; i < buttons.length; ++i) {
      buttons[i].onclick = function(event) {
        var className = event.target.className;
        var index = className.slice(4);
        for (let j = 0; j < sections.length; j++) {
          if (sections[j].className.indexOf(index) > 0) {
              rollTo.section(sections[j]);
            break;
          }
        }
      }
    }
  </script>
</body>
```

