import test from 'tape';
import sinon from 'sinon';
import componentHandler from '../../src/componenthandler';

test('componentHandler exposes the expected API', t => {
  const cmp = componentHandler({
    factories: new Map(),
    components: new Map(),
  });
  t.equal(typeof cmp.getInitializedComponents, 'function', 'getInitializedComponents is a method');
  t.equal(typeof cmp.stopComponents, 'function', 'stopComponents is a method');
  t.end();
});

test('initializes all the passed components by calling their respective method', t => {
  // since every call will return a new object, we'll have to mock
  // them this way in order to spy on their methods
  const ret1 = { init: sinon.stub(), stop: sinon.stub() };
  const ret2 = { init: sinon.stub() };
  const ret3 = { init: sinon.stub(), stop: sinon.stub() };
  // Factories (i.e modules definition)
  const Bar = () => ret1;
  const Foo = () => ret2;
  const Baz = () => ret3;
  // Test DOM elements
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  const div3 = document.createElement('div');
  const div4 = document.createElement('div');
  const div5 = document.createElement('div');
  // Goal of components to be parsed (DOM elements defined above)
  const goalInitializedComponents = 5;
  // Factories (these modules ideally will be imported in the module calling this one)
  const factories = new Map([['Bar', Bar], ['Foo', Foo], ['Baz', Baz]]);
  // options obj
  const opt1 = new Map([['foo', 'bar'], ['baz', 'buz']]);
  const opt2 = new Map([['foo2', 'bar 2'], ['baz2', 'buz 2']]);
  const opt3 = new Map([['foo3', 'bar 333']]);
  const opt4 = new Map([['baz3', 'buz 4']]);
  const opt5 = new Map([['fooooo', 'bar ooooo']]);
  // params
  const param1 = {
    name: 'Bar',
    el: div1,
    options: opt1,
  };
  const param2 = {
    name: 'Bar',
    el: div2,
    options: opt2,
  };
  const param3 = {
    name: 'Foo',
    el: div3,
    options: opt3,
  };
  const param4 = {
    name: 'Foo',
    el: div4,
    options: opt4,
  };
  const param5 = {
    name: 'Baz',
    el: div5,
    options: opt5,
  };
  // this a mock for the value returned from componentParser
  const components = new Map([
    [
      div1,
      param1,
    ],
    [
      div2,
      param2,
    ],
    [
      div3,
      param3,
    ],
    [
      div4,
      param4,
    ],
    [
      div5,
      param5,
    ],
  ]);

  const compHandler = componentHandler({
    factories,
    components,
  });

  t.equal(typeof componentHandler, 'function', 'componentHandler is a function');
  t.throws(componentHandler, 'it should throw if the factories prop is missed');
  // checks that the returned value is a Map
  t.equal(typeof compHandler, 'object', 'componentHandler returns a map');
  t.equal(typeof compHandler.getInitializedComponents, 'function', 'getInitializedComponents');
  t.equal(typeof compHandler.getInitializedComponents(), 'object');
  t.equal(typeof compHandler.getInitializedComponents().has, 'function');
  t.equal(compHandler.getInitializedComponents().size, goalInitializedComponents, `
  number of initialized components should be ${goalInitializedComponents}`);
  // we'll check that wathever is returned from componentHandler call
  // it is what we are expecting
  t.ok(ret1.init.calledTwice, 'Bar factory was called 2 times');
  t.ok(ret1.init.calledWith(param1), 'Bar init called with param1 as a parameter');
  t.ok(ret1.init.calledWith(param2), 'Bar init called with param2 as a parameter');
  t.ok(ret2.init.calledTwice, 'Foo factory was called 2 times');
  t.ok(ret2.init.calledWith(param3), 'Foo init called with param3 as a parameter');
  t.ok(ret2.init.calledWith(param4), 'Foo init called with param4 as a parameter');
  t.ok(ret3.init.calledOnce, 'Baz factory was called 1 time');
  t.ok(ret3.init.calledWith(param5), 'Baz init called with param5 as a parameter');
  t.equal(compHandler.stopComponents().size, 0, `
  there should no components left in the Map of initialized components`);
  t.ok(ret1.stop.calledTwice,  'Bar stop method was called twice');
  t.ok(ret3.stop.calledOnce, 'Baz stop method was called once');
  t.end();
});
