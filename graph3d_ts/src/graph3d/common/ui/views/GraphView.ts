//var namespace = GRAPH3D.namespace("GRAPH3D.common.ui.views");

class GraphView {

    // constants
	public static BOTTOM = "bottom";
    public static RIGHT = "right";
    public static FRONT = "front";
    public static OVER = "over";

    private _renderer: THREE.WebGLRenderer;
    private _stats: Stats;
    private _camera: THREE.CombinedCamera;
    private _scene: THREE.Scene;

    private _graphObjContainer: THREE.Object3D;
    private _graphObj: THREE.Object3D;

    private _gridLineColor: number;
    private _gridLineOpacity:number;

    private _defaultTextSize: number;
    private _axisLength: number;

    private _currentZIndex: number;

    private _psTable: Object;
    private dataProvider;
    private _graphUtils: GraphUtils;

    //private _updateTimeCallback: Function;
    //private _updateAxesTextCallback: Function;
    //private _completeTimeCallback: Function;

    private _xAxis: XAxisComponent;
    private _yAxis: YAxisComponent;
    private _zAxis: ZAxisComponent;

    private _offsetTop: number;
    private _offsetLeft: number;
    private _animLength: number;

    private _container: Element;

    private _bottomViewButton: HTMLButtonElement;
    private _rightViewButton: HTMLButtonElement;
    private _frontViewButton: HTMLButtonElement;
    private _overViewButton: HTMLButtonElement;
    private _startButton: HTMLButtonElement;

    private _targetRotationY: number;
    private _targetRotationYOnMouseDown: number;

    private _mouseX: number;
    private _mouseXOnMouseDown: number;

    private _targetRotationX: number;
    private _targetRotationXOnMouseDown: number;

    private _mouseY: number;
    private _mouseYOnMouseDown: number;

    private _graphValues: any;
    private _axesObjects: any;
    private _currentView: string;
    private _freeRotate: boolean;

    private _mouseMoveListener: EventListener;
    private _mouseUpListener: EventListener;
    private _mouseOutListener: EventListener;

    private _dataProvider;
    private _axisTitles: any;

    private _regionColors: any;
    private _linesData: any;
    private _renderDataInterval: number;
    private _countryCount: number;

    constructor() {
        this._init();
        this._animate();
    }

	public static create():GraphView 
	{
		var newGraphView = new GraphView();
		return newGraphView;
	}
	
	private _init():void
	{
		// Styles
		
        this._gridLineColor = 0xAAAAAA;
		this._gridLineOpacity = 1;
		
		this._defaultTextSize = 16;
		this._axisLength = 1000;
		
		//
		
		this._currentZIndex = 0; // TODO: needs to be reset when new graph data is loaded
		
		this._psTable = {};	// Table for particle systems
		this.dataProvider = null;
        this._graphUtils = new GraphUtils();//GraphUtils.create();
	    
		this._xAxis = XAxisComponent.create(this._axisLength, this._defaultTextSize);
        this._xAxis.updateAxesTextCallback = this._updateAxesText;
        this._xAxis.updateTimeCallback = this._updateTime;
			
		this._yAxis = YAxisComponent.create(this._axisLength, this._defaultTextSize);
        this._yAxis.updateAxesTextCallback = this._updateAxesText;
        this._yAxis.updateTimeCallback = this._updateTime;
		
		this._zAxis = ZAxisComponent.create(this._axisLength, this._defaultTextSize);
        this._zAxis.updateAxesTextCallback = this._updateAxesText;
        this._zAxis.updateTimeCallback = this._updateTime;
		
		this._offsetTop = 0;//window.innerHeight/4*3;
		this._offsetLeft = 0;//window.innerWidth;
		this._animLength = 1800;
		
		this._container = document.createElement( 'div' );
		document.body.appendChild( this._container );
		
		var info = document.createElement( 'div' );
		info.style.position = 'absolute';
		info.style.top = '40px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = 'Drag to spin the graph';
		this._container.appendChild( info );
		
		//this._cameraLookAt = new THREE.Vector3(500, 300, -500);
		//this._cameraLookAt = new THREE.Vector3(0, 0, 0);
		//this._fixedCameraPos = new THREE.Vector3(0, 0, 0);
		//this._dynamicCameraPos = new THREE.Vector3(200, 100, 200);
		
		var distance = 2500;
        this._camera = new THREE.CombinedCamera(window.innerWidth / 2, window.innerHeight / 2, 70, 1, distance, -distance, distance);

		this._scene = new THREE.Scene();

		this._scene.add( this._camera );
		
		this._graphObjContainer = new THREE.Object3D();
		this._scene.add(this._graphObjContainer);
		this._graphObj = new THREE.Object3D();
		this._graphObjContainer.add(this._graphObj);
		this._graphObj.position.x = -this._axisLength /2;
		this._graphObj.position.y = -this._axisLength /2;
        this._graphObj.position.z = this._axisLength / 2;

        // Lights
        this._setupLights();	

		//this._renderer = new THREE.CanvasRenderer();
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setClearColor(0xf0f0f0);
		this._renderer.setSize( window.innerWidth, window.innerHeight );
		
		this._container.appendChild( this._renderer.domElement );

		this._stats = new Stats();
		this._stats.domElement.style.position = 'absolute';
		this._stats.domElement.style.top = '0px';
		this._container.appendChild( this._stats.domElement );

		
		var scope = this;
		window.addEventListener( 'resize', function() { scope._onWindowResize() }, false );
	}

