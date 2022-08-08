ngApp.controller('ngGridCtrl', ['$scope', 'CreditInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, CreditInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = {
        CREDIT_ID: 0,
        COMPANY_ID: 0,
        CUSTOMER_ID: "",
        CUSTOMER_CODE: null,
        EFFECT_START_DATE: ""
        , EFFECT_END_DATE: ""
        , CUSTOMER_STATUS: ""
        , REMARKS: ""
        , ENTRY_DATE: ""
        , CREDIT_LIMIT: 0
        , CREDIT_DAYS:0
      
    }


    $scope.getPermissions = [];
    $scope.ProductList = [];
    $scope.Companies = [];
    $scope.Unit = [];
    $scope.CustomerData = [];
    $scope.CustomerType = [];


    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Product Price Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }

    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false, width: '50'
        }
        , {
            name: 'CUSTOMER_NAME', field: 'CUSTOMER_NAME', displayName: 'NAME', enableFiltering: true, width: '20%'
        }
        , {
            name: 'CUSTOMER_CODE', field: 'CUSTOMER_CODE', displayName: 'CODE', enableFiltering: true, width: '10%'
        }
        , {
            name: 'EFFECT_START_DATE', field: 'EFFECT_START_DATE', displayName: 'EFFECT START DATE', enableFiltering: true, width: '15%'
        }
        , {
            name: 'EFFECT_END_DATE', field: 'EFFECT_END_DATE', displayName: 'EFFECT END DATE', enableFiltering: true, width: '15%'
        }
        , {
            name: 'CREDIT_LIMIT', field: 'CREDIT_LIMIT', displayName: 'CREDIT LIMIT', enableFiltering: true, width: '10%'
        }
        , {
            name: 'CREDIT_DAYS', field: 'CREDIT_DAYS', displayName: 'CREDIT_DAYS', enableFiltering: true, width: '10%'
        }
        , {
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Update</button>' +
                '</div>'
        },

    ];


    $scope.LoadCustomerTypeData = function () {
        $scope.showLoader = true;

        CreditInfoServices.LoadCustomerTypeData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.CustomerType = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }




    $scope.ClearForm = function () {
        window.location.href = "/SalesAndDistribution/CreditInfo/CreditPriceInfo";
    }
    $scope.DataLoad = function (companyId) {
        $scope.showLoader = true;
    
        setTimeout(function () {
            CreditInfoServices.LoadData($scope.model.companyId).then(function (data) {
                debugger;

                var dataList = data.data;
                $scope.gridOptionsList.data = dataList;
              
                $scope.showLoader = false;

            }, function (error) {
                alert(error);
                $scope.showLoader = false;

            });
        }, 2000)

    }
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        CreditInfoServices.GetCompany().then(function (data) {
            console.log(data.data)
            $scope.model.COMPANY_ID = parseFloat(data.data);
            /*            $scope.DataLoad($scope.model.COMPANY_ID);*/
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

        CreditInfoServices.GetCompanyList().then(function (data) {
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }




    $scope.LoadUNIT_ID = function () {
        $('#UNIT_ID').trigger('change');
    }

    $scope.LoadCOMPANY_ID = function () {
        $('#COMPANY_ID').trigger('change');
    }
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'ProductPrice',
            Action_Name: 'ProductPriceInfo'
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
    $scope.LoadUnitData = function () {
        $scope.showLoader = true;

        CreditInfoServices.LoadUnitData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Unit = data.data.filter(function (element) { return element.COMPANY_ID == $scope.model.COMPANY_ID });;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.typeaheadSelectedCustomer = function () {
        debugger
        const searchIndex = $scope.CustomerData.findIndex((x) => x.CUSTOMER_ID == $scope.model.CUSTOMER_ID);

        $scope.model.CUSTOMER_CODE = $scope.CustomerData[searchIndex].CUSTOMER_CODE;
        $scope.model.CUSTOMER_STATUS = $scope.CustomerData[searchIndex].CUSTOMER_STATUS;
    };
    $scope.LoadCustomerData = function () {
        $scope.showLoader = true;

        CreditInfoServices.LoadCustomerData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.CustomerData = data.data.filter(function (element) { return element.COMPANY_ID == $scope.model.COMPANY_ID });;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }


    $scope.EditData = function (entity) {
       
        $scope.model.CREDIT_ID = entity.CREDIT_ID;
        $scope.model.COMPANY_ID = entity.COMPANY_ID;
        $scope.model.CUSTOMER_ID = entity.CUSTOMER_ID;
        $scope.model.CUSTOMER_CODE = entity.CUSTOMER_CODE;
        $scope.model.EFFECT_START_DATE = entity.EFFECT_START_DATE;
        $scope.model.EFFECT_END_DATE = entity.EFFECT_END_DATE;
        $scope.model.CUSTOMER_STATUS = entity.CUSTOMER_STATUS;
        $scope.model.REMARKS = entity.REMARKS;
        $scope.model.ENTRY_DATE = entity.ENTRY_DATE;
        $scope.model.CREDIT_LIMIT = entity.CREDIT_LIMIT;
        $scope.model.CREDIT_DAYS = entity.CREDIT_DAYS;


        $interval(function () {
            $('#COMPANY_ID').trigger('change');
        }, 800, 4);
    }

    $scope.DataLoad(0);
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.LoadUnitData();
    $scope.LoadCustomerData();
    $scope.LoadCustomerTypeData();



    $scope.SaveData = function (model) {
        debugger
        var flag = false;

        $scope.showLoader = true;


        console.log(model);

        CreditInfoServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;

                window.setTimeout(function () {
                    window.location.href = "/SalesAndDistribution/CreditInfo/CreditInfo";
                }, 2000)
            }
            else {

                $scope.showLoader = false;
            }
      
        });
    }

}]);


