//declare module GRAPH3D.utils.events {
class EventDispatcher {
    private _eventListeners: any;//Map<string, Array<Function>>;

	constructor() {
    	this._eventListeners = null;
	}
		
	public addEventListener(aEventType:string, aFunction:Function):EventDispatcher {
		if(this._eventListeners == null) {
            this._eventListeners = {};//new Map<string, Function[]>();
		}
		if(!this._eventListeners[aEventType]) {
			this._eventListeners[aEventType] = [];
		}
		//this._eventListeners.get(aEventType).push(aFunction);
        this._eventListeners[aEventType].push(aFunction);
        	
		return this;
	}
		
	public removeEventListener(aEventType:string, aFunction:Function):EventDispatcher {
			if(this._eventListeners == null) {
                this._eventListeners = {};//new Map<string, Function[]>();
			}
			var currentArray = this._eventListeners[aEventType];

			if (typeof(currentArray) == "undefined")
			{
				if (window.console)
					console.warn("EventDispatcher :: removeEventListener :: Tried to remove an event handler that doesn't exist");
				return this;				
			}

			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++){
				if(currentArray[i] == aFunction){
					currentArray.splice(i, 1);
					i--;
					currentArrayLength--;
				}
			}
			return this;
		}
		
	public dispatchEvent(aEvent):EventDispatcher {
		//console.log("WEBLAB.utils.events.EventDispatcher::dispatchEvent");
		if(this._eventListeners === null) {
            this._eventListeners = {};//new Map<string, Function[]>();
		}
		var eventType:string = aEvent.type;
			
		if(aEvent.target === null) {
			aEvent.target = this;
		}
		aEvent.currentTarget = this;
		//console.log(eventType, this._eventListeners[eventType]);
		var currentEventListeners = this._eventListeners[eventType];
		if(currentEventListeners !== null && currentEventListeners !== undefined) {
			var currentArray:Array<Function> = currentEventListeners;
			var currentArrayLength:number = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++){
				var currentFunction = currentArray[i];
				//console.log(currentFunction);
				currentFunction.call(this, aEvent);
			}
		}
		return this;
	}
		
	public dispatchCustomEvent(aEventType:string, aDetail:any):EventDispatcher {
		//console.log("WEBLAB.utils.events.EventDispatcher::dispatchCustomEvent");
		//console.log(aEventType, aDetail);
		var newEvent:CustomEvent = <CustomEvent>document.createEvent("CustomEvent");
		newEvent.initCustomEvent(aEventType, false, false, aDetail);
		return this.dispatchEvent(newEvent);
	}
		
	/*
	*	Decorate (Static)
	*
	*	Decorator method that bestows distpatching behaviours upon generic objects.
	*	A convenience method for when your object cannot extend EventDispatcher
	*/
	public static decorate( object:any ):any {
		EventDispatcher.apply( object );
		//object.addeventlistener = this.addeventlistener;
        //object.dispatchevent = this.dispatchevent;
        //object.dispatchcustomevent = this.dispatchcustomevent;
        //object.removeEventListener = this.removeEventListener;
		return object;
	}
}