    private _setupLights(): void {

        var ambientLight = new THREE.AmbientLight(Math.random() * 0x10);
        this._scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(Math.random() * 0xffffff);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random() - 0.5;
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        this._scene.add(directionalLight);

        var directionalLight = new THREE.DirectionalLight(Math.random() * 0xffffff);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random() - 0.5;
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        this._scene.add(directionalLight);	
    }

	private _onWindowResize = ():void => 
	{
		this._camera.setSize( window.innerWidth, window.innerHeight );
		this._camera.updateProjectionMatrix();

		this._renderer.setSize( window.innerWidth, window.innerHeight );
	}

	public destroy(): void {

    }

	public enable():void
	{
		this.setOrthographic();
		this.setLens(12);
		this._camera.setZoom(2.5);
		
		this._bottomViewButton = <HTMLButtonElement>document.getElementById("bottomView");
        this._rightViewButton = <HTMLButtonElement>document.getElementById("rightView");
        this._frontViewButton = <HTMLButtonElement>document.getElementById("frontView");
        this._overViewButton = <HTMLButtonElement>document.getElementById("overView");
		
        this._startButton = <HTMLButtonElement>document.getElementById("startBtn");
		
		var scope = this;
		
		this._bottomViewButton.addEventListener( "click", function() { scope.toBottomView(); } );
		this._rightViewButton.addEventListener( "click", function() { scope.toRightView(); } );
		this._frontViewButton.addEventListener( "click", function() { scope.toFrontView(); } );
		this._overViewButton.addEventListener( "click", function() { scope.toOverView(); } );
		
		this._startButton.addEventListener( "click", function() { scope._stepThroughZAxis(); } );
		
		this._targetRotationY = 0;
		this._targetRotationYOnMouseDown = 0;

		this._mouseX = 0;
		this._mouseXOnMouseDown = 0;
		
		this._targetRotationX = 0;
		this._targetRotationXOnMouseDown = 0;

		this._mouseY = 0;
		this._mouseYOnMouseDown = 0;
		
		/*
		//this._cameraValues = {"lineEnvelope": 0, "contentEnvelope": 0};
		this._cameraValues = {camRX: this._camera.rotation.x, 
							  camRY: this._camera.rotation.y, 
							  camRZ: this._camera.rotation.z, 
							  camPX: this._camera.position.x, 
							  camPY:this._camera.position.y, 
							  camPZ:this._camera.position.z};
		*/

		this._graphValues = {rX: 0, rY: 0, rZ: 0};
		
		document.addEventListener( 'mousedown', function(event) { scope._onDocumentMouseDown(event); }, false );
		document.addEventListener( 'touchstart', function(event) { scope._onDocumentTouchStart(event); }, false );
		document.addEventListener( 'touchmove', function(event) { scope._onDocumentTouchMove(event); }, false );
		
		this._renderAxes();
		
		//this.toOverView();
		// GO TO OVERVIEW WITHOUT TRIGGERING AXIS ANIMS
		this._currentView = GraphView.OVER;
	
		this._freeRotate = false;
		
		this._graphValues = {rX: this._graphObjContainer.rotation.x, rY: this._graphObjContainer.rotation.y, rZ: this._graphObjContainer.rotation.z};

        var tween = this._createGraphTween(this._graphValues, { rX: Math.PI / 12, rY: -Math.PI / 4, rZ: 0 }, this._animLength, 0, this._updateTime);//._updateTimeCallback);
		//tween.onComplete(<any>this._completeTimeCallback);
        tween.onComplete(this._completeTime);

		var t = setTimeout( function() { scope._renderGridXZ() }, 5000);
		var t = setTimeout( function() { scope._renderGridYZ() }, 5500);
		var t = setTimeout( function() { scope._renderGridXY() }, 6000);
		var t = setTimeout( function() { scope._plotData() }, 7500);
	}

	public disable():void
	{

	}
	
	public _onDocumentMouseDown = ( event ):void =>
	{
		event.preventDefault();
		
		var scope = this;
		
		this._mouseMoveListener = function(event) { scope._onDocumentMouseMove(event) };
		this._mouseUpListener = function(event) { scope._onDocumentMouseUp(event) };
		this._mouseOutListener = function(event) { scope._onDocumentMouseOut(event) };

		document.addEventListener( 'mousemove', this._mouseMoveListener, false );
		document.addEventListener( 'mouseup', this._mouseUpListener, false );
        document.addEventListener('mouseout', this._mouseOutListener, false);
        //document.addEventListener( 'mouseout', this._mouseDownListener, false );

		this._mouseXOnMouseDown = event.clientX - window.innerWidth / 2;
		this._targetRotationYOnMouseDown = this._targetRotationY;
		
		this._mouseYOnMouseDown = event.clientY - window.innerHeight / 2;
		this._targetRotationXOnMouseDown = this._targetRotationX;
	}

