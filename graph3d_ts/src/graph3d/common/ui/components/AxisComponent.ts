//var namespace = GRAPH3D.namespace("GRAPH3D.common.ui.components");
	
class AxisComponent {

    private _textColor: number;
    private _markerLineColor: number;
    private _markerLineOpacity: number;

    public data:any;

    public _axisLength: number; //protected
    public _defaultTextSize: number; //protected

    public lines: Array<THREE.Line>;
    public text: Array<THREE.Object3D>;
    public markers: Array<THREE.Object3D>;
    public animationValues: any;

    public container: THREE.Object3D;
    public titleText: THREE.Object3D;

    // Set by GraphView.ts
    public updateAxesTextCallback: Function;
    public updateTimeCallback: Function;

	constructor(axisLength:number, defaultTextSize:number) {
		this._init(axisLength, defaultTextSize);
	}
		
	public static create(axisLength:number, defaultTextSize:number):AxisComponent 
	{
		var newInstance = new AxisComponent(axisLength, defaultTextSize);
		return newInstance;
	}
		
	private _init(axisLength:number, defaultTextSize:number) 
	{
		// Styling
			
		this._textColor = 0xAAAAAA;
		this._markerLineColor = 0xCCCCCC;
		this._markerLineOpacity = 1;
			
		//
			
		this.data = {};
			
		this._axisLength = axisLength;
		this._defaultTextSize = defaultTextSize;
			
		this.lines = [];
		this.text = [];
		this.markers = [];
		this.titleText = null;
		this.animationValues = { lines: [], text: [], markers: [], titleText: {}, container: {} };
		this.container = new THREE.Object3D();
			
		this.data = null; // graph data
	}
		
	public destroy():void 
	{
			
	}
		
