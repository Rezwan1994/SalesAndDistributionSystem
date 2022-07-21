ngApp.controller('ngGridCtrl', ['$scope', 'RolesServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, RolesServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    $scope.model = { COMPANY_ID: 0, ROLE_ID: 0, ROLE_NAME: '', UNIT_ID: 0 }

    $scope.showLoader = true;
    $scope.Companies = [];
    $scope.Units = [];


    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Roles Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }

    $scope.DataLoad = function (companyId) {
        debugger

        $scope.showLoader = true;
        RolesServices.GetRoles(companyId).then(function (data) {
            console.log(data.data)
            $scope.gridOptionsList.data = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.ClearForm = function () {
        $scope.model.ROLE_ID = 0;
        $scope.model.ROLE_NAME = "";
    }

    $scope.EditData = function (entity) {

        $scope.model.ROLE_ID = entity.ROLE_ID;
        $scope.model.ROLE_NAME = entity.ROLE_NAME;
        $scope.SaveData($scope.model);

    }
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'Role',
            Action_Name: 'Index'
        }
        permissionProvider.GetPermission($scope.permissionReqModel).then(function (data) {
            debugger
            console.log(data.data)
            $scope.getPermissions = data.data;
            $scope.model.ADD_PERMISSION = $scope.getPermissions.adD_PERMISSION;
            $scope.model.EDIT_PERMISSION = $scope.getPermissions.ediT_PERMISSION;
            $scope.model.DELETE_PERMISSION = $scope.getPermissions.deletE_PERMISSION;
            $scope.model.LIST_VIEW = $scope.getPermissions.lisT_VIEW;
            $scope.model.DETAIL_VIEW = $scope.getPermissions.detaiL_VIEW;
            $scope.model.DOWNLOAD_PERMISSION = $scope.getPermissions.downloaD_PERMISSION;
            $scope.model.USER_TYPE = $scope.getPermissions.useR_TYPE;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompaniesLoad = function () {
        $scope.showLoader = true;

        RolesServices.GetCompanyList().then(function (data) {
            console.log(data.data)
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        RolesServices.GetCompany().then(function (data) {
            debugger
            console.log(data.data)
            $scope.model.COMPANY_ID = parseInt(data.data);
            $scope.model.COMPANY_SEARCH_ID = parseInt(data.data);
            $interval(function () {
                $('#COMPANY_ID').trigger('change');
            }, 800, 4);

            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }


    $scope.UnitsLoad = function () {
        $scope.showLoader = true;

        RolesServices.GetUnitList($scope.model.COMPANY_ID).then(function (data) {
            debugger
            $scope.Units = [];
            console.log(data.data)
            $scope.Units = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.GetPermissionData();
    $scope.DataLoad(0);
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.UnitsLoad();


    $scope.gridOptionsList.columnDefs = [
        { name: 'SL', field: 'ROW_NO', enableFiltering: false, width: '40' }

        , { name: 'ROLE_ID', field: 'ROLE_ID', visible: false }

        , {
            name: 'ROLE_NAME', field: 'ROLE_NAME', displayName: 'Role', enableFiltering: false, width: ' 25%', cellTemplate:
                '<input required="required"   ng-model="row.entity.ROLE_NAME"  class="pl-sm" />'
        }
        , { name: 'UNIT_NAME', field: 'UNIT_NAME', displayName: 'Unit Name', enableFiltering: false, width: ' 20%' }

        , { name: 'STATUS', field: 'STATUS', displayName: 'Status', enableFiltering: false, width: ' 20%' }
        , { name: 'ENTERED_DATE', field: 'ENTERED_DATE', displayName: 'Date', enableFiltering: false, width: ' 20%'},
        {
            name: 'Action', displayName: 'Action', width: '35%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;"  ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Update</button>' +
                '<button style="margin-bottom: 5px;"  ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.ActivateRole(row.entity.ROLE_ID)" type="button" class="btn btn-outline-success mb-1"  ng-disabled="row.entity.STATUS == \'Active\'">Activate</button>' +
                '<button style="margin-bottom: 5px;"  ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" type="button" class="btn btn-outline-secondary mb-1" ng-disabled="row.entity.STATUS == \'InActive\'" ng-click="grid.appScope.DeactivateRole(row.entity.ROLE_ID)">Deactive</button>' +
                '</div>'
        },

    ];


    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;
        console.log(model);
        RolesServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.DataLoad($scope.model.COMPANY_ID);
                $scope.ClearForm();
            }
            else {
                $scope.showLoader = false;
            }
        });
    }


    $scope.ActivateRole = function (Id) {
        debugger
        $scope.showLoader = true;
        RolesServices.ActivateRole(Id).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Activated the selected Role !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.DataLoad($scope.model.COMPANY_ID);

            }
            else {
                $scope.showLoader = false;
            }
        });
    }

    $scope.DeactivateRole = function (Id) {
        debugger
        $scope.showLoader = true;
        RolesServices.DeactivateRole(Id).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Deactivated the selected Role !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.DataLoad($scope.model.COMPANY_ID);

            }
            else {
                $scope.showLoader = false;
            }
        });
    }


    

}]);