	public _onDocumentMouseMove = ( event ):any =>
	{
		this._mouseX = event.clientX - window.innerWidth / 2;
		this._mouseY = event.clientY - window.innerHeight / 2;
		
		this._targetRotationX = this._targetRotationXOnMouseDown + ( this._mouseY - this._mouseYOnMouseDown ) * 0.005;
		this._targetRotationY = this._targetRotationYOnMouseDown + ( this._mouseX - this._mouseXOnMouseDown ) * 0.005;
	}

	public _onDocumentMouseUp = (event): any =>
    {
		document.removeEventListener( 'mousemove', this._mouseMoveListener, false );
		document.removeEventListener( 'mouseup', this._mouseUpListener, false );
		document.removeEventListener( 'mouseout', this._mouseOutListener, false );
	}

	public _onDocumentMouseOut = ( event ) => 
	{
		document.removeEventListener( 'mousemove', this._mouseMoveListener, false );
		document.removeEventListener( 'mouseup', this._mouseUpListener, false );
		document.removeEventListener( 'mouseout', this._mouseOutListener, false );
	}

	public _onDocumentTouchStart = ( event ) =>
	{
		if ( event.touches.length == 1 )
		{
			event.preventDefault();

			this._mouseXOnMouseDown = event.touches[ 0 ].pageX - window.innerWidth / 2;
			this._targetRotationYOnMouseDown = this._targetRotationY;
			
			this._mouseYOnMouseDown = event.touches[ 0 ].pageY - window.innerHeight / 2;
			this._targetRotationXOnMouseDown = this._targetRotationX;
		}
	}

	public _onDocumentTouchMove = ( event ) =>
	{
		if ( event.touches.length == 1 )
		{
			event.preventDefault();

			this._mouseX = event.touches[ 0 ].pageX - window.innerWidth / 2;
			this._targetRotationY = this._targetRotationYOnMouseDown + ( this._mouseX - this._mouseXOnMouseDown ) * 0.05;
			
			this._mouseY = event.touches[ 0 ].pageY - window.innerHeight / 2;
			this._targetRotationX = this._targetRotationXOnMouseDown + ( this._mouseY - this._mouseYOnMouseDown ) * 0.05;
		}
	}

    public toBottomView():void
	{
		var oldView:string = this._currentView;
		this._currentView = GraphView.BOTTOM;
		
		this._freeRotate = false;
		
		this._graphValues = {rX: this._graphObjContainer.rotation.x, rY: this._graphObjContainer.rotation.y, rZ: this._graphObjContainer.rotation.z};

        var tween = this._createGraphTween(this._graphValues, { rX: 0, rY: -Math.PI / 2, rZ: Math.PI / 2 }, this._animLength, 0, this._updateTime);//this._updateTimeCallback);
		//tween.onComplete(<any>this._completeTimeCallback);
        tween.onComplete(this._completeTime);

		this._xAxis.axisToBottomView();
		this._yAxis.axisToBottomView();
		this._zAxis.axisToBottomView();
		
		//if (this._xAxis) 	this._graphObj.add(this._xAxis.container);
		//if (this._yAxis) 	this._graphObj.remove(this._yAxis);
		//if (this._zAxis) 	this._graphObj.add(this._zAxis);
	}
	
	public toRightView():void
	{
		this._currentView = GraphView.RIGHT;
		
		this._freeRotate = false;
		
		this._graphValues = {rX: this._graphObjContainer.rotation.x, rY: this._graphObjContainer.rotation.y, rZ: this._graphObjContainer.rotation.z};

        var tween = this._createGraphTween(this._graphValues, { rX: 0, rY: -Math.PI / 2, rZ: 0 }, this._animLength, 0, this._updateTime);// this._updateTimeCallback);
		//tween.onComplete(<any>this._completeTimeCallback);
        tween.onComplete(this._completeTime);

		this._xAxis.axisToDefaultView();
		this._yAxis.axisToRightView();
		this._zAxis.axisToRightView();
		
		//if (this._xAxis) 	this._graphObj.remove(this._xAxis.container);
		//if (this._yAxis) 	this._graphObj.add(this._yAxis);
		//if (this._zAxis) 	this._graphObj.add(this._zAxis);
	}
	
	public toFrontView():void
	{
		var oldView = this._currentView;
		this._currentView = GraphView.FRONT;
		
		this._freeRotate = false;
		
		this._graphValues = {rX: this._graphObjContainer.rotation.x, rY: this._graphObjContainer.rotation.y, rZ: this._graphObjContainer.rotation.z};

        var tween = this._createGraphTween(this._graphValues, { rX: 0, rY: 0, rZ: 0 }, this._animLength, 0, this._updateTime);//this._updateTimeCallback);
		//tween.onComplete(<any>this._completeTimeCallback);
        tween.onComplete(this._completeTime);

		this._xAxis.axisToDefaultView();
		this._yAxis.axisToDefaultView();
		this._zAxis.axisToRightView();
		
		//if (this._xAxis) 	this._graphObj.add(this._xAxis.container);
		//if (this._yAxis) 	this._graphObj.add(this._yAxis);
		//if (this._zAxis) 	this._graphObj.remove(this._zAxis);
	}
	
