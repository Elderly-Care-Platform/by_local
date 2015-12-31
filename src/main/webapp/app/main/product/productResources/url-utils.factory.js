define([], function () {

    function URLUtilsFactory($window) {
        var isArray = angular.isArray,
            isObject = angular.isObject,
            isString = angular.isString,
            isNumber = angular.isNumber,
            isDate = angular.isDate,
            isFunction = angular.isFunction,
            isDefined = angular.isDefined,
            URLUtils;

        URLUtils = {
            appendQuery: appendQuery,
            buildQueryString: buildQueryString,
            parseUrl: parseUrl,
            represent: represent,
            trimSeparators: trimSeparators
        };

        return URLUtils;

        /************************************************************************
         *********************  Public Utility Functions  ***********************
         ************************************************************************/

        function appendQuery() {
            var args = _.chain(arguments).toArray().flattenDeep().value(),
                queryString,
                result;

            result = trimSeparators((args.shift() || '').toString());
            queryString = buildQueryString.apply(URLUtils, args);

            if (queryString && queryString.length > 0) {
                result += (result.indexOf('?') === -1) ? '?' : '&';
                result += queryString;
                result = trimSeparators(result);
            }

            return result;
        }

        function buildQueryString() {
            return _.chain(arguments).toArray().flattenDeep().map(represent).value().join('&');
        }

        function parseUrl(urlString) {
            var anchor = $window.document.createElement('a'),
                parts = {};

            urlString = String(urlString);
            if (!/^\w+:\/+/.test(urlString)) {
                urlString = 'http://' + urlString;
            }

            anchor.href = urlString;

            parts.protocol = anchor.protocol.toLowerCase().replace(/:\/*$/, '');
            parts.hostname = anchor.hostname;
            parts.port = anchor.port;
            parts.path = anchor.pathname;
            parts.query = anchor.search;
            parts.hash = anchor.hash;

            return parts;
        }

        /**
         * Convert an arbitrary value to a string representation for use in a URI
         */
        function represent(value) {
            var string;

            if (isDescendable(value)) {
                string = queryEncodeObject(value);
            } else if (isDate(value)) {
                string = value.toISOString();
            } else if (_.isBoolean(value)) {
                string = value ? 'true' : 'false';
            } else if (isDefined(value)) {
                string = value;
            } else {
                string = '';
            }

            return (string || '').toString();
        }

        function trimSeparators(uriString) {
            // strip trailing ?, &, or # characters
            return (uriString || '').replace(/[\?&#]+$/, '');
        }

        /************************************************************************
         *********************  Private Utility Functions  **********************
         ************************************************************************/

        function queryEncodeObject(object) {
            var queryString;

            queryString = _.map(
                queryFlatten(object),
                function (pair) {
                    var key = encodeURIComponent(pair[0].toString()),
                        value = encodeURIComponent(represent(pair[1]));

                    return key + '=' + value;
                }
            ).join('&');

            return queryString;
        }

        function queryFlatten(data, prefix) {
            var flattened = [],
                dataIsArray = isArray(data);

            prefix = prefix || '';

            angular.forEach(
                data,
                function (value, key) {
                    var name = nestKeys(prefix, key, dataIsArray);

                    if (isDescendable(value)) {
                        flattened = flattened.concat(queryFlatten(value, name));
                    } else if (isDefined(value) && !isFunction(value)) {
                        flattened.push([name, value]);
                    }
                }
            );

            return flattened;
        }

        function nestKeys(left, right, arrayStyle) {
            var joined;

            if (left.length === 0) {
                joined = queryFormatKey(right);
            } else {
                joined = left + '[' + (arrayStyle ? '' : queryFormatKey(right)) + ']';
            }

            return joined;
        }

        function queryFormatKey(key) {
            return isDefined(key) ? key.toString() : '';
        }

        function isPlainObject(value) {
            return isObject(value) && !isScalarObject(value);
        }

        function isScalarObject(value) {
            return isDate(value) || isString(value) || isNumber(value);
        }

        function isDescendable(value) {
            return isArray(value) || isPlainObject(value);
        }
    }

    return URLUtilsFactory;
});