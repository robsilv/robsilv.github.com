//var AxisComponent = GRAPH3D.namespace("GRAPH3D.common.ui.components").AxisComponent;
//var namespace = GRAPH3D.namespace("GRAPH3D.common.ui.components");
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var XAxisComponent = (function (_super) {
    __extends(XAxisComponent, _super);
    function XAxisComponent(axisLength, defaultTextSize) {
        _super.call(this, axisLength, defaultTextSize);
        //this._init(axisLength, defaultTextSize);
    }
    XAxisComponent.create = function (axisLength, defaultTextSize) {
        var newInstance = new XAxisComponent(axisLength, defaultTextSize);
        return newInstance;
    };

    //private _init(axisLength, defaultTextSize)
    //{
    //	this._axisLength = axisLength;
    //	this._defaultTextSize = defaultTextSize;
    //}
    XAxisComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };

    // VALUES ======================================================
    // Used in Initial Render
    XAxisComponent.prototype._getAxisMarkerPos = function (step) {
        return new THREE.Vector3(step, 0, 0);
    };
    XAxisComponent.prototype._getAxisMarkerPosLog = function (step) {
        return new THREE.Vector3(step, 0, 0);
    };

    // protected
    XAxisComponent.prototype._getMarkerInitState = function (text) {
        return { position: new THREE.Vector3(-this._defaultTextSize / 2, -50, 0), rotation: new THREE.Vector3(0, 0, Math.PI + Math.PI / 2) };
    };
    XAxisComponent.prototype._getMarkerBottomState = function (text) {
        var mesh = text.children[0];
        var rightOffset = -1 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(-this._defaultTextSize / 2, rightOffset - 40, 0),
            rotation: new THREE.Vector3(Math.PI, 0, Math.PI + Math.PI / 2)
        };

        return state;
    };

    // protected
    XAxisComponent.prototype._getTitleInitState = function (text) {
        var mesh = text.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            //position: new THREE.Vector3(centreOffset + this._axisLength / 2 - 150, -160, 0),
            position: new THREE.Vector3(centreOffset + this._axisLength / 2, -160, 0),
            rotation: new THREE.Vector3(0, 0, 0)
        };

        console.log("getXTitleInitState p: x " + state.position.x + " y " + state.position.y + " z " + state.position.z);
        console.log("getXTitleInitState r: x " + state.rotation.x + " y " + state.rotation.y + " z " + state.rotation.z);

        return state;
    };

    // protected - Used in Initial Render
    XAxisComponent.prototype._getTitleInitAnimValues = function (state) {
        var mesh = this.titleText.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var obj = {
            animLength: 1000,
            animObj: { pX: state.position.x, opacity: 0 },
            targObj: { pX: centreOffset + this._axisLength / 2, opacity: 1 }
        };

        return obj;
    };

    XAxisComponent.prototype._getTitleBottomState = function (text) {
        var mesh = text.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(centreOffset + this._axisLength / 2, -140, 0),
            rotation: new THREE.Euler(Math.PI, 0, 0)
        };

        return state;
    };

    // protected - Used in Initial Render
    XAxisComponent.prototype._getMarkerInitAnimValues = function () {
        var obj = {
            animLength: 150,
            animObj: { rX: Math.PI / 2, opacity: 0, xAxisLength: 0 },
            targObj: { rX: 0, opacity: 1, xAxisLength: -20 } };

        return obj;
    };

    XAxisComponent.prototype._getBottomAxisAnimValues = function () {
        var obj = {
            animLength: 1000,
            animObj: { rX: this.container.rotation.x },
            targObj: { rX: -Math.PI / 2 } };

        return obj;
    };

    // protected
    XAxisComponent.prototype._getInitAxisAnimValues = function () {
        var obj = {
            animLength: 1000,
            animObj: { rX: this.container.rotation.x, rY: this.container.rotation.y, rZ: this.container.rotation.z },
            targObj: { rX: 0, rY: 0, rZ: 0 } };

        return obj;
    };

    // ANIMATIONS ========================================================
    XAxisComponent.prototype.axisToBottomView = function () {
        var scope = this;
        this._gotoAxisView(function () {
            return scope._getBottomAxisAnimValues();
        }, function (text) {
            return scope._getTextAnimValues(text, scope._getMarkerBottomState(text));
        }, function (text) {
            return scope._getTitleAnimValues(text, scope._getTitleBottomState(text));
        });
    };
    return XAxisComponent;
})(AxisComponent);
//# sourceMappingURL=XAxisComponent.js.map
