//var namespace = GRAPH3D.namespace("GRAPH3D.utils.events");
class ListenerFunctions {
	
	public static createListenerFunction(aListenerObject, aListenerFunction):Function {
		var returnFunction = function() {
			aListenerFunction.apply(aListenerObject, arguments);
		};
		return returnFunction;
	}
		
	public static createListenerFunctionWithArguments(aListenerObject, aListenerFunction, aArguments):Function {
		var returnFunction = function() {
			var argumentsArray = aArguments.concat([]); //MENOTE: can't concat arguments. It adds an object instead of all arguments.
			var currentArray = arguments;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				argumentsArray.push(currentArray[i]);
			}
			aListenerFunction.apply(aListenerObject, argumentsArray);
		};
		return returnFunction;
	}
}