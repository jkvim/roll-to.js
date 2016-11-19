# roll-to.js
> An tiny scroll library, inspired by [sweet-scroll](https://github.com/tsuyoshiwada/sweet-scroll), sweet scroll is awesome.

[![Build Status](https://travis-ci.org/jkvim/roll-to.js.svg?branch=master)](https://travis-ci.org/jkvim/roll-to.js)
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[npm-url]: https://npmjs.org/package/roll-to
[downloads-image]: http://img.shields.io/npm/dm/roll-to.svg
[npm-image]: http://img.shields.io/npm/v/roll-to.svg


## Example
[example](https://jkvim.github.io/roll-to.js/)

## Install
    npm install roll-to

## API
### `RollTo(option)`
#### option
- **animate:**  {String} transition animation
- **duration:** {String} transition duration
- **return**    {Object} an instance to do scroll operation

### `rollTo.top(element)`
**element:** the element inside scroll wrapper

### `rollTo.bottom(element)`
**element:** the element inside scroll wrapper

### `rollTo.section(element)`
**element:** the element inside scroll wrapper

### animate
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
    <article class="item-one">
      <h1>One</h1>
    </article>
    <article class="item-two">
      <h1>Two</h1>
    </article>
    <article class="item-three">
      <h1>Three</h1>
    </article>
    <article class="item-four">
      <h1>Four</h1>
    </article>
  </main>
  <script>
    const rollTo = new RollTo();
    var buttons = document.querySelectorAll('li');
    var sections = document.querySelectorAll('article');

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