	public toOverView():void
	{
		this._currentView = GraphView.OVER;
	
		this._freeRotate = false;
		
		this._graphValues = {rX: this._graphObjContainer.rotation.x, rY: this._graphObjContainer.rotation.y, rZ: this._graphObjContainer.rotation.z};

        var tween = this._createGraphTween(this._graphValues, { rX: Math.PI / 12, rY: -Math.PI / 4, rZ: 0 }, this._animLength, 0, this._updateTime);//this._updateTimeCallback);
		//tween.onComplete(<any>this._completeTimeCallback);
        tween.onComplete(this._completeTime);

		this._xAxis.axisToDefaultView();
		this._yAxis.axisToDefaultView();
		this._zAxis.axisToDefaultView();
		
		//if (this._xAxis) 	this._graphObj.add(this._xAxis.container);
		//if (this._yAxis) 	this._graphObj.add(this._yAxis);
		//if (this._zAxis) 	this._graphObj.add(this._zAxis);
	}
	// Callback
	public _updateTime = ():void => 
	{
		/*
		this._camera.rotation.x = this._cameraValues.camRX;
		this._camera.rotation.y = this._cameraValues.camRY;
		this._camera.rotation.z = this._cameraValues.camRZ;
		
		this._camera.position.x = this._cameraValues.camPX;
		this._camera.position.y = this._cameraValues.camPY;
		this._camera.position.z = this._cameraValues.camPZ;
		*/
		this._graphObjContainer.rotation.x = this._graphValues.rX;
		this._graphObjContainer.rotation.y = this._graphValues.rY;
		this._graphObjContainer.rotation.z = this._graphValues.rZ;
		
		this._targetRotationY = this._graphObjContainer.rotation.y;

		// Animate X, Y, Z Axes
		if ( this._axesObjects.animationValues )
		{
			var axes = ["x", "y", "z"];
			var lines = this._axesObjects.animationValues.lines;
			if ( lines )
			{
				for ( var i = 0; i < lines.length; i ++ )
				{
					var axis = axes[i];
					var len = lines[i].axisLength;
					var line = this._axesObjects.lines[i];
					var vector3 = line.geometry.vertices[1];
					vector3[axis] = len;
					line.geometry.verticesNeedUpdate = true;
				}
			}
			
			this._updateGridLines(this._axesObjects.gridXY, this._axesObjects.animationValues.gridXY);
			this._updateGridLines(this._axesObjects.gridYZ, this._axesObjects.animationValues.gridYZ);
			this._updateGridLines(this._axesObjects.gridXZ, this._axesObjects.animationValues.gridXZ);
		}
		
		this._xAxis.updateAxis();
		this._yAxis.updateAxis();
		this._zAxis.updateAxis();
    }
    // Callback
	public _updateAxesText = (): void => {
        this._xAxis.updateAxisText();
        this._yAxis.updateAxisText();
        this._zAxis.updateAxisText();
    }
	// Callback
	public _completeTime = (): void => {
        this._freeRotate = true;
    }
	
	public _updateGridLines(gridObj, gridAnimObj):void
	{
		if ( gridAnimObj )
		{
			var aLines = gridAnimObj.aLines;
			
			for ( var i = 0; i < aLines.length; i ++ )
			{
				if (!aLines[i]) continue;	// debugging
				
				var len = aLines[i].axisLength;
				
				var line = gridObj.aLines[i];
				var vector3 = line.geometry.vertices[1];
				vector3[gridAnimObj.aAxis] = len;
				line.geometry.verticesNeedUpdate = true;
			}
			
			var bLines = gridAnimObj.bLines;
			
			for ( var i = 0; i < bLines.length; i ++ )
			{
				if (!bLines[i]) continue;	// debugging
				
				var len = bLines[i].axisLength;
				
				var line = gridObj.bLines[i];
				var vector3 = line.geometry.vertices[1];
				vector3[gridAnimObj.bAxis] = len;
				line.geometry.verticesNeedUpdate = true;
			}				
		}	
	}
	
	public setFov( fov:number ):void
	{
		this._camera.setFov( fov );
	}

	public setLens = function setLens( lens ):void
	{
		// try adding a tween effect while changing focal length, and it'd be even cooler!
		var fov = this._camera.setLens( lens );
	}

	public setOrthographic():void 
	{
		this._camera.toOrthographic();
	}

	public setPerspective():void 
	{
		this._camera.toPerspective();
	}	
	
	public _animate = () =>
	{
		var scope = this;
		requestAnimationFrame( function() { scope._animate() } );

		this._render();
        this._stats.update();

        TWEEN.update();
	}

	public _render():void 
	{
		if ( this._freeRotate )
		{
			//this._graphObjContainer.rotation.x += ( this._targetRotationX - this._graphObjContainer.rotation.x ) * 0.05;
			this._graphObjContainer.rotation.y += ( this._targetRotationY - this._graphObjContainer.rotation.y ) * 0.05;

			//this._camera.lookAt( this._cameraLookAt );
		}
	
		this._renderer.render( this._scene, this._camera );
	}

