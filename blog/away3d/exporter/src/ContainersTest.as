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
	import away3d.tools.serialize.AS3Serializer;
	import away3d.tools.serialize.ISerializer;
	import away3d.tools.serialize.ThreeJSSerializer;
	
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.*;
	import flash.geom.Vector3D;
	
	import ui.ExporterInterface;
	
	public class ContainersTest extends Sprite
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
		
		public function ContainersTest()
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			
			view = new View3D();
			scene = view.scene;
			addChild(view);
			
			addChild(new ExporterInterface(scene));
			
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
			var lights:Array = [];
			var cameras:Array = [];
			var containers:Array = [];
			var meshes:Array = [];
			
			var lightPicker:StaticLightPicker = new StaticLightPicker(lights);
			
			// Materials
			var colormaterial0:ColorMaterial = new ColorMaterial(0x88e79e,1);
			colormaterial0.lightPicker = lightPicker;
			materials.push(colormaterial0);
			
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
			
			// Geometries
			geometries.push(new ConeGeometry());
			geometries.push(new CubeGeometry());
			geometries.push(new CylinderGeometry());
			
			var container:ObjectContainer3D = new ObjectContainer3D();
			container.x = 100;
			containers.push(container);
			scene.addChild(container);
			
			container = new ObjectContainer3D();
			container.y = 100;
			containers.push(container);
			containers[0].addChild(container);
			
			container = new ObjectContainer3D();
			container.z = 100;
			containers.push(container);
			containers[1].addChild(container);
			
			
			var padding:uint = 150;
			var xpos:int = -(padding * geometries.length) / 2;
			var ypos:int = 0;
			var zpos:int = 0;
			
			// Meshes
			for ( var i:uint = 0; i < geometries.length; i ++ )
			{
				container = containers[i];
				var mesh:Mesh = new Mesh(geometries[i]);
				mesh.material = materials[0];
				meshes.push(mesh);
				container.addChild(mesh);
				mesh.position = new Vector3D(xpos, ypos, zpos);
				xpos += padding;
			}
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