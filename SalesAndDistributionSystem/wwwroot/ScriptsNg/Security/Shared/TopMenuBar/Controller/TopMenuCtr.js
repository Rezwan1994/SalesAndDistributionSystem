ngApp.controller('ngGridCtrl', ['$scope', 'TopMenuServices', 'notificationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, TopMenuServices, permissionProvider, notificationservice, $http, $log, $filter, $timeout, $interval, $q) {

    $scope.model = { MENU_NAME: '',USER_NAME: 'User' }
    $scope.searchdata = [];
    


    $scope.DataLoad = function (companyId) {
        debugger
        $scope.showLoader = true;
        TopMenuServices.GetUserInfo().then(function (data) {
            $scope.model.USER_NAME = data.data;
            alert(data.data);

            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
 
    $scope.DataLoad();


    $scope.AutoCompleteDataLoadForMenu = function (value) {
        if (value.length >= 3) {

            return TopMenuServices.SearcableMenuLoad(value).then(function (data) {
                $scope.searchdata = data.data;
                return $scope.searchdata;
            }, function (error) {
                alert(error);
                debugger

                console.log(error);
            });
        }
    }


    $scope.typeaheadSelectedMenu = function (entity, selectedItem) {
        $scope.model.HREF = selectedItem.HREF;
        $scope.model.MENU_NAME = selectedItem.MENU_NAME;

    };
    $scope.LoadView = function () {
        if ($scope.model.HREF != null && $scope.model.HREF != '') {
            window.location = "/" + $scope.model.HREF;
        }
       

    };


}]);