    public setDataProvider(data): void {
        var numSteps = 20;

        this._dataProvider = data;

        var zMin = 1990;
        //var zMin = data.time.minYear;
        var zMax = 2010;
        //var zMax = data.time.maxYear;

        this._axisTitles = {};
        this._axisTitles.x = "gdpPerCapita";
        this._axisTitles.y = "hivPrevalence";
        //this._axisTitles.y = "lifeExpectancy";
        this._axisTitles.z = "time";
        this._axisTitles.xTitle = "GDP Per Capita (2005 Int $)";
        this._axisTitles.yTitle = "Estimated HIV Prevalence % (Ages 15-49)";
        //this._axisTitles.yTitle = "Life Expectancy at Birth";
        this._axisTitles.zTitle = "Time";

        var xAxisLog = true;
        var yAxisLog = true;
        var zAxisLog = false;

        // Compute Axes
        if (xAxisLog) {
            this._xAxis.data = this._graphUtils.mapToAxisLogarithmic(data[this._axisTitles.x].minValue, data[this._axisTitles.x].maxValue, 0, 10);
            //var vals  = this._xAxis.data;
            //console.log("X-AXIS input: minVal "+data[this._axisTitles.x].minValue+" maxVal "+data[this._axisTitles.x].maxValue+" numFractionalSteps "+0+" base "+10);
            //console.log("X-AXIS minVal "+vals.minVal+" maxVal "+vals.maxVal+" numSteps "+vals.numSteps+" numLogSteps "+vals.numLogSteps+" numFractionalSteps "+vals.numFractionalSteps+" base "+vals.base+" baseLog "+vals.baseLog); 
        } else {
            this._xAxis.data = this._graphUtils.mapToAxisLinear(data[this._axisTitles.x].minValue, data[this._axisTitles.x].maxValue, numSteps, false);
        }

        if (yAxisLog) {
            this._yAxis.data = this._graphUtils.mapToAxisLogarithmic(data[this._axisTitles.y].minValue, data[this._axisTitles.y].maxValue, 2, 10);
        } else {
            this._yAxis.data = this._graphUtils.mapToAxisLinear(data[this._axisTitles.y].minValue, data[this._axisTitles.y].maxValue, numSteps, true);
        }

        if (zAxisLog) {
            this._zAxis.data = this._graphUtils.mapToAxisLogarithmic(data[this._axisTitles.z].minValue, data[this._axisTitles.z].maxValue, 0, 10);
        } else {
            this._zAxis.data = this._graphUtils.mapToAxisLinear(zMin, zMax, numSteps, true);
        }

        //this._graphUtils.getLogOfBase(100, 10, true);

        // RENDER
        this.enable();
        //console.log("Z (Time) axis minVal "+this._zAxis.data.minVal+" maxVal "+this._zAxis.data.maxVal);
    }

	private _plotData():void
	{
		// draw line for country
		//this._plotData(data.countries["Lesotho"]);
		//					America	 East Asia  Europe    Mid East  S. Asia  S. Africa
		var regionColors = [0xe5ff2f, 0xff2f2f, 0xff982f, 0x68ff5f, 0x2fbfe5, 0x3f4fff];
		this._regionColors = {};
		for ( var i = 0; i < this._dataProvider.regions.length; i ++ )
		{
			var region = this._dataProvider.regions[i];
			var color = new THREE.Color();
			//color.setHSV(Math.random(), 1.0, 1.0);
			color.setHex(regionColors[i]);
			this._regionColors[region.name] = color;
		}
		
		this._linesData = { countriesTable: {}, countriesArray: [] };
		
		for ( var countryName in this._dataProvider.countries ) 
		{
			var country = this._dataProvider.countries[countryName];
			color = this._regionColors[country.region.name];
			//var color = new THREE.Color();
			//color.setHSV(Math.random(), 1.0, 1.0);
			var lineValues = this._plotLine(country, color, this._axisTitles.x, this._axisTitles.y);
			lineValues.color = color;
			
			this._linesData.countriesTable[countryName] = lineValues;
			this._linesData.countriesArray.push(lineValues);
		}
		
		//this._renderAllLines();
		//this._renderLineByLine();
		//this._stepThroughZAxis();
		this._renderZSlice();
	}
	
	// Renders all line immediately
	private _renderAllLines():void
	{
		for ( var countryName in this._linesData.countriesTable ) 
		{
			var lineValues = this._linesData.countriesTable[countryName];
			
			if (!lineValues.line) {
				lineValues.line = this._createLine(lineValues.lineGeom, lineValues.color);
				this._graphObj.add( lineValues.line );
			}
			
			if (!lineValues.particles) {
				lineValues.particles = this._createParticles(lineValues.particleGeom);
				this._graphObj.add(lineValues.particles);
			}
		}
	}
	
