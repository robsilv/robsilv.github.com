var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GlobalData = (function () {
    function GlobalData() {
        this.regions = [];
        this.countries = {}; //new Map<string, CountryData>();
    }
    return GlobalData;
})();

// Data dynamically added to CountryData in a lookup table as follows:
// country[propertyName][year] = value;
// ..where propertyName == gdpPerCapita, hivPrevelance, etc.
var CountryData = (function () {
    function CountryData(name, region) {
        this.name = name;
        this.region = region;
    }
    return CountryData;
})();

var RegionData = (function () {
    function RegionData(name) {
        this.name = name;
        this.countries = [];
    }
    return RegionData;
})();

// USED FOR CLIPPING AXES (min & max values)
// Stores:
// - The time range for a given property
// - The max & min values for the property
// - The countries which hold the max & min values
var OverviewData = (function () {
    function OverviewData(minYear, maxYear, minValue, maxValue) {
        if (typeof minYear === "undefined") { minYear = 10000; }
        if (typeof maxYear === "undefined") { maxYear = 0; }
        if (typeof minValue === "undefined") { minValue = 10000000000; }
        if (typeof maxValue === "undefined") { maxValue = 0; }
        this.minYear = minYear;
        this.maxYear = maxYear;
        this.minValue = minValue;
        this.maxValue = maxValue;
    }
    return OverviewData;
})();

var DataModel = (function (_super) {
    __extends(DataModel, _super);
    function DataModel() {
        var _this = this;
        _super.call(this);
        // Callback
        this._regionsLoaded = function (aEvent) {
            var data = _this._csvLoader.getData();

            //console.log("REGIONS LOADER DATA "+data);
            _this._parseRegions(data);

            _this._loadNext();
        };
        // Callback
        this._tableLoaded = function (aEvent) {
            var data = _this._csvLoader.getData();

            //console.log("POPULATIONS LOADER DATA "+data);
            //TODO: Remove this JS style scope weirdness
            var scope = _this;
            _this._parseTable(data); //, function (column, years, i) { scope._parseColumn(scope._currLoadObj.title, column, years, i) });

            _this._loadNext();
        };
        this._init();
    }
    DataModel.prototype._init = function () {
        //this._global = { regions:[], countries:{} };
        this._global = new GlobalData();

        //this._regionsLoadedCallback = ListenerFunctions.createListenerFunction(this, this._regionsLoaded);
        //this._tableLoadedCallback = ListenerFunctions.createListenerFunction(this, this._tableLoaded);
        this._regionsUrl = "../../files/data/Geographic_Regions.csv";

        this._loadNum = 0;
        this._loadQueue = [
            { title: "population", url: "../../files/data/Population.csv" },
            { title: "hivPrevalence", url: "../../files/data/Estimated_HIV_Prevalence_Ages_15-49.csv" },
            { title: "gdpPerCapita", url: "../../files/data/GDP_per_capita_(1800-2010)_2005_Int_dollars.csv" },
            { title: "lifeExpectancy", url: "../../files/data/Life_Expectancy_At_Birth.csv" }
        ];
    };

    DataModel.prototype.destroy = function () {
    };

    DataModel.prototype.enable = function () {
    };
    DataModel.prototype.disable = function () {
    };

    DataModel.prototype._createLoader = function (url, callBack) {
        var newLoader = new TextLoader(url);
        newLoader.addEventListener(TextLoader.LOADED, callBack); //, false);

        return newLoader;
    };

    // Called on init - Loads regions first
    DataModel.prototype.load = function () {
        this._csvLoader = this._createLoader(this._regionsUrl, this._regionsLoaded);
        this._csvLoader.load();
    };

    // Called for subsequent loads - all loads are tables
    DataModel.prototype._loadNext = function () {
        this._currLoadObj = this._loadQueue[this._loadNum];

        if (this._loadNum < this._loadQueue.length) {
            this._loadNum++;

            this._csvLoader = this._createLoader(this._currLoadObj.url, this._tableLoaded);
            this._csvLoader.load();
        } else {
            this.dispatchEvent({ type: "loadComplete" });
        }
    };

    DataModel.prototype._cleanData = function (data) {
        //replace UNIX new line
        data = data.replace(/\r\n/g, "\n");

        //replace MAC new lines
        data = data.replace(/\r/g, "\n");

        return data;
    };

    // Add countries to regions
    DataModel.prototype._parseRegions = function (data) {
        data = this._cleanData(data);

        //split into rows
        var rows = data.split("\n");

        // X-Axis headers
        var column = rows[0].split(",");

        for (var i = 0; i < column.length; i++) {
            //this._global.regions.push({ name: column[i], countries: [] });
            this._global.regions.push(new RegionData(column[i]));
        }

        for (var i = 0; i < rows.length; i++) {
            // this line helps to skip empty rows
            if (rows[i]) {
                // columns are separated by commas
                var column = rows[i].split(",");

                // skip col titles row
                if (i != 0) {
                    for (var j = 0; j < column.length; j++) {
                        var region = this._global.regions[j];
                        var country = column[j];
                        if (region) {
                            if (country.length > 0) {
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
    };

    DataModel.prototype._parseTable = function (data) {
        data = this._cleanData(data);

        //split into rows
        var rows = data.split("\n");

        // X-Axis headers
        var column = rows[0].split(",");

        // remove chart title from array
        column.shift();

        var titles = [];

        for (var i = 0; i < column.length; i++) {
            titles.push(column[i]);
        }

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
    };

    DataModel.prototype._parseColumn = function (propertyName, column, years, i) {
        // remove row title element
        var rowTitle = column.shift();
        var country = this._global.countries[rowTitle];

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
                        var year = parseInt(years[j]);

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
    };

    // Extend value bounds for timeData based on latest entry
    DataModel.prototype._setBounds = function (timeData, year, value, country) {
        timeData = this._setYearBounds(timeData, year);
        timeData = this._setValueBounds(timeData, year, value, country);
    };

    // Extend year boundaries for timeData based on latest entry
    DataModel.prototype._setYearBounds = function (timeData, year) {
        if (year > timeData.maxYear)
            timeData.maxYear = year;
        if (year < timeData.minYear)
            timeData.minYear = year;

        return timeData;
    };

    // Extend value bounds for timeData based on latest entry
    DataModel.prototype._setValueBounds = function (timeData, year, value, country) {
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
    };

    DataModel.prototype.getData = function () {
        return this._global;
    };
    return DataModel;
})(EventDispatcher);
//# sourceMappingURL=DataModel.js.map
