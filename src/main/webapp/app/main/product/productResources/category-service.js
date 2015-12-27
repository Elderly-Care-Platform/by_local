define([], function () {
  function CategoryServiceFactory(
    CachedRequestHandler,
    APPLICATION,
    REST_URL,
    urlTemplate,
    $q,
    $log) {

    $log.debug('Inside categoryService Service');
    var categoryService, urls;

    urls = {
      forAllCategories:   urlTemplate(REST_URL.allCategories + '?limit=' + APPLICATION.pageSize),
      forRootCategories:  urlTemplate(REST_URL.rootCategories + '?limit=' + APPLICATION.pageSize),
      forSubCategories:   urlTemplate(REST_URL.subCategories + '/:id')
    };

    categoryService = angular.extend(
      {},
      CachedRequestHandler,
      {
        modelName: 'category',
        baseURL:   urls.base,
        urls:      urls
      },
      {
        getAllCategories:     getAllCategories,
        getRootCategories:    getRootCategories,
        getSubCategories:     getSubCategories
      }
    );

    return categoryService;

    function getAllCategories(params) {
      return this.$get(urls.forAllCategories(params));
    }
    function getRootCategories(params) {
      return this.$get(urls.forRootCategories(params));
    }
    function getSubCategories(params) {
      return this.$get(urls.forSubCategories(params));
    }
  }
  return CategoryServiceFactory;
});
