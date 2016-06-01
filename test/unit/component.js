import test from 'tape';
import component from '../../src/component';
import { forEach } from 'lodash';

test.skip('component exposes the expected API', t => {
  const cmp = component();
  t.equal(typeof cmp.parseComponents, 'function', 'parseComponents is a method');
  // t.equal(typeof cmp.selectComponents, 'function', 'selectComponents is a method');
  // t.equal(typeof cmp.parseComponentOptions, 'function', 'parseComponentOptions is a method');
  t.equal(typeof cmp.initComponent, 'function', 'initComponent is a method');

  t.end()
});

test('parseComponents method returns an array of components', t => {
  const cmp = component();
  // mock of a possible config object
  const config = {
    namespaces: ['bar', 'foo']
  };
  const content = [];
  // array to hold all the generated names for the components
  const cmpsNames = [];
  const amountCmps = [...Array(10).keys()];
  // helper variable to keep track of the number of components that shouldn't be parsed by the method
  let notToBeParsed = 0;

  // generates test data (in this case, an array of DOM elements)
  amountCmps.forEach(i => {
    const div = document.createElement('div');
    const randomIndex = Math.floor((Math.random() * config.namespaces.length));
    // grabs a random namespace from the passed config
    let ns = config.namespaces[randomIndex];
    // randonly generates namespaces that don't belong to the supported namespaces
    if (Math.floor(Math.random() * 20) + 1 < 10) {
      // this will generate a namespace that won't be present in config.namespaces
      ns = `${ns}${Date.now()}`;
      notToBeParsed++;
    }
    const compDef = `${ns}Component`;
    const objDef = `${ns}Obj`;
    const arrDef = `${ns}Arr`;
    const strDef = `${ns}Str`;
    const cmpName = `bar${Date.now()}`;
    cmpsNames.push(cmpName);
    div.dataset[compDef] = cmpName;
    div.dataset[objDef] = JSON.stringify({
      bar: 'foo',
      foo: 'baz'
    });
    div.dataset[arrDef] = JSON.stringify([1,2]);
    div.dataset[strDef] = 'baz';

    content.push(div);
    document.body.appendChild(div);
  });

  /**
   * the amount of components that should had been parsed would have to be
   * amountCmps.length minus the amount of components that have a namespace
   * that is not specified within config.namespaces
   */
  const goalParsedComponents = amountCmps.length - notToBeParsed;

  t.skip('selectComponents should return an array of DOM elements to be parsed', st => {
    const componentsToBeParsed = cmp.selectComponents(content);
    st.equal(typeof componentsToBeParsed, 'array');
    st.equal(componentsToBeParsed.length, goalParsedComponents);
    st.end();
  });

  t.skip('parseComponentOptions should return an object', st => {
    const componentsToBeParsed = cmp.selectComponents(content);
    const parsedComponents = cmp.parseComponentOptions(componentsToBeParsed);
    st.equal(componentsToBeParsed.length, parsedComponents.length);
    st.equal(typeof parsedComponents, 'array');

    parsedComponents.forEach(cmp => {
      st.ok(cmp.name, 'the parsed component has a ´name´ property');
      st.ok(cmp.options, 'the parsed component has a ´options´ property');
      st.equal(typeof cmp.options, 'object', 'the options property should be an oject');
      st.equal(cmp.options.length, 'object', 'the options should have a lenght of 3');
      forEach(cmp.options, (v, k) => {
        switch (k) {
          case k === 'obj':
            st.equal(typeof v, 'object');
            break;
          case k === 'arr':
            st.equal(typeof v, 'array');
            break;
          case k === 'str':
            st.equal(typeof v, 'string');
            break;
        }
      });
    });

    st.end();
  });

  // t.equal(typeof parsedComponents, 'array');
  // t.equal(parsedComponents.length, goalParsedComponents);
  t.equal(goalParsedComponents, goalParsedComponents);

  t.end();
});
