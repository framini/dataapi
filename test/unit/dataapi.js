import test from 'tape';
import sinon from 'sinon';
import dataapi from '../../src/dataapi';

test('dataapi exposes the expected API', t => {
  const d = dataapi({
    factories: new Map(),
  });
  t.equal(typeof d.start, 'function', 'start is a method');
  t.equal(typeof d.stop, 'function', 'stop is a method');
  t.equal(typeof d.getInitializedComponents, 'function', 'getInitializedComponents is a method');
  t.end();
});

test('all dataapi API method return a Promise', t => {
  const d = dataapi({
    factories: new Map(),
  });

  t.equal(typeof d.start(), 'object', 'start return a Promise');
  t.equal(typeof d.start().then, 'function');
  t.equal(typeof d.stop(), 'object', 'stop return a Promise');
  t.equal(typeof d.stop().then, 'function');
  t.equal(typeof d.getInitializedComponents(), 'object',
  'getInitializedComponents return a Promise');
  t.equal(typeof d.getInitializedComponents().then, 'function');
  t.end();
});

test('API return values', t => {
  // since every call will return a new object, we'll have to mock
  // them this way in order to spy on their methods
  const ret1 = { init: sinon.stub(), stop: sinon.stub() };
  const ret2 = { init: sinon.stub() };
  // Factories (i.e modules definition)
  const Bar = () => ret1;
  const Foo = () => ret2;
  // Test DOM elements
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  const div3 = document.createElement('div');
  const div4 = document.createElement('div');
  const div5 = document.createElement('div');
  const div6 = document.createElement('div');
  // Goal of components to be initialized
  const goalInitializedComponents = 4;
  // Goal of components to be skipped (because they dont have a Factory associated)
  const goalSkippedComponents = 2;
  // Factories (these modules ideally will be imported in the module calling this one)
  const factories = new Map([['Bar', Bar], ['Foo', Foo]]);
  // options obj
  const opt1 = new Map([['foo', 'bar'], ['baz', 'buz']]);
  const opt2 = new Map([['foo2', 'bar 2'], ['baz2', 'buz 2']]);
  const opt3 = new Map([['foo3', 'bar 333']]);
  const opt4 = new Map([['baz3', 'buz 4']]);
  const opt5 = new Map([['fooooo', 'bar ooooo']]);
  const opt6 = new Map([['fooxx', 'bar xxxx']]);
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
  const param6 = {
    name: 'Baznot',
    el: div6,
    options: opt6,
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
    [
      div6,
      param6,
    ],
  ]);

  const d = dataapi({
    factories,
    components,
  });

  t.test('return value of the start method', st => {
    d.start().then((initializedComponents) => {
      st.equal(initializedComponents.size, goalInitializedComponents);
      st.end();
    });
  });

  t.test('return value of the getSkippedComponents method', st => {
    d.getSkippedComponents().then((skippedComponents) => {
      st.equal(skippedComponents.size, goalSkippedComponents);
      st.end();
    });
  });

  t.test('return value of the getInitializedComponents method', st => {
    d.getInitializedComponents().then((initializedComponents) => {
      st.equal(initializedComponents.size, goalInitializedComponents);
      st.end();
    });
  });

  t.test('return value of the stop method', st => {
    d.stop().then((status) => {
      st.ok(status);
      st.end();
    });
  });

  t.test(`return value of the getInitializedComponents method after calling the
    .stop method`, st => {
    d.getInitializedComponents().then((initializedComponents) => {
      st.equal(initializedComponents.size, 0);
      st.end();
    });
  });
});
