ngApp.controller('ngGridCtrl', ['$scope', 'BrandInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, BrandInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = { COMPANY_ID: 0, BRAND_ID: 0, BRAND_NAME: '', BRAND_CODE: '',  REMARKS: '', STATUS: 'Active' }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Status = [];

    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Brand Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false,  width: '50'
        }

        , { name: 'BRAND_ID', field: 'BRAND_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }
     
        , {
            name: 'BRAND_NAME', field: 'BRAND_NAME', displayName: 'Name', enableFiltering: true, width: '22%'    
        }
        , {
            name: 'BRAND_CODE', field: 'BRAND_CODE', displayName: 'Code', enableFiltering: true, width: '15%'
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

        BrandInfoServices.LoadData(companyId).then(function (data) {
            debugger
            $scope.gridOptionsList.data = data.data;
            $scope.ClearForm();
        }, function (error) {
            debugger
            alert(error);
            console.log(error);

        });
    }
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        BrandInfoServices.GetCompany().then(function (data) {
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

        BrandInfoServices.GetCompanyList().then(function (data) {
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadGeneratedBrandCode = function () {
       
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
        $scope.model.BRAND_ID = 0;
        $scope.model.BRAND_NAME = '';
        $scope.model.BRAND_CODE = '';
        $scope.model.STATUS = 'Active';
        $scope.model.REMARKS = '';

    }
    $scope.LoadFormData = function () {
        debugger

        BrandInfoServices.LoadData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            $scope.gridOptionsList.data = data.data;
           
            for (var i in $scope.gridOptionsList.data) {
                debugger
                if ($scope.gridOptionsList.data[i].BRAND_NAME == $scope.model.BRAND_NAME) {
                    debugger
                    $scope.model.BRAND_ID = $scope.gridOptionsList.data[i].BRAND_ID;
                    $scope.model.BRAND_NAME = $scope.gridOptionsList.data[i].BRAND_NAME;
                    $scope.model.BRAND_CODE = $scope.gridOptionsList.data[i].BRAND_CODE;
                    $scope.model.STATUS = $scope.gridOptionsList.data[i].STATUS;
                    $scope.model.REMARKS = $scope.gridOptionsList.data[i].REMARKS;
                    $scope.model.COMPANY_SEARCH_ID = $scope.model.COMPANY_ID;
                }
            }
        }, function (error) {
            debugger
            alert(error);
            console.log(error);

        });
        

    }

    $scope.EditData = function (entity) {
        debugger
        $scope.model.BRAND_ID = entity.BRAND_ID;
        $scope.model.BRAND_NAME = entity.BRAND_NAME;
        $scope.model.BRAND_CODE = entity.BRAND_CODE;
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
            Controller_Name: 'Brand',
            Action_Name: 'BrandInfo'
        }
        permissionProvider.GetPermission($scope.permissionReqModel).then(function (data) {
            debugger
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

    $scope.DataLoad(parseInt($scope.model.COMPANY_ID));
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.LoadStatus();


    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;

        $scope.model.COMPANY_ID = parseInt($scope.model.COMPANY_ID);
        BrandInfoServices.AddOrUpdate(model).then(function (data) {
            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
              
                $scope.LoadFormData();
              
            }
           
            $scope.showLoader = false;

        });
    }

}]);

