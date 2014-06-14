//var namespace = GRAPH3D.namespace("GRAPH3D.utils.events");
var ListenerFunctions = (function () {
    function ListenerFunctions() {
    }
    ListenerFunctions.createListenerFunction = function (aListenerObject, aListenerFunction) {
        var returnFunction = function () {
            aListenerFunction.apply(aListenerObject, arguments);
        };
        return returnFunction;
    };

    ListenerFunctions.createListenerFunctionWithArguments = function (aListenerObject, aListenerFunction, aArguments) {
        var returnFunction = function () {
            var argumentsArray = aArguments.concat([]);
            var currentArray = arguments;
            var currentArrayLength = currentArray.length;
            for (var i = 0; i < currentArrayLength; i++) {
                argumentsArray.push(currentArray[i]);
            }
            aListenerFunction.apply(aListenerObject, argumentsArray);
        };
        return returnFunction;
    };
    return ListenerFunctions;
})();
//# sourceMappingURL=ListenerFunctions.js.map
