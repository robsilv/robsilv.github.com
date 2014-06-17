
class GlobalData {

    public regions: Array<RegionData>;
    public countries: any;//Map<string, CountryData>;
    public overview: OverviewData;

    constructor() {
        this.regions = [];
        this.countries = {};//new Map<string, CountryData>();
    }
}

// Data dynamically added to CountryData in a lookup table as follows:
// country[propertyName][year] = value;
// ..where propertyName == gdpPerCapita, hivPrevelance, etc.
class CountryData {

    public overview: OverviewData;

    constructor(public name: string, public region: RegionData) {

    }
}

class RegionData {

    public countries: Array<CountryData>;
    public overview: OverviewData;

    constructor(public name: string) {
        this.countries = [];
    }
}

// USED FOR CLIPPING AXES (min & max values)
// Stores:
// - The time range for a given property
// - The max & min values for the property
// - The countries which hold the max & min values
class OverviewData {
    // Convenience properties for quick reference to statistically important min/max values
    public maxValueCountry: CountryData;
    public minValueCountry: CountryData;
    public maxValueYear: number;
    public minValueYear: number;

    constructor(public minYear = 10000, public maxYear = 0, public minValue = 10000000000, public maxValue = 0) {

    }
}


class DataModel extends EventDispatcher {

    private _global: GlobalData;
    private _csvLoader:TextLoader;
    private _loadNum: number;
    private _loadQueue: Array<Object>;
    private _currLoadObj: any; // from loadQueue

    //private _regionsLoadedCallback: Function;
    //private _tableLoadedCallback: Function;

    private _regionsUrl: string;


    constructor() {
        super();
		this._init();
	}
	
	private _init():void
	{
		//this._global = { regions:[], countries:{} };
        this._global = new GlobalData();

		//this._regionsLoadedCallback = ListenerFunctions.createListenerFunction(this, this._regionsLoaded);
		//this._tableLoadedCallback = ListenerFunctions.createListenerFunction(this, this._tableLoaded);
		
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
        var newLoader: TextLoader = new TextLoader(url);//TextLoader.create(url);
        newLoader.addEventListener(TextLoader.LOADED, callBack);//, false);

		return newLoader;
	}
	
    // Called on init - Loads regions first
	public load():void
	{
		this._csvLoader = this._createLoader(this._regionsUrl, this._regionsLoaded);
		this._csvLoader.load();	
	}
	
    // Called for subsequent loads - all loads are tables
    private _loadNext(): void {
        this._currLoadObj = this._loadQueue[this._loadNum];

        if (this._loadNum < this._loadQueue.length) {
            this._loadNum++;

            this._csvLoader = this._createLoader(this._currLoadObj.url, this._tableLoaded);
            this._csvLoader.load();
        } else {
            this.dispatchEvent({ type: "loadComplete" });
        }
    }

    // Callback
    private _regionsLoaded = (aEvent): void => {
        var data: string = this._csvLoader.getData();
        //console.log("REGIONS LOADER DATA "+data);

        this._parseRegions(data);

        this._loadNext();
    }

    // Callback
	private _tableLoaded = (aEvent) :void =>
	{	
		var data: string = this._csvLoader.getData();
        //console.log("POPULATIONS LOADER DATA "+data);

        //TODO: Remove this JS style scope weirdness
        var scope = this;
        this._parseTable(data);//, function (column, years, i) { scope._parseColumn(scope._currLoadObj.title, column, years, i) });

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
	
    // Add countries to regions
    private _parseRegions(data:string):void
	{
		data = this._cleanData(data);
		
		//split into rows
		var rows:Array<string> = data.split("\n");

		// X-Axis headers
		var column:Array<string> = rows[0].split(",");
		// remove chart title from array
		//column.shift();
		
		// store column titles 
		for (var i = 0; i < column.length; i ++) {
            //this._global.regions.push({ name: column[i], countries: [] });  
            this._global.regions.push(new RegionData(column[i]));        
		}

		// loop through all rows
		for (var i = 0; i < rows.length; i++) {
			  // this line helps to skip empty rows
			if (rows[i]) {                   
				// columns are separated by commas
				var column = rows[i].split(",");
				
				// skip col titles row
				if (i != 0) {
					for ( var j = 0; j < column.length; j ++ ) {
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
							//console.log("NO REGION "+j+" country "+column[j]);
						}
					}
				}
			}
		}
	}
	
