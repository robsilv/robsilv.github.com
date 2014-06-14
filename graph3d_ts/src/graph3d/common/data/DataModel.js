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

var TimeData = (function () {
    function TimeData(minYear, maxYear, minValue, maxValue) {
        if (typeof minYear === "undefined") { minYear = 10000; }
        if (typeof maxYear === "undefined") { maxYear = 0; }
        if (typeof minValue === "undefined") { minValue = 10000000000; }
        if (typeof maxValue === "undefined") { maxValue = 0; }
        this.minYear = minYear;
        this.maxYear = maxYear;
        this.minValue = minValue;
        this.maxValue = maxValue;
    }
    return TimeData;
})();

var DataModel = (function (_super) {
    __extends(DataModel, _super);
    function DataModel() {
        _super.call(this);
        this._init();
    }
    DataModel.create = function () {
        var newInstance = new DataModel();
        return newInstance;
    };

    DataModel.prototype._init = function () {
        //this._global = { regions:[], countries:{} };
        this._global = new GlobalData();

        this._regionsLoadedCallback = ListenerFunctions.createListenerFunction(this, this._regionsLoaded);
        this._tableLoadedCallback = ListenerFunctions.createListenerFunction(this, this._tableLoaded);

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
        var newLoader = TextLoader.create(url);
        newLoader.addEventListener(TextLoader.LOADED, callBack); //, false);

        return newLoader;
    };

    DataModel.prototype.load = function () {
        this._csvLoader = this._createLoader(this._regionsUrl, this._regionsLoadedCallback);
        this._csvLoader.load();
    };

    DataModel.prototype._regionsLoaded = function (aEvent) {
        var data = this._csvLoader.getData();

        //console.log("REGIONS LOADER DATA "+data);
        this._parseRegions(data);

        this._loadNext();
    };

    DataModel.prototype._loadNext = function () {
        this._currLoadObj = this._loadQueue[this._loadNum];

        if (this._loadNum < this._loadQueue.length) {
            this._loadNum++;

            this._csvLoader = this._createLoader(this._currLoadObj.url, this._tableLoadedCallback);
            this._csvLoader.load();
        } else {
            this.dispatchEvent({ type: "loadComplete" });
        }
    };

    DataModel.prototype._tableLoaded = function (aEvent) {
        var data = this._csvLoader.getData();

        //console.log("POPULATIONS LOADER DATA "+data);
        var scope = this;
        this._parseTable(data, function (column, years, i) {
            scope._parseColumn(scope._currLoadObj.title, column, years, i);
        });

        this._loadNext();
    };

    DataModel.prototype._cleanData = function (data) {
        //replace UNIX new line
        data = data.replace(/\r\n/g, "\n");

        //replace MAC new lines
        data = data.replace(/\r/g, "\n");

        return data;
    };

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
                // our columns are separated by comma
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
                            console.log("NO REGION " + j + " country " + column[j]);
                        }
                    }
                }
            }
        }
    };

    DataModel.prototype._parseTable = function (data, parseFunc) {
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

        console.log("Column Titles " + titles);

        for (var i = 0; i < rows.length; i++) {
            // this line helps to skip empty rows
            if (rows[i]) {
                // our columns are separated by comma
                var column = rows[i].split(",");

                parseFunc(column, titles, i);
            }
        }

        return titles;
    };

    DataModel.prototype._parseColumn = function (prop, column, years, i) {
        // remove row title element
        var rowTitle = column.shift();
        var country = this._global.countries[rowTitle];

        // skip col titles row
        if (i != 0) {
            if (country) {
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

                for (var j = 0; j < column.length; j++) {
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
                console.log("Entry for \"" + rowTitle + "\" in Pop.csv but not in XXX.csv");
            }
        }
    };

    DataModel.prototype._setBounds = function (obj, year, value, country) {
        obj = this._setYearBounds(obj, year);
        obj = this._setValueBounds(obj, year, value, country);
    };
    DataModel.prototype._setYearBounds = function (obj, year) {
        if (year > obj.maxYear)
            obj.maxYear = year;
        if (year < obj.minYear)
            obj.minYear = year;

        return obj;
    };
    DataModel.prototype._setValueBounds = function (obj, year, value, country) {
        if (value > obj.maxValue) {
            obj.maxValue = value;
            obj.maxValueCountry = country;
            obj.maxValueYear = year;
        }
        if (value < obj.minValue) {
            obj.minValue = value;
            obj.minValueCountry = country;
            obj.minValueYear = year;
        }

        return obj;
    };

    DataModel.prototype.getData = function () {
        return this._global;
    };
    return DataModel;
})(EventDispatcher);
//# sourceMappingURL=DataModel.js.map
