define([], function () {

    function BreadcrumbServiceFactory(Global,
                                      PAGE_URL,
                                      $log) {
        $log.debug('Inside Breadcrumb Service');

        var breadcrumbService,
            defaultBreadCrumb = {
                'list': [{
                    'url': PAGE_URL.root,
                    'displayName': 'SHOP'
                }], 'last': 'ALL'
            };

        breadcrumbService = {
            getBreadCrumb: getBreadCrumb,
            setBreadCrumb: setBreadCrumb
        };

        return breadcrumbService;

        function getBreadCrumb() {
            return Global.rootScope.breadcrumb;
        }

        function setBreadCrumb(breadcrumb, last) {
            var breadcrumbTemplate = getBreadCrumbTemplate();
            if (breadcrumb !== undefined) {
                if (breadcrumb instanceof Array) {
                    for (var bcObj in breadcrumb) {
                        breadcrumbTemplate.list.push(breadcrumb[bcObj]);
                    }
                } else {
                    breadcrumbTemplate.list.push(breadcrumb);
                }
            }
            if (last !== undefined) {
                breadcrumbTemplate.last = last;
            }
            Global.setInRootScope('breadcrumb', breadcrumbTemplate || defaultBreadCrumb);
        }

        //Private functions
        function getBreadCrumbTemplate() {
            return {
                'list': [{
                    'url': PAGE_URL.root,
                    'displayName': 'SHOP'
                }], 'last': 'ALL'
            };
        }
    }

    return BreadcrumbServiceFactory;
});