	// INTIAL RENDER ===============================
	public renderAxis(delay:number, title:string, graphObj)
	{
		var axisNum = this.data.minVal;
		var numSteps = this.data.numSteps;
			
		graphObj.add( this.container );	
			
		var axisInitState = this._getAxisInitState();
		this.container.position = axisInitState.position;
		this.container.rotation = axisInitState.rotation;
			
		for ( var i = 0; i <= numSteps; i ++ )
		{
			var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			
			var markerObj = new THREE.Object3D();
			this.container.add( markerObj );
			this.markers.push( markerObj );
				
			markerObj.position = this._getAxisMarkerPos(i * (this._axisLength/numSteps));
				
			var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: this._markerLineColor, opacity: this._markerLineOpacity } ) );
				
			markerObj.add( line );
			this.lines.push(line);

			var text = this._createText(axisNum.toString());
            var mesh:THREE.Mesh = <THREE.Mesh>text.children[0];
            mesh.material.opacity = 0;
				
			var state = this._getMarkerInitState(text);
				
			text.position = state.position;
			text.rotation = state.rotation;
				
			markerObj.add( text );
			this.text.push(text);
				
			// Begin intro tween for marker objects
			var animInitObj = this._getMarkerInitAnimValues();
			this.animationValues.markers[i] = animInitObj.animObj;
				
			this._createGraphTween(animInitObj.animObj, animInitObj.targObj, animInitObj.animLength, delay, this.updateTimeCallback);
				
			delay += 50;
				
			if ( this.data.logarithmic ) 
			{
				var numFractionalSteps = this.data.numFractionalSteps;
					
				if ( numFractionalSteps ) 
				{					
					var multiplier = Math.pow( 10, numFractionalSteps - 1 ); // to round the number
					if ( i < numFractionalSteps - 1 ) {
						axisNum = Math.round( Math.pow( 1/this.data.base, numFractionalSteps - (i+1)) * multiplier ) / multiplier;
					} else {
						axisNum = Math.pow(this.data.base, (i+1)-numFractionalSteps);
					}
				} else {
					//axisNum = Math.pow(this.data.base, ((i+2)*this.data.baseLog)-numFractionalSteps);
					axisNum = Math.pow(this.data.base, i+this.data.baseLog);
					axisNum *= this.data.base; // shift them right one
				}
			} else {
				axisNum += this.data.stepSize;
			}
		}
			
		var text = this._createText(title, 20);
			
		state = this._getTitleInitState(text);
		
        // Bug to do with setting position & rotation, setting x, y, z gets around it	
        //text.position = state.position;
        text.position.x = state.position.x;
        text.position.y = state.position.y;
        text.position.z = state.position.z;
        //text.rotation = state.rotation;
        text.rotation.x = state.rotation.x;
        text.rotation.y = state.rotation.y;
        text.rotation.z = state.rotation.z;

		this.container.add( text );
		this.titleText = text;
	    
        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
        mesh.material.opacity = 0;
        //console.log("MESH " + mesh + " material " + mesh.material + " opacity " + mesh.material.opacity);
			
		// animate in titles
		var animInitObj = this._getTitleInitAnimValues(state);
		this.animationValues.titleText = animInitObj.animObj;
			
		this._createGraphTween(animInitObj.animObj, animInitObj.targObj, animInitObj.animLength, delay, this.updateAxesTextCallback);
	}
		
	// CREATE TEXT =================================
	private _createText(str:string, size?:number):THREE.Object3D
	{
		// Get text from hash
		var hash:string = document.location.hash.substr( 1 );

		if ( hash.length !== 0 ) {

			str = hash;

		}
			
		if (!size)	size = this._defaultTextSize;

		var geometry = new THREE.TextGeometry( str, {

			size: size,
			height: 1,
			curveSegments: 2,
			font: "helvetiker"

		});

		geometry.computeBoundingBox();
		var centerOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		var rightOffset = -1 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
			
		var textMaterial = new THREE.MeshBasicMaterial( { color:  this._textColor, overdraw: true } );
		var text = new THREE.Mesh( geometry, textMaterial );

        //text.doubleSided = false;

		var parent = new THREE.Object3D();
		parent.add( text );
			
		return parent;
	}		
		
	// ANIMATIONS ===========================================
		
	public axisToDefaultView():void
	{
		var scope = this;
		this._gotoAxisView( function() { return scope._getInitAxisAnimValues(); }, 
							function(text) { return scope._getTextAnimValues(text, scope._getMarkerInitState(text)); }, 
							function(text) { return scope._getTitleAnimValues(text, scope._getTitleInitState(text)); } );
	}
    
    // protected	
	public _gotoAxisView(axisAnimValsFunc:Function, textAnimValsFunc:Function, titleAnimValsFunc:Function)
	{
		var delay = 1000;

        var animInitObj = axisAnimValsFunc.call(this);
		this.animationValues.container = animInitObj.animObj;
		this._createGraphTween(animInitObj.animObj, animInitObj.targObj, animInitObj.animLength, delay, this.updateTimeCallback);

		delay += 1200;
			
		for ( var i = 0; i < this.markers.length; i ++ )
		{
			var text = this.markers[i].children[1];

			//var state = markerStateFunc(text);

			//text.position = state.position;
			//text.rotation = state.rotation;
				
			// Begin tween for marker objects
			var animInitObj = textAnimValsFunc(text);
			this.animationValues.text[i] = animInitObj.animObj;
				
			this._createGraphTween(animInitObj.animObj, animInitObj.targObj, animInitObj.animLength, delay, this.updateAxesTextCallback);

			delay += 25;
		}
			
		text = this.titleText;
			
		delay = 1800;

		//state = titleStateFunc(text);
			
		//text.position = state.position;
		//text.rotation = state.rotation;
			
		// Begin tween for title
		var animInitObj = titleAnimValsFunc(text);
		this.animationValues.titleText = animInitObj.animObj;
			
		this._createGraphTween(animInitObj.animObj, animInitObj.targObj, animInitObj.animLength, delay, this.updateAxesTextCallback);
	}
		
	public updateAxis():void
	{
		if ( this.animationValues ) {
			var markers = this.animationValues.markers;
			if ( markers ) {
				for ( var i = 0; i < markers.length; i ++ ) {
					var markerObj = this.markers[i];
						
					if (!isNaN(markers[i].rX))	markerObj.rotation.x = markers[i].rX;
					if (!isNaN(markers[i].rY))	markerObj.rotation.x = markers[i].rY;
					if (!isNaN(markers[i].rZ))	markerObj.rotation.x = markers[i].rZ;
						
					// Markers on the X-Axis are lines along the Y
					if (!isNaN(markers[i].xAxisLength)) {
						var line:THREE.Mesh = <THREE.Mesh>markerObj.children[0];
						var vector3 = line.geometry.vertices[0];					
						vector3.y = markers[i].xAxisLength;
						line.geometry.verticesNeedUpdate = true;
					}
					// Markers on the Y-Axis are lines along the X
					if (!isNaN(markers[i].yAxisLength)) {
						var line:THREE.Mesh = <THREE.Mesh>markerObj.children[0];
						var vector3 = line.geometry.vertices[0];					
						vector3.x = markers[i].yAxisLength;
						line.geometry.verticesNeedUpdate = true;
					}
						
					var text = markerObj.children[1];
                    if (!isNaN(markers[i].opacity)) {
                        //text.children[0].material.opacity = markers[i].opacity;
                        var mesh: THREE.Mesh = <THREE.Mesh>text.children[0];
                        mesh.material.opacity = markers[i].opacity;
                    }
				}
			}
				
			var container = this.animationValues.container;
			if ( container )
			{
				if (!isNaN(container.rX))		this.container.rotation.x = container.rX;
				if (!isNaN(container.rY))		this.container.rotation.y = container.rY;
				if (!isNaN(container.rZ))		this.container.rotation.z = container.rZ;
			}
		}
	}		
		
	public updateAxisText():void
    {
        var textBox: THREE.Object3D;

		if ( this.animationValues )
		{			
			// Rotating text when viewing from different angles
			var texts = this.animationValues.text;
			if ( texts )
			{
				for ( var i = 0; i < texts.length; i ++ )
				{
					textBox = this.text[i];
					var animObj = texts[i];
					if (!isNaN(animObj.pX))		textBox.position.x = animObj.pX;
					if (!isNaN(animObj.pY))		textBox.position.y = animObj.pY;
					if (!isNaN(animObj.pZ))		textBox.position.z = animObj.pZ;
					if (!isNaN(animObj.rX))		textBox.rotation.x = animObj.rX;
					if (!isNaN(animObj.rY))		textBox.rotation.y = animObj.rY;
					if (!isNaN(animObj.rZ))		textBox.rotation.z = animObj.rZ;
                    if (!isNaN(animObj.opacity)) {
                        //textBox.children[0].material.opacity = animObj.opacity;
                        var mesh: THREE.Mesh = <THREE.Mesh>textBox.children[0];
                        mesh.material.opacity = animObj.opacity;
                    }
					//console.log("text pX "+texts[i].pX+" pY "+texts[i].pY+" pZ "+texts[i].pZ+" rX "+texts[i].rX+" rY "+texts[i].rY+" rZ "+texts[i].rZ);
				}
			}
				
			var titleText = this.animationValues.titleText;
			if ( titleText )
			{
				textBox = this.titleText;
				if (!isNaN(titleText.pX))	textBox.position.x = titleText.pX;
				if (!isNaN(titleText.pY))	textBox.position.y = titleText.pY;
				if (!isNaN(titleText.pZ))	textBox.position.z = titleText.pZ;
				if (!isNaN(titleText.rX))	textBox.rotation.x = titleText.rX;
				if (!isNaN(titleText.rY))	textBox.rotation.y = titleText.rY;
				if (!isNaN(titleText.rZ))	textBox.rotation.z = titleText.rZ;
                if (!isNaN(titleText.opacity)) {
                    //textBox.children[0].material.opacity = titleText.opacity;
                    var mesh: THREE.Mesh = <THREE.Mesh>textBox.children[0];
                    mesh.material.opacity = titleText.opacity;
                }
			}			
		}
	}

    private _createGraphTween(animObj: any, animTargObj: any, length: number, delay: number, updateCallBack: Function): TWEEN.Tween
	{
		var graphTween = new TWEEN.Tween(animObj);
		graphTween.to(animTargObj, length);
		graphTween.delay(delay);
		graphTween.easing(TWEEN.Easing.Quadratic.InOut);
		graphTween.onUpdate(<any>updateCallBack);
		graphTween.start();
			
		return graphTween;
	}		
		
		
	// data ===========================================
    // protected - for override
    public _getAxisInitState(): any
	{
		var state:Object = { position: new THREE.Vector3(0, 0, 0),
						rotation: new THREE.Vector3(0, 0, 0) };

		return state;	
	}
	// protected - for override 
	public _getAxisMarkerPos(step) {
		return null;
    }
    // protected - for override 
    public _getMarkerInitState(text) {
		return null;
    }
    // protected - for override 
    public _getMarkerInitAnimValues() {	
		return null;
    }
    // protected - for override 
    public _getTitleInitState(text) {
		return null;
    }
    // protected - for override 
    public _getTitleInitAnimValues(state) {
		return null;
    }
    // protected - for override 
    public _getInitAxisAnimValues() {
        return null;
    }
		
    // protected
	public _getTextAnimValues(text:THREE.Object3D, state:any):Object
	{
		//var state = this._getMarkerInitState(text);
			
		var tP = text.position;
		var tR = text.rotation;
		var sP = state.position;
		var sR = state.rotation;
			
		var obj = { animLength: 150,
					animObj: { pX: tP.x, pY: tP.y, pZ: tP.z, rX: tR.x, rY: tR.y, rZ: tR.z, opacity: 1 },
					targObj: { pX: sP.x, pY: sP.y, pZ: sP.z, rX: sR.x, rY: sR.y, rZ: sR.z, opacity: 1 } };

		return obj;
	}
	// protected
	public _getTitleAnimValues(text:THREE.Object3D, state:any)
	{
		//var state = this._getMarkerInitState(text);
			
		var tP = text.position;
		var tR = text.rotation;
		var sP = state.position;
		var sR = state.rotation;
			
		var obj = { animLength: 500,
					animObj: { pX: tP.x, pY: tP.y, pZ: tP.z, rX: tR.x, rY: tR.y, rZ: tR.z, opacity: 1 },
					targObj: { pX: sP.x, pY: sP.y, pZ: sP.z, rX: sR.x, rY: sR.y, rZ: sR.z, opacity: 1 } };

		return obj;
	}
}