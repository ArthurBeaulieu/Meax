class ModalBase {


  constructor(options) {
    this._url = options.url;
    this._rootElement = null;

    this._loadingOverlay = document.createElement('DIV');
    this._loadingOverlay.className = 'loading-overlay';

    this._loadTemplate();
  }


  _loadTemplate() {
    Meax.kom.getText(this._url).then(response => {
      this._rootElement = Utils.parseHTMLFragment(response);
      this._loadingOverlay.appendChild(this._rootElement);
      this.open();
      this._fillAttributes();
    });
  }


  _fillAttributes() {
    // Must be overriden in child class
  }


  open() {
    document.body.appendChild(this._loadingOverlay);
    CustomEvents.addEvent('click', this._loadingOverlay, this.close, this);
  }


  close(event) {
    if ((event && event.target === this._loadingOverlay) || !event) {
      document.body.removeChild(this._loadingOverlay);
      CustomEvents.removeEvent('click', this._loadingOverlay, this.close, this);
    }
  }


}


export default ModalBase;
