//declare module GRAPH3D.common.util {
var GraphUtils = (function () {
    function GraphUtils() {
    }
    GraphUtils.create = function () {
        var newInstance = new GraphUtils();
        return newInstance;
    };

    GraphUtils.prototype.mapToAxisLinear = function (minVal, maxVal, numSteps, forceInt) {
        var diff = maxVal - minVal;
        var stepSize = diff / numSteps;

        var numArray = stepSize.toString().split(".");
        var integerStrLength = stepSize.toString().length;
        if (numArray) {
            integerStrLength = numArray[0].length;
        }

        var stepSciNot = stepSize;

        for (var i = 0; i < integerStrLength; i++) {
            stepSciNot /= 10;
        }

        // round to a neat number for mapping to the axis
        if (stepSciNot < 0.1)
            stepSciNot = 0.1;
        else if (stepSciNot < 0.15)
            stepSciNot = 0.15;
        else if (stepSciNot < 0.2)
            stepSciNot = 0.2;
        else if (stepSciNot < 0.5)
            stepSciNot = 0.5;
        else
            stepSciNot = 1;

        for (var i = 0; i < integerStrLength; i++) {
            stepSciNot *= 10;
        }

        stepSize = stepSciNot;

        if (forceInt)
            stepSize = Math.ceil(stepSize);

        var graphMinVal = 0;

        // minVal must not be zero
        //TODO: Need to dynamically find the start position, i.e. the step below the min val.
        if (stepSize * numSteps < maxVal) {
            graphMinVal = Math.floor(minVal);
            //console.log("MIN VAL NOT ZERO "+minVal);
        }

        var finalMaxVal = minVal + (stepSize * numSteps);
        var maxNumSteps = numSteps;
        for (var i = 0; i < numSteps; i++) {
            var stepVal = graphMinVal + (stepSize * i);

            if (stepVal >= maxVal) {
                maxNumSteps = i;
                finalMaxVal = stepVal;
                console.log("maxStep " + stepVal + " finalMaxVal " + finalMaxVal + " i " + i);
                break;
            }
        }

        console.log("minVal " + minVal + " maxVal " + maxVal + " numSteps " + maxNumSteps + " stepSize " + stepSize);

        return { minVal: graphMinVal, maxVal: finalMaxVal, stepSize: stepSize, numSteps: maxNumSteps };
    };

    // TODO: numFractionalSteps can be determined by comparing the minVal to Math.pow(1/base, n)
    GraphUtils.prototype.mapToAxisLogarithmic = function (minVal, maxVal, numFractionalSteps, base) {
        var diff = maxVal - minVal;

        var numLogSteps = this.getLogOfBase(diff, base);
        var baseLog = 0;

        // make sure that there's enough space to fit all values
        numLogSteps = Math.ceil(numLogSteps);

        var finalMaxVal = Math.pow(base, numLogSteps);
        graphMinVal = 0;

        if (numFractionalSteps > 0) {
            var multiplier = Math.pow(10, numFractionalSteps);
            var graphMinVal = Math.pow(1 / base, numFractionalSteps);
            graphMinVal = Math.round(graphMinVal * multiplier) / multiplier;
        } else {
            graphMinVal = Math.pow(base, Math.floor(this.getLogOfBase(minVal, base))); // min log step

            var newMaxVal = graphMinVal;
            var numLogSteps = 0;

            while (newMaxVal < maxVal) {
                newMaxVal *= base;
                numLogSteps++;
            }

            baseLog = this.getLogOfBase(graphMinVal, base); // factors of the base greater than 1 (i.e. graphMinVal 100 & base 10 = baseLog 2)
        }

        var numSteps = numLogSteps + numFractionalSteps;

        return { minVal: graphMinVal, maxVal: finalMaxVal, numSteps: numSteps, logarithmic: true, numLogSteps: numLogSteps, numFractionalSteps: numFractionalSteps, base: base, baseLog: baseLog };
    };

    GraphUtils.prototype.getLogOfBase = function (val, base, debug) {
        var result = Math.log(val) / Math.log(base);

        //var r2 = Math.log(val) * Math.log(base);
        if (debug) {
            console.log("log of " + val + " base " + base + " = " + result);
            console.log("Starting at 1, it takes " + result + " steps to get to " + val + " when each step represents a multiplication of " + base);
        }

        return result;
    };

    GraphUtils.prototype.getRatioAlongAxisLinear = function (val, minVal, maxVal) {
        var diffFromZero = val - minVal;
        var valueLengthOfAxis = maxVal - minVal;
        var ratio = diffFromZero / valueLengthOfAxis;

        return ratio;
    };

    // TODO: This function should return a ratio (not a position) which takes into account numFractionalSteps
    GraphUtils.prototype.getPosAlongAxisLogarithmic = function (value, axisLength, numSteps, base, baseLog, numFractionalSteps) {
        var pos = 0;

        if (value == 0)
            return pos;

        var stepSize = axisLength / numSteps;
        if (numFractionalSteps) {
            var numStepsOffset = this.getLogOfBase(value, base);
            pos = numStepsOffset * stepSize;
            pos += numFractionalSteps * stepSize; // bump it up so 1 is the starting pos
        } else {
            var numStepsOffset = this.getLogOfBase(value, base);
            pos = (numStepsOffset - baseLog) * stepSize;
        }

        //console.log("x "+x+" xpos "+xpos+" stepSize "+stepSize+" numStepsOffset "+numStepsOffset);
        return pos;
    };
    return GraphUtils;
})();
//}
//# sourceMappingURL=GraphUtils.js.map
