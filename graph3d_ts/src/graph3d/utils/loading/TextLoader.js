//var namespace = GRAPH3D.namespace("GRAPH3D.utils.loading");
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TextLoader = (function (_super) {
    __extends(TextLoader, _super);
    function TextLoader() {
        _super.call(this);
        this._init();
    }
    TextLoader.prototype._init = function () {
        this._url = null;
        this._loader = null;
        this._data = null;

        return this;
    };

    TextLoader.create = function (aUrl) {
        var newTextLoader = new TextLoader();
        newTextLoader.setUrl(aUrl);
        return newTextLoader;
    };

    TextLoader.prototype.getData = function () {
        return this._data;
    };

    TextLoader.prototype.setUrl = function (aUrl) {
        this._url = aUrl;

        return this;
    };

    TextLoader.prototype.load = function () {
        this._loader = new XMLHttpRequest();
        this._loader.open("GET", this._url, false);

        this._loader.onreadystatechange = ListenerFunctions.createListenerFunction(this, this._onReadyStateChange);
        this._loader.send(null);

        return this;
    };

    TextLoader.prototype._onReadyStateChange = function () {
        console.log("GRAPH3D.utils.loading.TextLoader::_onReadyStateChange");
        console.log(this._url, this._loader.readyState, this._loader.status);
        switch (this._loader.readyState) {
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            case 4:
                if (this._loader.status < 400) {
                    this._data = this._loader.responseText;
                    this.dispatchCustomEvent(TextLoader.LOADED, this.getData());
                } else {
                    this.dispatchCustomEvent(TextLoader.ERROR, null);
                }
                break;
        }
    };

    TextLoader.prototype.destroy = function () {
    };
    TextLoader.LOADED = "loaded";
    TextLoader.ERROR = "error";
    return TextLoader;
})(EventDispatcher);
//# sourceMappingURL=TextLoader.js.map
