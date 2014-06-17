//var namespace = GRAPH3D.namespace("GRAPH3D.utils.loading");

class TextLoader extends EventDispatcher {
	//var EventDispatcher = GRAPH3D.namespace("GRAPH3D.utils.events").EventDispatcher;
	//var ListenerFunctions = GRAPH3D.namespace("GRAPH3D.utils.events").ListenerFunctions;

    public static LOADED:string = "loaded";
    public static ERROR: string = "error";

    private _url: string;
    private _loader: XMLHttpRequest;
    private _data: string;
		
    constructor(url?: string) {
        super();
        this._init();
        if (url != null) {
            this.setUrl(url);
        }
    }
		
	private _init():TextLoader {
			
		this._url = null;
		this._loader = null;
		this._data = null;
			
		return this;
	}
		
	//public static create(aUrl:string):TextLoader {
	//	var newTextLoader = new TextLoader();
	//	newTextLoader.setUrl(aUrl);
	//	return newTextLoader;
	//}
		
	public getData():string {
		return this._data;
	}
		
	public setUrl(aUrl:string):TextLoader {
			
		this._url = aUrl;
			
		return this;
	}
		
	public load():TextLoader {
			
		this._loader = new XMLHttpRequest();
		this._loader.open("GET", this._url, false);
			
        this._loader.onreadystatechange = <any>ListenerFunctions.createListenerFunction(this, this._onReadyStateChange);
		this._loader.send(null);
			
		return this;
	}
		
	private _onReadyStateChange() {
		//console.log("GRAPH3D.utils.loading.TextLoader::_onReadyStateChange");
		//console.log(this._url, this._loader.readyState, this._loader.status);
		switch(this._loader.readyState) {
			case 0: //Uninitialized
			case 1: //Set up
			case 2: //Sent
			case 3: //Partly done
				//MENOTE: do nothing
				break;
			case 4: //Done
				if(this._loader.status < 400) {
					this._data = this._loader.responseText;
					this.dispatchCustomEvent(TextLoader.LOADED, this.getData());
				}
				else {
					this.dispatchCustomEvent(TextLoader.ERROR, null);
				}
				break;
		}
	}
		
	public destroy():void {
			
	}
}