	private _stepThroughZAxis():void
	{
		clearInterval(this._renderDataInterval);
		
		this._currentZIndex = 0;
		
		var scope = this;
		this._renderDataInterval = setInterval( function() { scope._renderZSlice() }, 1000);
		
		//scope._renderZSlice();
	}
	
	
	private _renderZSlice():void
	{
		// Each country needs it's own particle system (PS)
		// The PS will contain only one particle, which will animate it's position and size over time (all particles in a PS must be the same size)
		// The PS's will be stored in a table using the country name as a key.
		// The object containing the PS will also contain other data, e.g. animation data: targetSize and a targetPosition
		// An object will be added to the table for each country as required
		// On each _renderZSlice() call, each particle will be prompted to tween to its target data
		// The tweens will take slightly less time to complete than the time taken between _renderZSlice() calls
		
		console.log("_renderZSlice "+this._currentZIndex);
		
		var maxNumInfected = 0;
		var maxInfectedCountry = "";
		
		//Loop through countries
		for ( var countryName in this._linesData.countriesTable ) 
		{
			// get the line data (geom, color) for the country
			var lineValues = this._linesData.countriesTable[countryName];

			var vertices = lineValues.particleGeom.vertices;
			
			// get the vector3 point at the currentParticleIndex (this step on the Z slice)
			var vector3 = vertices[this._currentZIndex];
			// If the country has a particle for this step, add it to the current geom and step the index.
			// If it doesn't, skip the country.
			if ( vector3 ) 
			{
				var country = this._dataProvider.countries[countryName];
				var zVal = lineValues.pointsData[this._currentZIndex];
				var yVal = lineValues.z[zVal].y;
				var pop = this._dataProvider.countries[countryName].population[zVal];
				var numInfected = Math.round(yVal / 100 * pop);
				if ( numInfected > maxNumInfected ) {
					maxNumInfected = numInfected;
					maxInfectedCountry = countryName;
				}
			}
		}
		
		console.log("max infected "+maxInfectedCountry+" = "+maxNumInfected);
		
		
		var maxVerticesLength = 0;
	
		//Loop through countries
		for ( var countryName in this._linesData.countriesTable ) 
		{
			// get the line data (geom, color) for the country
			var lineValues = this._linesData.countriesTable[countryName];

			var vertices = lineValues.particleGeom.vertices;
			if ( vertices.length > maxVerticesLength ) {
				maxVerticesLength = vertices.length;
			}
			
			// get the vector3 point at the currentParticleIndex (this step on the Z slice)
			var vector3 = vertices[this._currentZIndex];
			// If the country has a particle for this step, add it to the current geom and step the index.
			// If it doesn't, skip the country.
			if ( vector3 ) 
            {
                var geom: THREE.Geometry;
				// Create table for particle systems
				if (!this._psTable[countryName]) {
					geom = new THREE.Geometry();
					geom.colors = [lineValues.particleGeom.colors[this._currentZIndex]];
					geom.vertices.push(vector3.clone());
					
                    var psObj:any = this._psTable[countryName] = {};
					psObj.pSystem = this._createParticles(geom);
					this._graphObj.add(psObj.pSystem);
					
					//psObj.pSystem.material.size = Math.random() * 20 + 10;
				} else {
					var psObj = this._psTable[countryName];
					geom = psObj.pSystem.geometry;
					var currVector3 = geom.vertices[0];
					currVector3.x = vector3.x;
					currVector3.y = vector3.y;
					currVector3.z = vector3.z;
					
					geom.verticesNeedUpdate = true;
				}
				
				var country = this._dataProvider.countries[countryName];
				var zVal = lineValues.pointsData[this._currentZIndex];
				var xVal = lineValues.z[zVal].x;
				var yVal = lineValues.z[zVal].y;
				var pop = this._dataProvider.countries[countryName].population[zVal];
				var infected = Math.round(yVal / 100 * pop);
				//console.log(countryName+" year "+zVal+" gdp "+xVal+" pcHIV "+yVal+" pop "+pop+" infected "+infected);
				var minSize = 8;
				var size = minSize;
				
				if ( infected ) {
					var pcOfMax = infected / maxNumInfected;
					size = pcOfMax * 50;
				}
				
				size = Math.max(minSize, size);
				
				psObj.pSystem.material.size = size;
				
			} else {
				console.log("NO VECTOR "+countryName);
			}
		}

		if ( this._currentZIndex < maxVerticesLength + 1 )
		{
			this._currentZIndex ++;			
		} else {
			clearInterval(this._renderDataInterval);
		}
	}
	
	// Renders each line one by one, point by point
	private _renderLineByLine():void
	{
		this._countryCount = 0;
		this._currentZIndex = 0;
		
		var scope = this;
		this._renderDataInterval = setInterval( function() { scope._renderLineByLineInterval() }, 40);
	}
	
	private _renderLineByLineInterval():void
	{
		if ( this._countryCount == this._linesData.countriesArray.length - 1 )
		{
			clearInterval(this._renderDataInterval);
		}
		
		//var lineValues = this._linesData.countriesTable["Lesotho"];//countryName];
		var lineValues = this._linesData.countriesArray[this._countryCount];//countryName];
		
		if ( this._currentZIndex < lineValues.particleGeom.vertices.length + 1 ) 
		{
			lineValues.particleGeomCurrent = new THREE.Geometry();
			lineValues.particleGeomCurrent.colors = lineValues.particleGeom.colors;
				
			lineValues.lineGeomCurrent = new THREE.Geometry();
			
			for ( var i = 0; i < this._currentZIndex; i ++ )
			{
				var vector3 = lineValues.lineGeom.vertices[i];
				lineValues.lineGeomCurrent.vertices.push(vector3);
				
				var vector3 = lineValues.particleGeom.vertices[i];
				lineValues.particleGeomCurrent.vertices.push(vector3);
			}
			
			if (lineValues.line)	this._graphObj.remove( lineValues.line );
			lineValues.line = this._createLine(lineValues.lineGeomCurrent, lineValues.color);
			this._graphObj.add( lineValues.line );
			
			if (lineValues.particles)	this._graphObj.remove( lineValues.particles );
			lineValues.particles = this._createParticles(lineValues.particleGeomCurrent);
			this._graphObj.add(lineValues.particles);

			this._currentZIndex ++;
		} else {
			this._currentZIndex = 0;
			this._countryCount ++;
		}
	}
	
