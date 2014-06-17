//var AxisComponent = GRAPH3D.namespace("GRAPH3D.common.ui.components").AxisComponent;
//var namespace = GRAPH3D.namespace("GRAPH3D.common.ui.components");
	
class YAxisComponent extends AxisComponent
{
	constructor(axisLength:number, defaultTextSize:number) {
        super(axisLength, defaultTextSize);
        //this._init(axisLength, defaultTextSize);
	}
	
	public destroy():void 
	{
        super.destroy();
	}
		
	// VALUES ==========================================
    // protected
    public _getAxisMarkerPos(step: number): THREE.Vector3
	{
		return new THREE.Vector3(0, step, 0 );
    }
    // protected
	public _getMarkerInitState(text:THREE.Object3D): AxisState
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var rightOffset = -1 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );

        return new AxisState(new THREE.Vector3(rightOffset - 40, -this._defaultTextSize / 2, 0), new THREE.Euler(0, 0, 0));
	}
    public _getMarkerBottomState(text: THREE.Object3D): AxisState
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var rightOffset = -1 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );

        var state = new AxisState(new THREE.Vector3(rightOffset - 40, this._defaultTextSize / 2, 0),
                                  new THREE.Euler(Math.PI, 0, 0));

		return state;
	}
	// protected
	public _getMarkerInitAnimValues():any
	{
		var obj = { animLength: 150,
					animObj: { rX:Math.PI/2, opacity: 0, yAxisLength:0 },
					targObj: {rX: 0, opacity: 1, yAxisLength: -20} };
						
		return obj;
    }
    // protected
    public _getTitleInitState(text: THREE.Object3D): AxisState
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var centreOffset = -0.5 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );

        var state = new AxisState(new THREE.Vector3(-120, centreOffset + this._axisLength / 2, 0),
                                  new THREE.Euler(0, 0, Math.PI / 2));

        //console.log("getYTitleInitState p: x " + state.position.x + " y " + state.position.y + " z " + state.position.z);
        //console.log("getYTitleInitState r: x " + state.rotation.x + " y " + state.rotation.y + " z " + state.rotation.z);

		return state;
    }
    // protected - Used in Initial Render
    public _getTitleInitAnimValues(state: AxisState): any {

        var mesh: THREE.Mesh = <THREE.Mesh>this.titleText.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var obj = {
            animLength: 1000,
            animObj: { pY: state.position.y, opacity: 0 },
            targObj: { pY: centreOffset + this._axisLength / 2, opacity: 1 }
        };

        return obj;
    }

    public _getTitleBottomState(text: THREE.Object3D): AxisState
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var centreOffset = -0.5 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );

        var state = new AxisState(new THREE.Vector3(-120, centreOffset + this._axisLength / 2, 0),
                                  new THREE.Euler(0, Math.PI, Math.PI / 2));

		return state;
	}

    public _getRightAxisAnimValues():any
	{
		var obj = { animLength: 1000,
					animObj: { rY: this.container.rotation.y },
					targObj: { rY: Math.PI/2 } };
			
		return obj;
	}
	// protected
	public _getInitAxisAnimValues():any
	{
		var obj = { animLength: 1000,
					animObj: { rX: this.container.rotation.x, rY: this.container.rotation.y, rZ: this.container.rotation.z },
					targObj: { rX: 0, rY: 0, rZ: 0 } };
			
		return obj;
	}
		
	// ANIMATIONS ========================================

	public axisToRightView():void
	{
		var scope = this;
		this._gotoAxisView( function() { return scope._getRightAxisAnimValues(); },
							function(text) { return scope._getTextAnimValues(text, scope._getMarkerInitState(text)); }, 
							function(text) { return scope._getTitleAnimValues(text, scope._getTitleInitState(text)); } );
	}

	public axisToBottomView():void
	{
		var scope = this;
		this._gotoAxisView( function() { return scope._getInitAxisAnimValues(); },
							function(text) { return scope._getTextAnimValues(text, scope._getMarkerBottomState(text)); }, 
							function(text) { return scope._getTitleAnimValues(text, scope._getTitleBottomState(text)); } );
	}			
}












