//var AxisComponent = GRAPH3D.namespace("GRAPH3D.common.ui.components").AxisComponent;
//var namespace = GRAPH3D.namespace("GRAPH3D.common.ui.components");
	
class ZAxisComponent extends AxisComponent
{	
    constructor(axisLength, defaultTextSize) {
        super(axisLength, defaultTextSize);
		//this._init(axisLength, defaultTextSize);
    }
        	
	public static create(axisLength:number, defaultTextSize:number):ZAxisComponent 
	{
		var newInstance = new ZAxisComponent(axisLength, defaultTextSize);
		return newInstance;
	}
		
	//private _init(axisLength, defaultTextSize) 
	//{
	//	this._axisLength = axisLength;
	//	this._defaultTextSize = defaultTextSize;
	//}
		
	public destroy():void 
	{
        super.destroy();
	}
		
	// VALUES ============================================
    // protected
    public _getAxisMarkerPos(step: number): THREE.Vector3
	{
		return new THREE.Vector3(0, 0, -step );
    }
    // protected
	public _getMarkerInitState(text:THREE.Object3D):any
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var rightOffset = -1 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
    
        var state: Object = {
            position: new THREE.Vector3(rightOffset - 40, 0, -this._defaultTextSize / 2),
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0)
        };

		return state;
	}
    public _getMarkerRightState(text:THREE.Object3D):any
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var rightOffset = -1 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
		
        var state: Object = {
            position: new THREE.Vector3(rightOffset - 40, 0, -this._defaultTextSize / 2),
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0)
        };

        return state;
	}
    public _getMarkerBottomState(text:THREE.Object3D):any
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var rightOffset = -1 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
			
        var state: Object = {
            position: new THREE.Vector3(rightOffset - 40, 0, -this._defaultTextSize / 2),
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0)
        };

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
	public _getTitleInitState(text:THREE.Object3D):any
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var centreOffset = -0.5 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
 
        var state = {
            //position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset - 150),
            position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset),
            rotation: new THREE.Euler(Math.PI / 2, 0, Math.PI + Math.PI / 2)
        };

        console.log("getZTitleInitState p: x " + state.position.x + " y " + state.position.y + " z " + state.position.z);
        console.log("getZTitleInitState r: x " + state.rotation.x + " y " + state.rotation.y + " z " + state.rotation.z);
			
        return state;
    }
    // protected - Used in Initial Render
    public _getTitleInitAnimValues(state: any): any {

        var mesh: THREE.Mesh = <THREE.Mesh>this.titleText.children[0];
        var centreOffset = -0.5 * (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x);

        var obj = {
            animLength: 1000,
            animObj: { pZ: state.position.z, opacity: 0 },
            targObj: { pZ: -this._axisLength / 2 - centreOffset, opacity: 1 }
        };

        return obj;
    }

    public _getTitleRightState(text:THREE.Object3D):any
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var centreOffset = -0.5 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
			
        var state = {
            position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset),
            rotation: new THREE.Vector3(Math.PI / 2, 0, Math.PI + Math.PI / 2)
        };

		return state;	
	}
    public _getTitleBottomState(text:THREE.Object3D):any
    {
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
		var centreOffset = -0.5 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
			
        var state = {
            position: new THREE.Vector3(-120, 0, -this._axisLength / 2 - centreOffset),
            rotation: new THREE.Vector3(Math.PI / 2, 0, Math.PI + Math.PI / 2)
        };

		return state;	
	}
		
    public _getRightAxisAnimValues():any
	{
		var obj = { animLength: 1000,
					animObj: { rZ: this.container.rotation.z },
					targObj: { rZ: Math.PI/2 } };
			
		return obj;
	}
		
    public _getBottomAxisAnimValues():any
	{
		var obj = { animLength: 1000,
					animObj: { rZ: this.container.rotation.z },
					targObj: { rZ: 0 } };
			
		return obj;
	}
	// protected	
	public _getInitAxisAnimValues():any
	{
		var obj = { animLength: 1000,
					animObj: { rZ: this.container.rotation.z },
					targObj: { rZ: Math.PI/2 } }; // should relate to _getAxisInitState?
			
		return obj;
	}
	// protected	
	public _getAxisInitState():any
	{
		var state = { position: new THREE.Vector3(0, 0, 0),
						rotation: new THREE.Vector3(0, 0, Math.PI/2) };

		return state;	
	}
		
	//ANIMATIONS =====================================

	public axisToRightView():void
	{
		var scope = this;
		this._gotoAxisView( function() { return scope._getRightAxisAnimValues(); },
							function(text) { return scope._getTextAnimValues(text, scope._getMarkerRightState(text)); }, 
							function(text) { return scope._getTitleAnimValues(text, scope._getTitleRightState(text)); } );
	}
		
	public axisToBottomView():void
	{
		var scope = this;
		this._gotoAxisView( function() { return scope._getBottomAxisAnimValues(); },
							function(text) { return scope._getTextAnimValues(text, scope._getMarkerBottomState(text)); },
							function(text) { return scope._getTitleAnimValues(text, scope._getTitleBottomState(text)); } );
	}	
}










