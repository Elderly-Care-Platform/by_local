define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function ProductsController( $scope,
                                 $log,
                                 $q,
                                 $window,
                                 $location,
                                 $filter,
                                 ProductService,
                                 CategoryService,
                                 CartService,
                                 BreadcrumbService,
                                 $routeParams,
                                 PAGE_URL,
                                 SERVERURL_IMAGE,
                                 STATIC_IMAGE,
                                 Utility,
                                 PAGINATION){
        $log.debug('Inside Product Controller');

        //Variables
        var breadCrumb;
        $scope.discuss                  = [];
        $scope.discussCounts            = {};
        $scope.discussCounts.z          = 1;
        $scope.serverurl                = SERVERURL_IMAGE.hostUrl;
        $scope.selectedTab              = '';
        $scope.query                    = {};
        $scope.query.name               = '';
        $scope.page                     = 0;
        $scope.pageSize                 = PAGINATION.pageSize;
        $scope.products                 = [];
        $scope.lastPage                 = false;
        $scope.isQueryInprogress        = false;
        $scope.isFreeSearch             = false;

        //Functions
        $scope.openProductDescription   = openProductDescription;
        $scope.reloadRoute              = reloadRoute;
        $scope.getProducts              = getProducts;
        $scope.promise                  = getProducts();
        $scope.setDepth                 = setDepth;
        $scope.getNumber                = getNumber;
        $scope.getSearchedResult        = getSearchedResult;
        $scope.loadMoreRecords          = loadMoreRecords;

        function getProducts() {
            var category;
            $scope.isQueryInprogress=true;
            $scope.isFreeSearch=false;
            if ($location.search().q) {
                try {
                    category = JSON.parse($location.search().q);
                } catch (e) {
                    category = $location.search().q;
                }
                //delete $location.$$search.q;
            }
            var productsPromise   = getProductPromise(category),
                categoriesPromise = CategoryService.getAllCategories(),
                loadPromise       = $q.all({ product: productsPromise, category: categoriesPromise});
            return loadPromise.then(getProductPageSuccess, failure);
        }

        function getSearchedResult(isFromLoadMore) {
            $scope.isFreeSearch=true;
            $scope.isQueryInprogress=true;
            if (!isFromLoadMore) {
                $scope.products = [];
                $scope.page = 0;
            }
            var params = {};
            params.query = $scope.query.name;
            $scope.page = $scope.page + 1;
            params.page = $scope.page;
            params.pageSize = $scope.pageSize;
            var productsPromise   = ProductService.getSearchedProduct(params),
                categoriesPromise = CategoryService.getAllCategories();
            if ($scope.query.name === '') {
                productsPromise = ProductService.getProducts(params);
            }
            if (!isFromLoadMore) {
                $scope.promise = $q.all({ product: productsPromise, category: categoriesPromise});
                return $scope.promise.then(getProductPageSuccess, failure);
            } else {
                $scope.lazyPromise = $q.all({ product: productsPromise, category: categoriesPromise});
                return $scope.lazyPromise.then(getProductPageSuccess, failure);
            }
        }

        /**
         * Set the breadcrums
         * @param  {object} category
         * @return {promise} of product service
         */
        function getProductPromise(category) {
            var params = {};
            $scope.page = $scope.page + 1;
            params.page = $scope.page;
            params.pageSize = $scope.pageSize;
            if (category) {
                if (category === 'featured') {
                    breadCrumb = { 'url': PAGE_URL.root + '?q=featured', 'displayName': 'FEATURED' };
                    BreadcrumbService.setBreadCrumb(breadCrumb);
                    return ProductService.getFeaturedProducts(params);
                } else {
                    var url           = PAGE_URL.root,
                        categoryEnURI = $filter('encodeUri')(category),
                        name          = category.name;
                    breadCrumb = { 'url': url + '?q=' + categoryEnURI, 'displayName': name };
                    BreadcrumbService.setBreadCrumb(breadCrumb);
                    return getProductsByCategory(category);
                }
            } else {
                BreadcrumbService.setBreadCrumb();
                return ProductService.getProducts(params);
            }
        }

        function getProductsByCategory(category) {
            var params = {};
            params.id = category.id;
            params.page = $scope.page;
            params.pageSize = $scope.pageSize;
            params.q = '*';
            return $q.all({ productByCategory: ProductService.getProductsByCategory(params)});
        }

        /**
         * Add depth parameter for each object in json of category
         * @param  {object} result categories
         * @return {void}
         */
        function getProductPageSuccess(result) {
            //Set Category
            var category = result.category || {};
            $scope.categories = category.category || category;
            // Set depth for category
            for (var i=0; i < $scope.categories.length; i=i + 1) {
                setDepth($scope.categories[i]);
            }
            //Set products
            var productList = extractProducts(result);
            $scope.products = $scope.products.concat(productList);
            $scope.length = $scope.products.length;
            if (productList.length === 0) {
                $scope.lastPage = true;
            }
            $scope.isQueryInprogress=false;
            $log.debug('getProductPageSuccess: ' + result);
        }

        /**
         * recursivly set depth for each object of json of category
         * @param {object} category category
         */
        function setDepth(category) {
            var depth = 0;
            var insertDepth = function(category, depth) {
                category.depth = depth;
                if (category.subcategories) {
                    insertDepth(category.subcategories, depth + 1);
                    for (var i=0; i < category.subcategories.length; i=i + 1) {
                        insertDepth(category.subcategories[i], depth + 1);
                    }
                }
            };
            insertDepth(category, depth + 1);
        }

        function extractProducts(result) {
            if (result.product) {
                if (result.product.products || result.product.productByCategory) {
                    result = result.product.products || result.product.productByCategory;
                } else {
                    result = result.product;
                }
            }
            var products = [];
            if (Array.isArray(result)) {
                products = result;
            } else {
                $log.debug('Root category tree structure');
                products = Utility.grabProducts(result, products);
            }
            Utility.checkImages(products);
            return products;
        }

        function failure() {
            $log.debug('Failure');
        }

        /**
         * Make search query as per click on category object
         * @param  {integer} productId
         * @param  {integer} categoryId
         * @param  {integer} categoryName [description]
         * @return {void}
         */
        function openProductDescription(productId, categoryId, categoryName) {
            var path = PAGE_URL.productDescription + '/';
            path += productId;
            $location.path(path).search('q', JSON.stringify({'id': categoryId, 'name': categoryName }));
        }

        /**
         * Refresh page
         */
        function reloadRoute() {
            console.log('reloadRoute');
            setTimeout(
                function() {
                    $window.location.reload();
                }, 1);
        }

        /**
         * Return the array with size passed to it of with num -2 length
         * add span tag for adding padding to left in category menu
         * @param  {integer} num
         * @return {array}     if number passed less then 2 return null else num-2
         */
        function getNumber(num) {
            if (num > 2) {
                return new Array(num - 2);
            } else {
                return null;
            }
        }

        function loadMoreRecords() {
            $log.debug('Load more results');
            if ($scope.isFreeSearch) {
                $scope.lazyPromise = getSearchedResult(true);
            } else {
                $scope.lazyPromise = getProducts();
            }
        }
    }

    ProductsController.$inject = [ '$scope',
        '$log',
        '$q',
        '$window',
        '$location',
        '$filter',
        'ProductService',
        'CategoryService',
        'CartService',
        'BreadcrumbService',
        '$routeParams',
        'PAGE_URL',
        'SERVERURL_IMAGE',
        'STATIC_IMAGE',
        'Utility',
        'PAGINATION'];
    byApp.registerController('ProductsController', ProductsController);
    return ProductsController;
});

