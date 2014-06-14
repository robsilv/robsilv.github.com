
class GlobalData {

    public regions: Array<RegionData>;
    public countries: any;//Map<string, CountryData>;
    public time: TimeData;

    constructor() {
        this.regions = [];
        this.countries = {};//new Map<string, CountryData>();
    }
}

class CountryData {

    public time: TimeData;

    constructor(public name: string, public region: RegionData) {

    }
}

class RegionData {

    public countries: Array<CountryData>;
    public time: TimeData;

    constructor(public name: string) {
        this.countries = [];
    }
}

class TimeData {

    constructor(public minYear = 10000, public maxYear = 0, public minValue = 10000000000, public maxValue = 0) {

    }
}


class DataModel extends EventDispatcher {

    private _global: GlobalData;
    private _csvLoader:TextLoader;
    private _loadNum: number;
    private _loadQueue: Array<Object>;
    private _currLoadObj: any; // from loadQueue

    private _regionsLoadedCallback: Function;
    private _tableLoadedCallback: Function;

    private _regionsUrl: string;


    constructor() {
        super();
		this._init();
	}
	
	public static create():DataModel 
	{
		var newInstance = new DataModel();
		return newInstance;
	}
	
	private _init():void
	{
		//this._global = { regions:[], countries:{} };
        this._global = new GlobalData();

		this._regionsLoadedCallback = ListenerFunctions.createListenerFunction(this, this._regionsLoaded);
		this._tableLoadedCallback = ListenerFunctions.createListenerFunction(this, this._tableLoaded);
		
        this._regionsUrl = "../../files/data/Geographic_Regions.csv";

		this._loadNum	= 0;
        this._loadQueue = [
            { title: "population", url: "../../files/data/Population.csv" },
			{ title: "hivPrevalence", url: "../../files/data/Estimated_HIV_Prevalence_Ages_15-49.csv" },
            { title: "gdpPerCapita", url: "../../files/data/GDP_per_capita_(1800-2010)_2005_Int_dollars.csv" },
            { title: "lifeExpectancy", url: "../../files/data/Life_Expectancy_At_Birth.csv" }
        ];
	}
	
	public destroy():void 
	{
	
	}
	
	public enable():void
	{

		
	}
	public disable():void
	{

	}
	
	private _createLoader(url:string, callBack:Function):TextLoader
	{
		var newLoader:TextLoader = TextLoader.create(url);
        newLoader.addEventListener(TextLoader.LOADED, callBack);//, false);

		return newLoader;
	}
	
	public load():void
	{
		this._csvLoader = this._createLoader(this._regionsUrl, this._regionsLoadedCallback);
		this._csvLoader.load();	
	}
	
	private _regionsLoaded(aEvent):void 
	{	
		var data:string = this._csvLoader.getData();
		//console.log("REGIONS LOADER DATA "+data);
		
		this._parseRegions(data);

		this._loadNext();	
	}

    private _loadNext(): void {
        this._currLoadObj = this._loadQueue[this._loadNum];

        if (this._loadNum < this._loadQueue.length) {
            this._loadNum++;

            this._csvLoader = this._createLoader(this._currLoadObj.url, this._tableLoadedCallback);
            this._csvLoader.load();
        } else {
            this.dispatchEvent({ type: "loadComplete" });
        }
    }

	private _tableLoaded(aEvent) :void
	{	
		var data: string = this._csvLoader.getData();
		//console.log("POPULATIONS LOADER DATA "+data);

		var scope = this;
		this._parseTable(data, function(column, years, i) { scope._parseColumn(scope._currLoadObj.title, column, years, i) });
	
		this._loadNext();
	}
	
	private _cleanData(data:string):string
	{
		//replace UNIX new line
		data = data.replace (/\r\n/g, "\n");
		//replace MAC new lines
		data = data.replace (/\r/g, "\n");
		
		return data;
	}
	
