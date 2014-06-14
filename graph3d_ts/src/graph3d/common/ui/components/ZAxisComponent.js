//var AxisComponent = GRAPH3D.namespace("GRAPH3D.common.ui.components").AxisComponent;
//var namespace = GRAPH3D.namespace("GRAPH3D.common.ui.components");
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ZAxisComponent = (function (_super) {
    __extends(ZAxisComponent, _super);
    function ZAxisComponent(axisLength, defaultTextSize) {
        _super.call(this, axisLength, defaultTextSize);
        //this._init(axisLength, defaultTextSize);
    }
    ZAxisComponent.create = function (axisLength, defaultTextSize) {
        var newInstance = new ZAxisComponent(axisLength, defaultTextSize);
        return newInstance;
    };

    //private _init(axisLength, defaultTextSize)
    //{
    //	this._axisLength = axisLength;
    //	this._defaultTextSize = defaultTextSize;
    //}
    ZAxisComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };

    // VALUES ============================================
    // protected
    ZAxisComponent.prototype._getAxisMarkerPos = function (step) {
        return new THREE.Vector3(0, 0, -step);
    };

    // protected
    ZAxisComponent.prototype._getMarkerInitState = function (text) {
        var mesh = text.children[0];
        var rightOffset = -1 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(rightOffset - 40, 0, -this._defaultTextSize / 2),
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0)
        };

        return state;
    };
    ZAxisComponent.prototype._getMarkerRightState = function (text) {
        var mesh = text.children[0];
        var rightOffset = -1 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(rightOffset - 40, 0, -this._defaultTextSize / 2),
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0)
        };

        return state;
    };
    ZAxisComponent.prototype._getMarkerBottomState = function (text) {
        var mesh = text.children[0];
        var rightOffset = -1 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(rightOffset - 40, 0, -this._defaultTextSize / 2),
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0)
        };

        return state;
    };

    // protected
    ZAxisComponent.prototype._getMarkerInitAnimValues = function () {
        var obj = {
            animLength: 150,
            animObj: { rX: Math.PI / 2, opacity: 0, yAxisLength: 0 },
            targObj: { rX: 0, opacity: 1, yAxisLength: -20 } };

        return obj;
    };

    // protected
    ZAxisComponent.prototype._getTitleInitState = function (text) {
        var mesh = text.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            //position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset - 150),
            position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset),
            rotation: new THREE.Euler(Math.PI / 2, 0, Math.PI + Math.PI / 2)
        };

        console.log("getZTitleInitState p: x " + state.position.x + " y " + state.position.y + " z " + state.position.z);
        console.log("getZTitleInitState r: x " + state.rotation.x + " y " + state.rotation.y + " z " + state.rotation.z);

        return state;
    };

    // protected - Used in Initial Render
    ZAxisComponent.prototype._getTitleInitAnimValues = function (state) {
        var mesh = this.titleText.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var obj = {
            animLength: 1000,
            animObj: { pZ: state.position.z, opacity: 0 },
            targObj: { pZ: -this._axisLength / 2 - centreOffset, opacity: 1 }
        };

        return obj;
    };

    ZAxisComponent.prototype._getTitleRightState = function (text) {
        var mesh = text.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset),
            rotation: new THREE.Vector3(Math.PI / 2, 0, Math.PI + Math.PI / 2)
        };

        return state;
    };
    ZAxisComponent.prototype._getTitleBottomState = function (text) {
        var mesh = text.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var state = {
            position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset),
            rotation: new THREE.Vector3(Math.PI / 2, 0, Math.PI + Math.PI / 2)
        };

        return state;
    };

    ZAxisComponent.prototype._getRightAxisAnimValues = function () {
        var obj = {
            animLength: 1000,
            animObj: { rZ: this.container.rotation.z },
            targObj: { rZ: Math.PI / 2 } };

        return obj;
    };

    ZAxisComponent.prototype._getBottomAxisAnimValues = function () {
        var obj = {
            animLength: 1000,
            animObj: { rZ: this.container.rotation.z },
            targObj: { rZ: 0 } };

        return obj;
    };

    // protected
    ZAxisComponent.prototype._getInitAxisAnimValues = function () {
        var obj = {
            animLength: 1000,
            animObj: { rZ: this.container.rotation.z },
            targObj: { rZ: Math.PI / 2 } };

        return obj;
    };

    // protected
    ZAxisComponent.prototype._getAxisInitState = function () {
        var state = {
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Vector3(0, 0, Math.PI / 2) };

        return state;
    };

    //ANIMATIONS =====================================
    ZAxisComponent.prototype.axisToRightView = function () {
        var scope = this;
        this._gotoAxisView(function () {
            return scope._getRightAxisAnimValues();
        }, function (text) {
            return scope._getTextAnimValues(text, scope._getMarkerRightState(text));
        }, function (text) {
            return scope._getTitleAnimValues(text, scope._getTitleRightState(text));
        });
    };

    ZAxisComponent.prototype.axisToBottomView = function () {
        var scope = this;
        this._gotoAxisView(function () {
            return scope._getBottomAxisAnimValues();
        }, function (text) {
            return scope._getTextAnimValues(text, scope._getMarkerBottomState(text));
        }, function (text) {
            return scope._getTitleAnimValues(text, scope._getTitleBottomState(text));
        });
    };
    return ZAxisComponent;
})(AxisComponent);
//# sourceMappingURL=ZAxisComponent.js.map
