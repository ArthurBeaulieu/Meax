class SessionManager {


  constructor() {
    this._ls = window.localStorage;
  }


  save(name, value) {
    this._ls.setItem(name, JSON.stringify(value));
  }


  remove(name) {
    this._ls.removeItem(name);
  }


  get(name) {
    return JSON.parse(this._ls.getItem(name));
  }


  getSavedPlaylists() {
    const results = [];
    for (let i = 0; i < this._ls.length; i++) {
      const key = this._ls.key(i);
      if (key.includes('playlist-')) {
        results.push({
          key: key,
          value: JSON.parse(this._ls.getItem(key))
        });
      }
    }
    return results;
  }


}


export default SessionManager;
