function spTabset( SpTabConstant ){
    return {
        restrict : "E",
        transclude : true,
        scope : {
            tabObject : "="
        },
        bindToController : true,
        controllerAs : "tabset",
        replace : true,
        templateUrl : SpTabConstant.template.SP_TAB_SET,
        link : function(){
        },
        controller : function( $scope ){
            var vm = this;

            vm.active = function( $index ){
                if ( vm.tabObject.getTabAction().onActiveBefore( $index ) ){
                    vm.tabObject.activeTab( $index );
                    vm.tabObject.getTabAction().onActiveAfter();
                }
            }
        }
    };
}

module.exports = function(app){
    app.directive("spTabset", spTabset);
};