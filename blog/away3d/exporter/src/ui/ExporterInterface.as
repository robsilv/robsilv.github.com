package ui
{
	import away3d.containers.Scene3D;
	import away3d.tools.serialize.AS3Serializer;
	import away3d.tools.serialize.ISerializer;
	import away3d.tools.serialize.ThreeJSSerializer;
	import away3d.tools.serialize.TraceSerializer;
	
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	
	public class ExporterInterface extends Sprite
	{
		private var asBtn		:Sprite;
		private var jsBtn		:Sprite;
		private var traceBtn	:Sprite;
		private var tf			:TextField;
		
		private var scene		:Scene3D;
		
		public function ExporterInterface(scene:Scene3D)
		{
			super();
			
			this.scene = scene;
			
			asBtn = Sprite(addChild(createButton("Export to AS3")));
			asBtn.useHandCursor = true;
			asBtn.addEventListener(MouseEvent.CLICK, clickASBtnHandler);
			
			jsBtn = Sprite(addChild(createButton("Export to JS")));
			jsBtn.useHandCursor = true;
			jsBtn.addEventListener(MouseEvent.CLICK, clickJSBtnHandler);
			jsBtn.x = 110;
			
			traceBtn = Sprite(addChild(createButton("Trace")));
			traceBtn.useHandCursor = true;
			traceBtn.addEventListener(MouseEvent.CLICK, clickTraceBtnHandler);
			traceBtn.x = 220;
			
			tf = new TextField();
			tf.background = true;
			tf.y = 30;
			tf.width = 320;
			tf.height = 120;
			addChild(tf);
		}
		
		private function clickTraceBtnHandler(e:MouseEvent):void
		{
			var serializer:ISerializer = new TraceSerializer();
			var exportStr:String = serializer.export(scene.sceneGraphRoot);
			trace(exportStr);
			
			tf.text = exportStr;			
		}
		
		private function clickASBtnHandler(e:MouseEvent):void
		{
			var serializer:ISerializer = new AS3Serializer(true);
			var exportStr:String = serializer.export(scene.sceneGraphRoot);
			trace(exportStr);
			
			tf.text = exportStr;
		}
		private function clickJSBtnHandler(e:MouseEvent):void
		{
			var serializer:ISerializer = new ThreeJSSerializer(true);
			var exportStr:String = serializer.export(scene.sceneGraphRoot);
			trace(exportStr);
			
			tf.text = exportStr;
		}
		
		private function createButton(text:String):Sprite
		{
			var button:Sprite = new Sprite();
			button.graphics.beginFill(0xAAAAAA);
			button.graphics.drawRect(0, 0, 100, 20);
			button.graphics.endFill();
			
			var tf:TextField = new TextField();
			tf.selectable = false;
			tf.text = text;
			tf.x = 4;
			button.addChild(tf);
			
			return button;
		}
	}
}