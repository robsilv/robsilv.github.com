window.onload = function () {
    var example = new Example1();
};

var Example1 = (function () {
    function Example1() {
        var graphView = GraphView.create();
        var dataModel = DataModel.create();
        dataModel.addEventListener("loadComplete", function () {
            graphView.setDataProvider(dataModel.getData());
        });
        dataModel.load();
    }
    return Example1;
})();
//# sourceMappingURL=app.js.map
