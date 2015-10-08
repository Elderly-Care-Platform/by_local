define([], function () {
    function URITemplateFactory($interpolate, URLUtils) {
        var TEMPLATE_VAR_RX = /:(?:\(([a-z_]\w*)\)|([a-z_]\w*))/ig,
            defaultCompileOptions = {type: 'get'},
            templateScopePrototype = {$v: URLUtils.represent};

        urlTemplate.compile = compile;
        urlTemplate.exec = exec;

        return urlTemplate;

        function urlTemplate(templateString, defaultParams, otherOptions) {
            var compileOptions = angular.extend(
                {defaultParams: defaultParams},
                otherOptions
            );

            return urlTemplate.compile(templateString, compileOptions);
        }

        function compile(templateString, compileOptions) {
            var variables = [],
                interpolateString,
                interpolator;

            templateString = (templateString || '').toString();
            compileOptions = angular.extend({}, defaultCompileOptions, compileOptions);

            interpolateString = templateString.replace(
                TEMPLATE_VAR_RX,
                function (fullMatch, match1, match2) {
                    var varName = match1 || match2;
                    variables.push(varName);
                    return $interpolate.startSymbol() + '$v(' + varName + ')' + $interpolate.endSymbol();
                }
            );

            interpolator = $interpolate(interpolateString);
            template.source = templateString;
            template.variables = variables;
            template.options = compileOptions;

            return template;

            function template() {
                var scope = createScope(template, _.toArray(arguments)),
                    result = URLUtils.trimSeparators(interpolator(scope)),
                    queryParams;

                if (compileOptions.type === 'get') {
                    queryParams = _.omit(scope, variables);
                    result = URLUtils.appendQuery(result, queryParams);
                }

                return result;
            }
        }

        function exec(urlTemplate, params, templateOptions) {
            return compile(urlTemplate, templateOptions)(params || {});
        }

        // builds the evaluation object that gets passed in to the interpolate function
        function createScope(template, argList) {
            var variables = template.variables,
                defaults = template.options.defaultParams,
                scope = _.create(templateScopePrototype),
                positionalCount = _.findLastIndex(argList, isPositionalArg) + 1,
                positionalEnd = Math.min(variables.length, positionalCount),
                variableMapArgs = argList.slice(positionalCount),
                positionalArgs = argList.slice(0, positionalEnd);

            // Argument parsing logic:
            // 1. Gather any trailing POJO arguments and consider them
            //    as direct name-value mappings
            if (variableMapArgs.length > 0) {
                // just a variable length arg call to angular.extend(scope, map1, map2, ...)
                angular.extend.apply(angular, [scope].concat(variableMapArgs));
            }

            // 2. Treat remaining non-POJO arguments as positional arguments to bind
            //    to the corresponding named variables (ala printf)
            for (var i = 0; i < positionalEnd; i += 1) {
                var variable = variables[i],
                    boundValue = positionalArgs[i];

                if (angular.isUndefined(scope[variable]) && angular.isDefined(boundValue)) {
                    scope[variable] = boundValue;
                }
            }

            // 3. Fill in any remaining default values provided at compilation
            if (defaults) {
                angular.forEach(
                    defaults,
                    function (defaultValue, paramName) {
                        if (angular.isUndefined(scope[paramName])) {
                            if (angular.isFunction(defaultValue)) {
                                defaultValue = defaultValue.call(scope);
                            }
                            if (angular.isDefined(defaultValue)) {
                                scope[paramName] = defaultValue;
                            }
                        }
                    }
                );
            }

            return scope;
        }

        function isPositionalArg(value) {
            return angular.isDefined(value) && !_.isPlainObject(value);
        }
    }

    return URITemplateFactory;
});

