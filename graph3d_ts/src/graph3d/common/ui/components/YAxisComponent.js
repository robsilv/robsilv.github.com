//var AxisComponent = GRAPH3D.namespace("GRAPH3D.common.ui.components").AxisComponent;
//var namespace = GRAPH3D.namespace("GRAPH3D.common.ui.components");
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var YAxisComponent = (function (_super) {
    __extends(YAxisComponent, _super);
    function YAxisComponent(axisLength, defaultTextSize) {
        _super.call(this, axisLength, defaultTextSize);
        //this._init(axisLength, defaultTextSize);
    }
    YAxisComponent.create = function (axisLength, defaultTextSize) {
        var newInstance = new YAxisComponent(axisLength, defaultTextSize);
        return newInstance;
    };

    //private _init(axisLength, defaultTextSize)
    //{
    //	this._axisLength = axisLength;
    //	this._defaultTextSize = defaultTextSize;
    //}
    YAxisComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };

    // VALUES ==========================================
    // protected
    YAxisComponent.prototype._getAxisMarkerPos = function (step) {
        return new THREE.Vector3(0, step, 0);
    };

    // protected
    YAxisComponent.prototype._getMarkerInitState = function (text) {
        var mesh = text.children[0];
        var rightOffset = -1 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(rightOffset - 40, -this._defaultTextSize / 2, 0),
            rotation: new THREE.Vector3(0, 0, 0)
        };

        return state;
    };
    YAxisComponent.prototype._getMarkerBottomState = function (text) {
        var mesh = text.children[0];
        var rightOffset = -1 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(rightOffset - 40, this._defaultTextSize / 2, 0),
            rotation: new THREE.Vector3(Math.PI, 0, 0)
        };

        return state;
    };

    // protected
    YAxisComponent.prototype._getMarkerInitAnimValues = function () {
        var obj = {
            animLength: 150,
            animObj: { rX: Math.PI / 2, opacity: 0, yAxisLength: 0 },
            targObj: { rX: 0, opacity: 1, yAxisLength: -20 } };

        return obj;
    };

    // protected
    YAxisComponent.prototype._getTitleInitState = function (text) {
        var mesh = text.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            //position: new THREE.Vector3(-120, centreOffset + this._axisLength / 2 - 150, 0),
            position: new THREE.Vector3(-120, centreOffset + this._axisLength / 2, 0),
            rotation: new THREE.Euler(0, 0, Math.PI / 2)
        };

        console.log("getYTitleInitState p: x " + state.position.x + " y " + state.position.y + " z " + state.position.z);
        console.log("getYTitleInitState r: x " + state.rotation.x + " y " + state.rotation.y + " z " + state.rotation.z);

        return state;
    };

    // protected - Used in Initial Render
    YAxisComponent.prototype._getTitleInitAnimValues = function (state) {
        var mesh = this.titleText.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var obj = {
            animLength: 1000,
            animObj: { pY: state.position.y, opacity: 0 },
            targObj: { pY: centreOffset + this._axisLength / 2, opacity: 1 }
        };

        return obj;
    };

    YAxisComponent.prototype._getTitleBottomState = function (text) {
        var mesh = text.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(-120, centreOffset + this._axisLength / 2, 0),
            rotation: new THREE.Vector3(0, Math.PI, Math.PI / 2)
        };

        return state;
    };

    YAxisComponent.prototype._getRightAxisAnimValues = function () {
        var obj = {
            animLength: 1000,
            animObj: { rY: this.container.rotation.y },
            targObj: { rY: Math.PI / 2 } };

        return obj;
    };

    // protected
    YAxisComponent.prototype._getInitAxisAnimValues = function () {
        var obj = {
            animLength: 1000,
            animObj: { rX: this.container.rotation.x, rY: this.container.rotation.y, rZ: this.container.rotation.z },
            targObj: { rX: 0, rY: 0, rZ: 0 } };

        return obj;
    };

    // ANIMATIONS ========================================
    YAxisComponent.prototype.axisToRightView = function () {
        var scope = this;
        this._gotoAxisView(function () {
            return scope._getRightAxisAnimValues();
        }, function (text) {
            return scope._getTextAnimValues(text, scope._getMarkerInitState(text));
        }, function (text) {
            return scope._getTitleAnimValues(text, scope._getTitleInitState(text));
        });
    };

    YAxisComponent.prototype.axisToBottomView = function () {
        var scope = this;
        this._gotoAxisView(function () {
            return scope._getInitAxisAnimValues();
        }, function (text) {
            return scope._getTextAnimValues(text, scope._getMarkerBottomState(text));
        }, function (text) {
            return scope._getTitleAnimValues(text, scope._getTitleBottomState(text));
        });
    };
    return YAxisComponent;
})(AxisComponent);
//# sourceMappingURL=YAxisComponent.js.map
