function SpModal( $rootScope, $controller, $document, $q, $templateCache, $templateRequest, $compile, $window, SpModalConstant ){

    var body = angular.element($document[0].body);

    var backdropTemplate     = "<div class='sp-modal-backdrop out'></div>";
    var modalWrapperTemplate = "<div class='sp-modal-wrap out'><div class='sp-modal'></div></div>";

    var modalStack = [];


    function SpModal( options ){
        var _self = this;


        var _defaultOptions = {
            template : null,
            params : {},
            controller : null,
            size : "sm",
            modalAction : {
                onOpen : function(){

                },
                onClose : function(){

                },
                onResult : function(){

                }
            }
        };

        this.options = angular.extend({}, _defaultOptions, options);

        if( options.hasOwnProperty("modalAction")){
            this.options.modalAction = angular.extend({}, _defaultOptions.modalAction, options.modalAction );
        }
        this.init();

    }

    /**
     * 유틸리티 함수
     * @param $element
     */
    function modalIn( $element ){
        $element.removeClass("out");
        $element.addClass("in");
    }

    /**
     * 유틸리티 함수
     * @param $element
     */
    function modalOut( $element ){
        $element.removeClass("in");
        $element.addClass("out");
    }

    /**
     * Modal 초기화 함수 인스턴스 생성될때 호출
     */
    SpModal.prototype.init = function(){
        var _self   = this;
        var options = this.options;

        this.scope         = $rootScope.$new();
        this.$modalWrapper = angular.element(modalWrapperTemplate);
        this.$backdrop     = angular.element(backdropTemplate);

        this.$modalWrapper.find(".sp-modal").append($templateCache.get(options.template));


        var linkFn        = $compile( this.$modalWrapper );
        var modalTemplate = linkFn( this.scope );

        body.append( modalTemplate )
            .append( this.$backdrop );

        var ctrlInput = {
            $scope : _self.scope,
            instance : {
                close  : _self.close.bind(_self),
                result : _self.getModalAction().onResult.bind(_self)
            }
        };

        this.controller = $controller( options.controller, ctrlInput, false,  options.controllerAs || SpModalConstant.DEFAULT_MODAL_CONTROLLER_AS );

        this.controller.params = options.params;

    };

    /**
     * modalAction 설정
     * @param modalAction
     * @returns {SpModal}
     */
    SpModal.prototype.setModalAction = function( modalAction ){
        this.options.modalAction = modalAction;
        return this;
    };

    /**
     * modalAction 리턴
     * @returns {modalAction|{onOpen, onClose, onResult}|*|{onResult}}
     */
    SpModal.prototype.getModalAction = function(){
        return this.options.modalAction;
    };

    /**
     * Modal
     */
    SpModal.prototype.getSize = function(){
        return this.options.size;
    };

    /**
     * Modal Size 리턴
     * @param size
     * @returns {SpModal}
     */
    SpModal.prototype.setSize = function( size ){
        this.options.size = size;
        return this;
    };


    /**
     * modalInstance Return
     * @returns {SpModal}
     */
    SpModal.prototype.open = function(){
        var $spModal = this.$modalWrapper.find(".sp-modal");

        this.getModalAction().onOpen( this.controller );
        modalIn(this.$modalWrapper);
        modalIn(this.$backdrop);
        this.$modalWrapper.css("zIndex", SpModalConstant.MODAL_WRAPPER_ZINDEX + (modalStack.length*10) );
        this.$backdrop.css("zIndex" , SpModalConstant.BACKDROP_ZINDEX + (modalStack.length*10) );
        $spModal.css("top", ( $window.innerHeight / 2 ) - ( $spModal.height() / 2 ));
        modalStack.push(this);
        return this;
    };

    /**
     * Modal Instance Close
     * @returns {SpModal}
     */
    SpModal.prototype.close = function(){
        this.getModalAction().onClose( this.controller );
        modalOut(this.$backdrop);
        modalOut(this.$modalWrapper);
        modalStack.pop();
        return this;
    };

    /**
     * Modal Instance Destroy
     */
    SpModal.prototype.destroy = function(){
        this.$backdrop.remove();
        this.$modalWrapper.remove();
        this.scope.$destroy();
    };


    return SpModal;
}

module.exports = function( app ){
    app.factory("SpModal", SpModal)
        .constant("SpModalConstant", {
            MODAL_WRAPPER_ZINDEX : 1050,
            BACKDROP_ZINDEX : 1040,
            DEFAULT_MODAL_CONTROLLER_AS : "modal"
        });
};