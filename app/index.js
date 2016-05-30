import component from './component';
import React from 'react';

class Pepe {
  constructor (options) {
    this.name = options.name ? options.name : 'Pepe';
  }
  setName (name) {
    this.name = name;
  }
  getName () {
    return this.name;
  }
}
var p = new Pepe({});

document.body.appendChild(component());
