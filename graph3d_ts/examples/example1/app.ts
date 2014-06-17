window.onload = () => {
    var example = new Example1();
};

class Example1 {

    constructor() {

        var graphView = new GraphView();//GraphView.create();
        var dataModel = new DataModel();//DataModel.create();
        dataModel.addEventListener("loadComplete", function () { graphView.setDataProvider(dataModel.getData()); });
        dataModel.load();
    }
}