	private _plotLine(data, color, xTitle, yTitle):any
	{
		var minZ = this._zAxis.data.minVal;
		var maxZ = this._zAxis.data.maxVal;
		
		// massage data
		// Z-Axis is the axis that X and Y data are plotted against.
		// Loop through the X and Y axes data for the line, storing them on a new object in terms of Z.
		
		var lineValues:any = { z: {} };
		for ( var zVal in data[xTitle] )
		{
			if ( zVal < minZ || zVal > maxZ ) continue;
			
			var value = data[xTitle][zVal];
			
			if (!lineValues.z[zVal]) {
				lineValues.z[zVal] = {};
			}
			
			lineValues.z[zVal].x = value;
		}
		
		for ( var zVal in data[yTitle] )
		{
			if ( zVal < minZ || zVal > maxZ ) continue;
			
			var value = data[yTitle][zVal];
			if (!lineValues.z[zVal]) {
				lineValues.z[zVal] = {};
			}
			
			lineValues.z[zVal].y = value;
		}
		
		var colors = [];
		
		//init Particles
		var lineGeom = new THREE.Geometry();
		var particleGeom = new THREE.Geometry();
		var pointsData = [];

		var prevYValue = 0;
		var prevXValue = 0;
		var i = 0;
		
		for ( var z in lineValues.z )
		{
			var x = lineValues.z[z].x;
			var y = lineValues.z[z].y;
			//console.log(z+" = "+value);
					
			if (!x) 	x = prevXValue;
			else		prevXValue = x;
			if (!y) 	y = prevYValue;
			else		prevYValue = y;
			
			
			// XPOS
			if ( this._xAxis.data.logarithmic ) {
				var xpos = this._graphUtils.getPosAlongAxisLogarithmic( x, this._axisLength, this._xAxis.data.numSteps, this._xAxis.data.base, this._xAxis.data.baseLog, this._xAxis.data.numFractionalSteps );
			} else  {
				var ratio = this._graphUtils.getRatioAlongAxisLinear( x, this._xAxis.data.minVal, this._xAxis.data.maxVal );
				var xpos = ratio * this._axisLength;			
			}

			// YPOS
			if ( this._yAxis.data.logarithmic ) {
				var ypos = this._graphUtils.getPosAlongAxisLogarithmic( y, this._axisLength, this._yAxis.data.numSteps, this._yAxis.data.base, this._yAxis.data.baseLog, this._yAxis.data.numFractionalSteps );
			} else  {			
				var ratio = this._graphUtils.getRatioAlongAxisLinear( y, this._yAxis.data.minVal, this._yAxis.data.maxVal );
				var ypos = ratio * this._axisLength;
			}			

			// ZPOS
			if ( this._zAxis.data.logarithmic ) {
				var zpos = this._graphUtils.getPosAlongAxisLogarithmic( z, this._axisLength, this._zAxis.data.numSteps, this._zAxis.data.base, this._zAxis.data.baseLog, this._zAxis.data.numFractionalSteps );
			} else  {
				var ratio = this._graphUtils.getRatioAlongAxisLinear( z, this._zAxis.data.minVal, this._zAxis.data.maxVal );
				var zpos = -ratio * this._axisLength;
			}
			
			var pos = new THREE.Vector3( xpos, ypos, zpos );
			particleGeom.vertices.push(pos);
			lineGeom.vertices.push(pos);
			
			pointsData.push(z);
			
			colors.push(color);		
			i ++;
		}
		
		particleGeom.colors = colors;
		
		lineValues.lineGeom = lineGeom;
		lineValues.particleGeom = particleGeom;
		lineValues.pointsData = pointsData;
		
		//lineValues.color = color;
		
		return lineValues;
	}
	
	private _createLine(geom, color):THREE.Line
	{
		// lines
		var line = new THREE.Line( geom, new THREE.LineBasicMaterial( { color: color.getHex(), opacity: 0.5 } ) );
		
		return line;
	}
	
	private _createParticles(geom)
	{
		//create one shared material (per particle system)
        var sprite = THREE.ImageUtils.loadTexture("../../files/img/disc2.png");
        //var params = new THREE.ParticleSystemMaterialParameters();
		var material = new THREE.ParticleSystemMaterial({
			size: 5,
			sizeAttenuation: false,
			map: sprite,
			//blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			vertexColors: true //allows 1 color per particle
		});
		
		//init particle system
		var particles = new THREE.ParticleSystem(geom, material);
		particles.sortParticles = false;
		
		return particles;
	}
	
	// RENDER AXES =================================

	private _createGraphTween(animObj, animTargObj, length, delay, updateCallBack):TWEEN.Tween
	{
        var graphTween = new TWEEN.Tween(animObj);
		graphTween.to(animTargObj, length);
		graphTween.delay(delay);
		graphTween.easing(TWEEN.Easing.Quadratic.InOut);
		if (updateCallBack)		graphTween.onUpdate(updateCallBack);
		graphTween.start();
		
		return graphTween;
	}	
	