	private _parseTable(data: string): Array<string>//, parseFunc:Function):Array<string>
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
		for (var i = 0; i < column.length; i ++)  {
			titles.push(column[i]);        
		}
		
		//console.log("Column Titles "+titles);
		
		// loop through all rows
		for (var i = 0; i < rows.length; i++) {
			  // this line helps to skip empty rows
			if (rows[i]) {
				  // our columns are separated by comma
				var column = rows[i].split(",");

                //parseFunc(column, titles, i);
                this._parseColumn(this._currLoadObj.title, column, titles, i);
			}
		}
		
		return titles;
	}
	
	private _parseColumn(propertyName:string, column:Array<string>, years, i):void
	{
		// remove row title element
		var rowTitle:string = column.shift();				
		var country:CountryData = this._global.countries[rowTitle];
		
		// skip col titles row
		if (i != 0) {
            if (country) {
                // store summaryData per property (e.g. gdpPerCapita) on global object
                if (!this._global[propertyName]) {
                    //global[prop] = { minYear:10000, maxYear:0, minValue:10000000000, maxValue:0 };
                    this._global[propertyName] = new OverviewData();
                }
                // store overview summary on global object
                if (!this._global.overview) {
                    //global.time = { minYear:10000, maxYear:0 };
                    this._global.overview = new OverviewData();
				}
				
				var region = country.region;
				if (!region[propertyName]) {
                    //region[prop] = { minYear:10000, maxYear:0, minValue:10000000000, maxValue:0 };
                    region[propertyName] = new OverviewData();
				}
				if (!region.overview) {
                    //region.time = { minYear:10000, maxYear:0 };
                    //region[prop] = new TimeData();
                    region.overview = new OverviewData();
				}				
				
				for (var j = 0; j < column.length; j++) {
					var value = parseFloat(column[j]);
					if (!isNaN(value)) {
						var year:number = parseInt(years[j]);
						//console.log("HIV "+rowTitle+" : "+year+" : "+value);
						
                        // Add property (e.g. hivPrevelance, gdpPerCapita) to country if not there
						if (!country[propertyName]) {
							country[propertyName] = {};
                        }
                        // Store the value for the given year on the countries property data in a lookup table
						country[propertyName][year] = value;
						
						if (!country.overview) {
                            //country.time = { minYear:10000, maxYear:0 };
                            country.overview = new OverviewData();
						}
						
						// set region bounds
						this._setBounds(region[propertyName], year, value, country);
						// set global bounds
                        this._setBounds(this._global[propertyName], year, value, country);
						
						//set time max/min bounds for all country data
						this._setYearBounds(country.overview, year);
						//set time max/min bounds for all region data
						this._setYearBounds(region.overview, year);
						//set time max/min bounds for all global data
                        this._setYearBounds(this._global.overview, year);
					}
				}
			} else {
				//console.log("Entry for \""+rowTitle+"\" in Pop.csv but not in XXX.csv");
			}
		}
	}
	// Extend value bounds for timeData based on latest entry
    private _setBounds(timeData: OverviewData, year:number, value:number, country:CountryData):void
	{
        timeData = this._setYearBounds(timeData, year);
        timeData = this._setValueBounds(timeData, year, value, country);
    }
    // Extend year boundaries for timeData based on latest entry
	private _setYearBounds(timeData:OverviewData, year: number):OverviewData
	{
        if (year > timeData.maxYear)
            timeData.maxYear = year;
        if (year < timeData.minYear)
            timeData.minYear = year;
			
        return timeData;
    }
    // Extend value bounds for timeData based on latest entry
    private _setValueBounds(timeData: OverviewData, year:number, value:number, country:CountryData):OverviewData
	{
        if (value > timeData.maxValue) {
            timeData.maxValue = value;
            timeData.maxValueCountry = country;
            timeData.maxValueYear = year;
		}
        if (value < timeData.minValue) {
            timeData.minValue = value;
            timeData.minValueCountry = country;
            timeData.minValueYear = year;
		}
		
        return timeData;
	}
	
	public getData():GlobalData
	{
		return this._global;
	}
	
}