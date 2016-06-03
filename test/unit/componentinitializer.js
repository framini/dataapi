import test from 'tape';
import sinon from 'sinon';
import componentInitializer from '../../src/componentinitializer';

test('componentInitializer exposes the expected API', t => {
  const cmp = componentInitializer();
  t.equal(typeof cmp.getInitializedComponents, 'function', 'getInitializedComponents is a method');
  t.end();
});

test.skip('componentInitializer exposes the expected API', t => {
  // since every call will return a new object, we'll have to mock
  // them this way in order to spy on their methods
  const ret1 = { init: sinon.stub() };
  const ret2 = { init: sinon.stub() };
  const ret3 = { init: sinon.stub() };
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

  const initComps = componentInitializer({
    factories,
    components,
  });

  t.equal(typeof componentInitializer, 'function', 'componentInitializer is a function');
  // checks that the returned value is a Map
  t.equal(typeof initComps, 'object', 'componentInitializer returns a map');
  t.equal(typeof initComps.add, 'function');
  t.equal(typeof initComps.has, 'function');
  t.equal(initComps.size, goalInitializedComponents);
  // we'll check that wathever is returned from componentInitializer call
  // it is what we are expecting
  t.ok(ret1.init.calledTwice, 'Bar factory was called 2 times');
  t.ok(ret1.init.onFirstCall().calledWith(param1));
  t.ok(ret1.init.onSecondCall().calledWith(param2));
  t.ok(ret2.init.calledTwice, 'Foo factory was called 2 times');
  t.ok(ret2.init.onFirstCall().calledWith(param3));
  t.ok(ret2.init.onSecondCall().calledWith(param4));
  t.ok(ret3.init.calledOnce, 'Baz factory was called 1 time');
  t.ok(ret3.init.onFirstCall().calledWith(param5));
  t.end();
});
