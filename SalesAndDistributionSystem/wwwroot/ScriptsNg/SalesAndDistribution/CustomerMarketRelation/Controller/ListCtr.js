﻿ngApp.controller('ngGridCtrl', ['$scope', 'InsertOrEditServices', 'CustomerInfoServices', 'MarketInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, InsertOrEditServices, CustomerInfoServices, MarketInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = { COMPANY_ID: 0, CUSTOMER_ID: 0, CUSTOMER_CODE: '', CUSTOMER_MARKET_MST_STATUS: 'Active', EFFECT_START_DATE: '', EFFECT_END_DATE: '', REMARKS: ''}


    'use strict'
    $scope.model = { COMPANY_ID: 0, CUSTOMER_ID: 0, CUSTOMER_NAME: '', CUSTOMER_CODE: '', CUSTOMER_ADDRESS: '', REMARKS: '', CUSTOMER_STATUS: 'Active' }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Status = [];

    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Customer Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false, width: '50'
        }
        
        , { name: 'CUSTOMER_MARKET_MST_ID', field: 'CUSTOMER_ID', visible: false }
        
        , { name: 'CUSTOMER_ID', field: 'CUSTOMER_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }

        , {
            name: 'CUSTOMER_NAME', field: 'CUSTOMER_NAME', displayName: 'Name', enableFiltering: true, width: '20%'
        }
        , {
            name: 'CUSTOMER_CODE', field: 'CUSTOMER_CODE', displayName: 'Code', enableFiltering: true, width: '12%'
        }
        , {
            name: 'EFFECT_START_DATE', field: 'EFFECT_START_DATE', displayName: 'Start', enableFiltering: true, width: '13%'
        }
        , {
            name: 'EFFECT_END_DATE', field: 'EFFECT_END_DATE', displayName: 'End', enableFiltering: true, width: '13%'
        }
        , {
            name: 'REMARKS', field: 'REMARKS', displayName: 'Remark', enableFiltering: true, width: '13%'
        }
        , { name: 'CUSTOMER_MARKET_MST_STATUS', field: 'CUSTOMER_MARKET_MST_STATUS', displayName: 'Status', enableFiltering: true, width: '15%' }
        , {
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Update</button>' +
                '</div>'
        },

    ];

    $scope.EditData = function (entity) {
        debugger
        window.location = "/SalesAndDistribution/CustomerMarketRelation/InsertOrEdit?Id=" + entity.CUSTOMER_MARKET_MST_ID_ENCRYPTED;

    }
    
    $scope.DataLoad = function (companyId) {
        debugger
        $scope.showLoader = true;

        InsertOrEditServices.LoadData(companyId).then(function (data) {
            debugger
            console.log(data.data)
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

        CustomerInfoServices.GetCompany().then(function (data) {
            console.log(data.data)
            $scope.model.COMPANY_ID = parseFloat(data.data);
            $scope.DataLoad($scope.model.COMPANY_ID);
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

        CustomerInfoServices.GetCompanyList().then(function (data) {
            console.log(data.data)
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
   
   
    $scope.ClearForm = function () {
        window.location = "/SalesAndDistribution/CustomerMarketRelation/List";
    }

    

    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'CustomerMarketRelation',
            Action_Name: 'List'
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
  

}]);