    private _parseRegions(data:string)
	{
		data = this._cleanData(data);
		
		//split into rows
		var rows:Array<string> = data.split("\n");

		// X-Axis headers
		var column:Array<string> = rows[0].split(",");
		// remove chart title from array
		//column.shift();
		
		// store column titles
		for (var i = 0; i < column.length; i ++) 
		{
            //this._global.regions.push({ name: column[i], countries: [] });  
            this._global.regions.push(new RegionData(column[i]));        
		}

		// loop through all rows
		for (var i = 0; i < rows.length; i++)
		{
			  // this line helps to skip empty rows
			if (rows[i]) 
			{                   
				  // our columns are separated by comma
				var column = rows[i].split(",");
				
				// skip col titles row
				if (i != 0) 
				{
					for ( var j = 0; j < column.length; j ++ )
					{
						var region:RegionData = this._global.regions[j];
						var country:string = column[j];
						if (region) {
							if (country.length > 0 ) {
								//var countryObj = { name:country, region:region };
                                var countryObj = new CountryData(country, region);
                                region.countries.push(countryObj);
								this._global.countries[country] = countryObj;
							}
						} else {
							console.log("NO REGION "+j+" country "+column[j]);
						}
					}
				}
			}
		}
	}
	
	private _parseTable(data:string, parseFunc:Function):Array<string>
	{
		data = this._cleanData(data);
		
		//split into rows
		var rows:Array<string> = data.split("\n");

		// X-Axis headers
		var column:Array<string> = rows[0].split(",");
		// remove chart title from array
		column.shift();

		var titles:Array<string> = [];
		
		// store column titles
		for (var i = 0; i < column.length; i ++) 
		{
			titles.push(column[i]);        
		}
		
		console.log("Column Titles "+titles);
		
		// loop through all rows
		for (var i = 0; i < rows.length; i++)
		{
			  // this line helps to skip empty rows
			if (rows[i]) 
			{                   
				  // our columns are separated by comma
				var column = rows[i].split(",");
				
				parseFunc(column, titles, i);
			}
		}
		
		return titles;
	}
	
	private _parseColumn(prop, column:Array<string>, years, i):void
	{
		// remove row title element
		var rowTitle:string = column.shift();				
		var country:CountryData = this._global.countries[rowTitle];
		
		// skip col titles row
		if (i != 0) 
		{
			if (country) 
			{
				var global = this._global;
				if (!global[prop]) {
                    //global[prop] = { minYear:10000, maxYear:0, minValue:10000000000, maxValue:0 };
                    global[prop] = new TimeData();
				}
				if (!global.time) {
                    //global.time = { minYear:10000, maxYear:0 };
                    global.time = new TimeData();
				}
				
				var region = country.region;
				if (!region[prop]) {
                    //region[prop] = { minYear:10000, maxYear:0, minValue:10000000000, maxValue:0 };
                    region[prop] = new TimeData();
				}
				if (!region.time) {
                    //region.time = { minYear:10000, maxYear:0 };
                    //region[prop] = new TimeData();
                    region.time = new TimeData();
				}				
				
				for (var j = 0; j < column.length; j++)
				{
					var value = parseFloat(column[j]);
					if (!isNaN(value)) {
						var year = parseInt(years[j]);
						//console.log("HIV "+rowTitle+" : "+year+" : "+value);
						
						if (!country[prop]) {
							country[prop] = {};
						}
						country[prop][year] = value;
						
						if (!country.time) {
                            //country.time = { minYear:10000, maxYear:0 };
                            country.time = new TimeData();
						}
						
						// set region bounds
						this._setBounds(region[prop], year, value, country);
						// set global bounds
						this._setBounds(global[prop], year, value, country);
						
						//set time max/min bounds for all country data
						this._setYearBounds(country.time, year);
						//set time max/min bounds for all region data
						this._setYearBounds(region.time, year);
						//set time max/min bounds for all global data
						this._setYearBounds(global.time, year);
					}
				}
			} else {
				console.log("Entry for \""+rowTitle+"\" in Pop.csv but not in XXX.csv");
			}
		}
	}
	
	private _setBounds(obj:any, year:number, value:number, country:CountryData):void
	{
		obj = this._setYearBounds(obj, year);
		obj = this._setValueBounds( obj, year, value, country );
	}
	private _setYearBounds(obj:any, year):any
	{
		if ( year > obj.maxYear )
			obj.maxYear = year;
		if ( year < obj.minYear )
			obj.minYear = year;
			
		return obj;
	}
	private _setValueBounds( obj:any, year:number, value:number, country:CountryData )
	{
		if ( value > obj.maxValue )
		{
			obj.maxValue = value;
			obj.maxValueCountry = country;
			obj.maxValueYear = year;
		}
		if ( value < obj.minValue )
		{
			obj.minValue = value;
			obj.minValueCountry = country;
			obj.minValueYear = year;
		}
		
		return obj;
	}
	
	public getData()
	{
		return this._global;
	}
	
}