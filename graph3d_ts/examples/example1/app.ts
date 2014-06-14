window.onload = () => {
    var example = new Example1();
};

class Example1 {

    constructor() {

        var graphView = GraphView.create();
        var dataModel = DataModel.create();
        dataModel.addEventListener("loadComplete", function () { graphView.setDataProvider(dataModel.getData()); });
        dataModel.load();
    }
}