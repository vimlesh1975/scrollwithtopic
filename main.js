//add gspa
const scriptgsap = document.createElement('script');
scriptgsap.src = './js/gsap.min.js';
scriptgsap.setAttribute('type', 'text/javascript');


const data2={Sport:['1 Sport1','2 Sport2','3 Sport3','4 Sport4','5 Sport5',], National:['1 National1','2 National2','3 National3','4 National4','5 National5',]}



let messages = data2[Object.keys(data2)[0]];
// let messages = [];
var _speed = 500;
var _gap = 50;
var _ltr = false;
const nickbMethod = () => {
  _onAir = false;
  _counter = 1;
  _stopatcounter = 0;

  // const _speed = 500;
  const _screen = 1920;
  // let messages = data1;

  function start() {
  updatestring('heading', Object.keys(data2)[0])
    _onAir = true;
    next();
  }
  window.start = start;

  function stop() {
    _onAir = false;
    // console.log(_counter);
    _stopatcounter = _counter;
  }
  window.stop = stop;


  function next() {
    // let it run to end if not on air
    if (!_onAir) return;

    _counter++;

    var originalGroup = document.getElementById('scroll');
    originalGroup
      .getElementsByTagName('text')[0]
      .getElementsByTagName('tspan')[0].textContent = '';
    const nextDiv = originalGroup.cloneNode(true);

    let nextMsg = messages.shift();
    messages.push(nextMsg);
    nextDiv.setAttribute('id', 'tc' + _counter);
    nextDiv
      .getElementsByTagName('text')[0]
      .getElementsByTagName('tspan')[0].textContent = nextMsg;

    document.getElementsByTagName('svg')[0].appendChild(nextDiv);
    let msgWidth = nextDiv.getBBox().width;
    nextDiv
      .getElementsByTagName('text')[0]
      .getElementsByTagName('tspan')[0]
      .setAttribute('x', _ltr ? -msgWidth : _screen);
    let timeline = gsap.timeline({ paused: true });
    timeline.to('#' + nextDiv.id, {
      duration: getDuration(msgWidth),
      x: _ltr ? _screen + msgWidth : -(_screen + msgWidth),
      ease: 'none',
    });
    timeline.play();
    timeline.eventCallback('onComplete', offScreen, [nextDiv.id]);
    timeline.call(next, [], getNextMsgTime(msgWidth));
  }

  function getDuration(width) {
    let size = _screen + width;
    return size / _speed;
  }

  function getNextMsgTime(width) {
    return (width + (_ltr ? 150 : _gap)) / _speed;
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

  // start();
};

scriptgsap.onload = function () {
  nickbMethod();
  start();
};
document.body.appendChild(scriptgsap);
