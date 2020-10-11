'use strict';


class SessionManager {


  constructor() {
    this._ls = window.localStorage;
  }


  save(name, value) {
    this._ls.setItem(name, JSON.stringify(value));
  }


  remove(name) {
    
  }


  get(name) {
    return JSON.parse(this._ls.getItem(name));
  }


}


export default SessionManager;
