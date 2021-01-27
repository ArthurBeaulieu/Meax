class ModalBase {


  constructor(options) {
    this._url = options.url;
    this._rootElement = null;
    this._evtIds = [];

    this._loadingOverlay = document.createElement('DIV');
    this._loadingOverlay.className = 'modal-overlay';

    this._loadTemplate();
  }


  _loadTemplate() {
    window.Meax.kom.getText(this._url).then(response => {
      this._rootElement = window.Utils.parseHTMLFragment(response);
      this._loadingOverlay.appendChild(this._rootElement);
      this.open();
      this._fillAttributes();
    });
  }


  _fillAttributes() {
    // Must be overridden in child class
  }


  open() {
    document.body.appendChild(this._loadingOverlay);
    this._evtIds.push(window.CustomEvents.addEvent('click', this._loadingOverlay, this.close, this));
  }


  close(event) {
    if ((event && event.target === this._loadingOverlay) || !event) {
      document.body.removeChild(this._loadingOverlay);
      for (let i = 0; i < this._evtIds.length; ++i) {
        window.CustomEvents.removeEvent(this._evtIds[i]);
      }
    }
  }


}


export default ModalBase;
