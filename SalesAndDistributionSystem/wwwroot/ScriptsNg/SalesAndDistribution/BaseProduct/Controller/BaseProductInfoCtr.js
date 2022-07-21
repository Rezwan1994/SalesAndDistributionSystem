ngApp.controller('ngGridCtrl', ['$scope', 'BaseProductInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, BaseProductInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = { COMPANY_ID: 0, BASE_PRODUCT_ID: 0, BASE_PRODUCT_NAME: '', BASE_PRODUCT_CODE: '',  REMARKS: '', STATUS: 'Active' }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Status = [];

    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Base_Product Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false,  width: '50'
        }

        , { name: 'BASE_PRODUCT_ID', field: 'BASE_PRODUCT_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }
     
        , {
            name: 'BASE_PRODUCT_NAME', field: 'BASE_PRODUCT_NAME', displayName: 'Name', enableFiltering: true, width: '22%'    
        }
        , {
            name: 'BASE_PRODUCT_CODE', field: 'BASE_PRODUCT_CODE', displayName: 'Code', enableFiltering: true, width: '15%'
        }
       
        , {
            name: 'REMARKS', field: 'REMARKS', displayName: 'Remark', enableFiltering: true, width: '25%'
        }
        , { name: 'STATUS', field: 'STATUS', displayName: 'Status', enableFiltering: true, width: '18%' }
        ,{
            name: 'Action', displayName: 'Action', width: '18%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Update</button>' +
                '</div>'
        },

    ];

    $scope.DataLoad = function (companyId) {
        debugger
        $scope.showLoader = true;

        BaseProductInfoServices.LoadData(companyId).then(function (data) {
            debugger
            $scope.gridOptionsList.data = data.data;
            $scope.showLoader = false;
            $scope.model.COMPANY_SEARCH_ID = companyId;
        }, function (error) {
            debugger
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        BaseProductInfoServices.GetCompany().then(function (data) {
            console.log(data.data)
            $scope.model.COMPANY_ID = parseFloat(data.data);
            $interval(function () {
                $('#COMPANY_ID').trigger('change');
            }, 800, 4);
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompaniesLoad = function () {
        $scope.showLoader = true;

        BaseProductInfoServices.GetCompanyList().then(function (data) {
            console.log(data.data)
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadGeneratedBaseProductCode = function () {
        $scope.showLoader = true;
        debugger
        BaseProductInfoServices.GenerateBaseProductCode($scope.model.COMPANY_ID).then(function (data) {
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadStatus = function () {
        var Active = {
            STATUS: 'Active'
        }
        var InActive = {
            STATUS: 'InActive'
        }
        $scope.Status.push(Active);
        $scope.Status.push(InActive);

    }
    $scope.ClearForm = function () {
        $scope.model.BASE_PRODUCT_ID = 0;
        $scope.model.BASE_PRODUCT_NAME = '';
        $scope.model.BASE_PRODUCT_CODE = '';
        $scope.model.STATUS = 'Active';
        $scope.model.REMARKS = '';

    }
    $scope.LoadFormData = function () {
        debugger
        $scope.showLoader = true;

        BaseProductInfoServices.LoadData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            $scope.gridOptionsList.data = data.data;
            $scope.showLoader = false;
            $scope.model.COMPANY_SEARCH_ID = $scope.model.COMPANY_ID;
            for (var i in $scope.gridOptionsList.data) {
                debugger
                if ($scope.gridOptionsList.data[i].BASE_PRODUCT_NAME == $scope.model.BASE_PRODUCT_NAME) {
                    debugger
                    $scope.model.BASE_PRODUCT_ID = $scope.gridOptionsList.data[i].BASE_PRODUCT_ID;
                    $scope.model.BASE_PRODUCT_NAME = $scope.gridOptionsList.data[i].BASE_PRODUCT_NAME;
                    $scope.model.BASE_PRODUCT_CODE = $scope.gridOptionsList.data[i].BASE_PRODUCT_CODE;
                    $scope.model.STATUS = $scope.gridOptionsList.data[i].STATUS;
                    $scope.model.REMARKS = $scope.gridOptionsList.data[i].REMARKS;
                }
            }
        }, function (error) {
            debugger
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
       
       

    }


    $scope.EditData = function (entity) {
        debugger
        $scope.model.BASE_PRODUCT_ID = entity.BASE_PRODUCT_ID;
        $scope.model.BASE_PRODUCT_NAME = entity.BASE_PRODUCT_NAME;
        $scope.model.BASE_PRODUCT_CODE = entity.BASE_PRODUCT_CODE;
        $scope.model.COMPANY_ID = entity.COMPANY_ID;
        $scope.model.STATUS = entity.STATUS;
        $scope.model.REMARKS = entity.REMARKS;
        $interval(function () {
            $('#COMPANY_ID').trigger('change');
        }, 800, 4);
    }

    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'BaseProduct',
            Action_Name: 'BaseProductInfo'
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
   
    $scope.DataLoad(0);
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.LoadStatus();


    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;
        console.log(model);
        BaseProductInfoServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.GetPermissionData();
                $scope.CompanyLoad();
                $scope.LoadStatus();
                $scope.LoadFormData();
               
            }
            else {
                $scope.showLoader = false;
            }
        });
    }

}]);

