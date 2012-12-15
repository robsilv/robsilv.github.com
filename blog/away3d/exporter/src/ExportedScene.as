// Works with Away3D "Gold" release (revision 7).
//Save this file as "ExportedScene.as" within an ActionScript project which has access to the Away3D library.
// Publish the file as the project's main application and your scene will appear.
package
{
	import away3d.cameras.Camera3D;
	import away3d.containers.*;
	import away3d.controllers.HoverController;
	import away3d.entities.*;
	import away3d.lights.*;
	import away3d.materials.*;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.primitives.*;
	
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.*;
	import flash.geom.Vector3D;
	
	public class ExportedScene extends Sprite
	{
		private var scene:Scene3D;
		private var view:View3D;
		
		private var camera:Camera3D;
		private var cameraController:HoverController;
		
		//navigation variables
		private var move:Boolean = false;
		private var lastPanAngle:Number;
		private var lastTiltAngle:Number;
		private var lastMouseX:Number;
		private var lastMouseY:Number;
		private var tiltSpeed:Number = 2;
		private var panSpeed:Number = 2;
		private var distanceSpeed:Number = 1000;
		private var tiltIncrement:Number = 0;
		private var panIncrement:Number = 0;
		private var distanceIncrement:Number = 0;
		
		public function ExportedScene()
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			
			view = new View3D();
			scene = view.scene;
			addChild(view);
			
			camera = view.camera;
			camera.position = new Vector3D(800,800,800);
			camera.lookAt(new Vector3D(0,0,0));
			cameraController = new HoverController(camera);
			
			addEventListener(Event.ENTER_FRAME, onEnterFrame);
			view.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			view.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			stage.addEventListener(Event.RESIZE, onResize);
			onResize();
			
			var geometries:Array = [];
			var materials:Array = [];
			var segmentSets:Array = [];
			var lights:Array = [];
			var cameras:Array = [];
			var containers:Array = [];
			var meshes:Array = [];
			var wireframes:Array = [];
			
			var lightPicker:StaticLightPicker = new StaticLightPicker(lights);
			
			// Geometries
			var conegeometry0:ConeGeometry = new ConeGeometry(50,100,16,1,true,true);
			geometries.push(conegeometry0);
			
			var cubegeometry1:CubeGeometry = new CubeGeometry(100,100,100,1,1,1,true);
			geometries.push(cubegeometry1);
			
			var cylindergeometry2:CylinderGeometry = new CylinderGeometry(50,50,100,16,1,true,true,true,true);
			geometries.push(cylindergeometry2);
			
			var planegeometry3:PlaneGeometry = new PlaneGeometry(100,100,1,1,true);
			geometries.push(planegeometry3);
			
			var regularpolygongeometry4:RegularPolygonGeometry = new RegularPolygonGeometry(100,16,true);
			geometries.push(regularpolygongeometry4);
			
			var spheregeometry5:SphereGeometry = new SphereGeometry(50,16,12,true);
			geometries.push(spheregeometry5);
			
			var torusgeometry6:TorusGeometry = new TorusGeometry(50,50,16,8,true);
			geometries.push(torusgeometry6);
			
			// Materials
			var colormaterial0:ColorMaterial = new ColorMaterial(0x88e79e,1);
			colormaterial0.lightPicker = lightPicker;
			materials.push(colormaterial0);
			
			// Segments
			segmentSets[0] = [];
			
			var linesegment0:LineSegment = new LineSegment(new Vector3D(300, 0, 150),new Vector3D(400, 0, 150),0x7a0254,0x923eb,1);
			segmentSets[0].push(linesegment0);
			
			// Lights
			var directionallight0:DirectionalLight = new DirectionalLight();
			directionallight0.ambient = 0.1;
			directionallight0.castsShadows = true;
			directionallight0.color = 0xffffff;
			directionallight0.ambientColor = 0xffffff;
			directionallight0.diffuse = 1;
			directionallight0.specular = 1;
			directionallight0.rotationX = 65;
			directionallight0.rotationY = 25;
			lights.push(directionallight0);
			scene.addChild(directionallight0);
			
			lightPicker.lights = lights.slice();
			
			// Cameras
			var camera3d0:Camera3D = new Camera3D();
			camera3d0.position = new Vector3D(431.67, 445.23, -854.94);
			camera3d0.rotationX = 32.43;
			camera3d0.rotationY = -28.74;
			cameras.push(camera3d0);
			scene.addChild(camera3d0);
			
			// Wireframes
			var wireframecube0:WireframeCube = new WireframeCube(100,100,100,0xffffff,1);
			wireframecube0.position = new Vector3D(-300, 0, 150);
			wireframes.push(wireframecube0);
			scene.addChild(wireframecube0);
			
			var wireframecylinder1:WireframeCylinder = new WireframeCylinder(50,50,100,16,1,0xffffff,1);
			wireframecylinder1.position = new Vector3D(-150, 0, 150);
			wireframes.push(wireframecylinder1);
			scene.addChild(wireframecylinder1);
			
			var wireframeplane2:WireframePlane = new WireframePlane(100,100,10,10,0xffffff,1,"yz");
			wireframeplane2.position = new Vector3D(0, 0, 150);
			wireframes.push(wireframeplane2);
			scene.addChild(wireframeplane2);
			
			var wireframesphere3:WireframeSphere = new WireframeSphere(50,16,12,0xffffff,1);
			wireframesphere3.position = new Vector3D(150, 0, 150);
			wireframes.push(wireframesphere3);
			scene.addChild(wireframesphere3);
			
			// SegmentSets
			var segmentset0:SegmentSet = new SegmentSet();
			segmentset0.addSegment(segmentSets[0][0]);
			segmentSets.push(segmentset0);
			scene.addChild(segmentset0);
			
			// Meshes
			var mesh0:Mesh = new Mesh(geometries[0]);
			mesh0.position = new Vector3D(-525, 0, 0);
			mesh0.material = materials[0];
			meshes.push(mesh0);
			scene.addChild(mesh0);
			
			var mesh1:Mesh = new Mesh(geometries[1]);
			mesh1.position = new Vector3D(-375, 0, 0);
			mesh1.material = materials[0];
			meshes.push(mesh1);
			scene.addChild(mesh1);
			
			var mesh2:Mesh = new Mesh(geometries[2]);
			mesh2.position = new Vector3D(-225, 0, 0);
			mesh2.material = materials[0];
			meshes.push(mesh2);
			scene.addChild(mesh2);
			
			var mesh3:Mesh = new Mesh(geometries[3]);
			mesh3.position = new Vector3D(-75, 0, 0);
			mesh3.material = materials[0];
			meshes.push(mesh3);
			scene.addChild(mesh3);
			
			var mesh4:Mesh = new Mesh(geometries[4]);
			mesh4.position = new Vector3D(75, 0, 0);
			mesh4.material = materials[0];
			meshes.push(mesh4);
			scene.addChild(mesh4);
			
			var mesh5:Mesh = new Mesh(geometries[5]);
			mesh5.position = new Vector3D(225, 0, 0);
			mesh5.material = materials[0];
			meshes.push(mesh5);
			scene.addChild(mesh5);
			
			var mesh6:Mesh = new Mesh(geometries[6]);
			mesh6.position = new Vector3D(375, 0, 0);
			mesh6.material = materials[0];
			meshes.push(mesh6);
			scene.addChild(mesh6);
		}
		
		private function onEnterFrame(event:Event):void
		{
			if (move) {
				cameraController.panAngle = 0.3*(stage.mouseX - lastMouseX) + lastPanAngle;
				cameraController.tiltAngle = 0.3*(stage.mouseY - lastMouseY) + lastTiltAngle;
			}
			
			cameraController.panAngle += panIncrement;
			cameraController.tiltAngle += tiltIncrement;
			cameraController.distance += distanceIncrement;
			
			view.render();
		}
		
		private function onResize(event:Event = null):void
		{
			view.width = stage.stageWidth;
			view.height = stage.stageHeight;
		}
		
		private function onMouseDown(event:MouseEvent):void
		{
			move = true;
			lastPanAngle = cameraController.panAngle;
			lastTiltAngle = cameraController.tiltAngle;
			lastMouseX = stage.mouseX;
			lastMouseY = stage.mouseY;
			stage.addEventListener(Event.MOUSE_LEAVE, onStageMouseLeave);
		}
		
		private function onMouseUp(event:MouseEvent):void
		{
			move = false;
			stage.removeEventListener(Event.MOUSE_LEAVE, onStageMouseLeave);
		}
		
		private function onStageMouseLeave(event:Event):void
		{
			move = false;
			stage.removeEventListener(Event.MOUSE_LEAVE, onStageMouseLeave);
		}
	}
}