	private _renderAxes():void
	{
		var axisObjs = [{ lineColor:0xff0000, endValue:this._axisLength},
						{ lineColor:0x00ff00, endValue:this._axisLength},
						{ lineColor:0x0000ff, endValue:-this._axisLength}];
		
		var delay = 1000;
		
		this._axesObjects = { lines: [], 
							  gridXY: { aLines: [], bLines: [] }, 
							  gridYZ: { aLines: [], bLines: [] }, 
							  gridXZ: { aLines: [], bLines: [] },
							  animationValues: { lines: [],
												 gridXY: { aLines: [], bLines: [], aAxis: "y", bAxis: "x" }, 
												 gridYZ: { aLines: [], bLines: [], aAxis: "z", bAxis: "y" }, 
												 gridXZ: { aLines: [], bLines: [], aAxis: "z", bAxis: "x" } } };
		
		for ( var i = 0; i < 3; i ++ )
		{
			var axisObj = axisObjs[i];
			var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );

			var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: axisObj.lineColor, opacity: 1 } ) );
			
			this._graphObj.add( line );
			this._axesObjects.lines.push(line);
			
			var animObj = this._axesObjects.animationValues.lines[i];
			if (!animObj) {
				animObj = this._axesObjects.animationValues.lines[i] = { axisLength:0 };
			}			

            // Animate in X,Y,Z Axes
            this._createGraphTween(animObj, { axisLength: axisObj.endValue }, this._animLength, delay, this._updateTime);//this._updateTimeCallback);
			
			delay += 500;		
		}

		this._xAxis.renderAxis(delay, this._axisTitles.xTitle, this._graphObj);
		this._yAxis.renderAxis(delay += 500, this._axisTitles.yTitle, this._graphObj);
		this._zAxis.renderAxis(delay += 500, this._axisTitles.zTitle, this._graphObj);
	}
	
	// RENDER GRIDS =========================================
	
	private _renderGrid( numStepsA, linePosFuncA, numStepsB, linePosFuncB, gridObj, animInitObj ):void
	{		
		var stepSize = this._axisLength / numStepsA;
		var delay = 0;
		var delayStep = 50;
		
		// Animate in XY, YZ, XZ grids
		for ( var i = 1; i <= numStepsA; i ++ ) 
		{
			var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		
			var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: this._gridLineColor, opacity: this._gridLineOpacity } ) );
			line.position = linePosFuncA( i * stepSize );
			
			this._graphObj.add( line );
			gridObj.aLines.push(line);
			
			var animObj = {axisLength: 0};
			animInitObj.aLines.push( animObj );

            this._createGraphTween(animObj, { axisLength: this._axisLength }, 500, delay, this._updateTime);//this._updateTimeCallback);
						
			delay += delayStep;
		}
		
		var stepSize = this._axisLength / numStepsB;	
		delay = 0;
		
		for ( var i = 1; i <= numStepsB; i ++ ) 
		{
			var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			
			var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: this._gridLineColor, opacity: this._gridLineOpacity } ) );
			line.position = linePosFuncB( i * stepSize );
			
			this._graphObj.add( line );
			gridObj.bLines.push(line);
			
			var animObj = {axisLength: 0};
			animInitObj.bLines.push( animObj );

            this._createGraphTween(animObj, { axisLength: this._axisLength }, 500, delay, this._updateTime);//this._updateTimeCallback);
						
			delay += delayStep;			
		}
	}

	private _gridXYLinePosXLines( step:number ) {	return new THREE.Vector3( step, 0, -this._axisLength );		}
	private _gridXYLinePosYLines( step:number ) {	return new THREE.Vector3( 0, step, -this._axisLength );		}
	
	private _gridYZLinePosYLines( step:number ) {	return new THREE.Vector3( 0, step, -this._axisLength );		}
	private _gridYZLinePosZLines( step:number ) {	return new THREE.Vector3( 0, 0, -step );					}
	
	private _gridXZLinePosXLines( step:number ) {	return new THREE.Vector3( step, 0, -this._axisLength );		}
	private _gridXZLinePosZLines( step:number ) {	return new THREE.Vector3( 0, 0, -step );					}
	
	private _renderGridXY = function _renderGridXY():void
	{
		var scope = this;
		this._renderGrid( this._xAxis.data.numSteps, 
						  function(step) { return scope._gridXYLinePosXLines(step); },
						  this._yAxis.data.numSteps, 
						  function(step) { return scope._gridXYLinePosYLines(step); },
						  this._axesObjects.gridXY, this._axesObjects.animationValues.gridXY );
	}
	
	private _renderGridYZ():void
	{
		var scope = this;
		this._renderGrid( this._yAxis.data.numSteps, 
						  function(step) { return scope._gridYZLinePosYLines(step); },
						  this._zAxis.data.numSteps, 
						  function(step) { return scope._gridYZLinePosZLines(step); },
						  this._axesObjects.gridYZ, this._axesObjects.animationValues.gridYZ );
	}
	
	private _renderGridXZ():void
	{
		var scope = this;
		this._renderGrid( this._xAxis.data.numSteps, 
						  function(step) { return scope._gridXZLinePosXLines(step); },
						  this._zAxis.data.numSteps, 
						  function(step) { return scope._gridXZLinePosZLines(step); },
						  this._axesObjects.gridXZ, this._axesObjects.animationValues.gridXZ );
	}
}