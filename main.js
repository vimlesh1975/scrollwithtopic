//add gspa
const scriptgsap = document.createElement('script');
scriptgsap.src = './js/gsap.min.js';
scriptgsap.setAttribute('type', 'text/javascript');

let data2 = {
  'Sport': ['1 Sport1', '2 Sport2', '3 Sport3', '4 Sport4', '5 Sport5',],
  'National': ['1 National1', '2 National2', '3 National3', '4 National4', '5 National5',],
  'Regional': ['1 Regional1', '2 Regional2', '3 Regional3', '4 Regional4', '5 Regional5',],
}

let categories;
let currentCategoryIndex;
let messages;
// let messages = [];
var _speed = 500;
var _gap = 50;
var _ltr = false;
const nickbMethod = () => {
  _onAir = false;
  _counter = 1;
  _stopatcounter = 0;

  const _screen = 1920;
  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  const updatedata=()=>{
    categories = Object.keys(data2);
    currentCategoryIndex = 0;


    
  }
  function start() {
    updatedata()
    messages = [...data2[categories[currentCategoryIndex]]];
    updatestring('heading', Object.keys(data2)[currentCategoryIndex])
    gsap.set(document.getElementById('heading'), { x: -510 });
    let timeline2 = gsap.timeline({ paused: true });
    timeline2.to('#heading', {
      duration: 0.3,
      x: 160,
      ease: 'none',
    });
    timeline2.play();

    gsap.set(document.getElementById('scroll_strip'), { x: -2100 });
    let timeline3 = gsap.timeline({ paused: true });
    timeline2.to('#scroll_strip', {
      duration: 0.5,
      x: 400,
      ease: 'none',
    });
    timeline3.play();

    _onAir = true;
    next();
  }
  function stop() {
    _onAir = false;
    _stopatcounter = _counter;
  }
  window.start = start;
  window.updatedata = updatedata;
  window.stop = stop;
  function next() {
    if (!_onAir) return;
    _counter++;
    var originalGroup = document.getElementById('scroll');
    originalGroup
      .getElementsByTagName('text')[0]
      .getElementsByTagName('tspan')[0].textContent = '';
    const nextDiv = originalGroup.cloneNode(true);

    let nextMsg = messages.shift();
    // messages.push(nextMsg);
    nextDiv.setAttribute('id', 'tc' + _counter);
    nextDiv
      .getElementsByTagName('text')[0]
      .getElementsByTagName('tspan')[0].textContent = nextMsg;

    var svg = document.getElementsByTagName('svg')[0];
    var referenceNode = svg.children[2];

    insertAfter(nextDiv, referenceNode);

    let msgWidth = nextDiv.getBBox().width;
    nextDiv
      .getElementsByTagName('text')[0]
      .getElementsByTagName('tspan')[0]
      .setAttribute('x', 0);
      gsap.set(nextDiv, {  x: _ltr ? -(msgWidth):_screen });

    let timeline = gsap.timeline({ paused: true });
    timeline.to( nextDiv, {
      duration: getDuration(msgWidth),
      x: _ltr ? _screen : -(msgWidth),
      ease: 'none',
    });

    timeline.play();
    timeline.eventCallback('onComplete', () => {
      offScreen(nextDiv.id);
    });

    if (messages.length === 0) {
      timeline.call(() => {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        messages = [...data2[categories[currentCategoryIndex]]];
        updatestring('heading', categories[currentCategoryIndex]);
        gsap.set(document.getElementById('heading'), { x: -510 });
        let timeline2 = gsap.timeline({ paused: true });
        timeline2.to('#heading', {
          duration: 0.2,
          x: 160,
          ease: 'none',
        });
        timeline2.play();

        next();
      }, [], getNextMsgTime(msgWidth + _screen));
    }
    else {
      timeline.call(next, [], getNextMsgTime(msgWidth));
    }
  }

  function getDuration(width) {
    let size = _screen + width;
    return size / _speed;
  }

  function getNextMsgTime(width) {
    if (width > 1920) {
      return (width + (_ltr ? 150 : 0)) / _speed;
    }
    else {
      return (width + (_ltr ? 150 : _gap)) / _speed;
    }
  }

  function offScreen(id) {
    // console.log('Removing div ' + id);
    let ticker = document.getElementsByTagName('svg')[0];
    let tickerMsg = document.getElementById(id);
    ticker.removeChild(tickerMsg);
    if (_onAir === false && id === 'tc' + _stopatcounter)
      document
        .getElementsByTagName('svg')[0]
        .removeChild(document.getElementById('scroll_strip'));
  }

};

scriptgsap.onload = function () {
  nickbMethod();
  start();
};
document.body.appendChild(scriptgsap);
