window.onload = function () {
    var example = new Example1();
};

var Example1 = (function () {
    function Example1() {
        var graphView = new GraphView();
        var dataModel = new DataModel();
        dataModel.addEventListener("loadComplete", function () {
            graphView.setDataProvider(dataModel.getData());
        });
        dataModel.load();
    }
    return Example1;
})();
//# sourceMappingURL=app.js.map
