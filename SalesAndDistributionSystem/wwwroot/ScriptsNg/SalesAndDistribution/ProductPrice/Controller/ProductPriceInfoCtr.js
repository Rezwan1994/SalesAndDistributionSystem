ngApp.controller('ngGridCtrl', ['$scope', 'ProductPriceInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, ProductPriceInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = {
        COMPANY_ID : 0
        , EMPLOYEE_PRICE:  0
        , GROSS_PROFIT : 0
        , MRP : 0
        , SKU_CODE : ''
        , SKU_ID : 0
        , SPECIAL_PRICE : 0
        , SUPPLIMENTARY_TAX : 0
        , UNIT_ID : 0
        , UNIT_TP : 0
        , UNIT_VAT : 0
        , PRICE_ID : 0
    }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Unit = [];
    $scope.ProductList = [];
    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Product Price Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false,  width: '50'
        } 
       
        , { name: 'PRICE_ID', field: 'PRODUCT_TYPE_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }
        , { name: 'SKU_ID', field: 'SKU_ID', visible: false }
        , { name: 'UNIT_ID', field: 'UNIT_ID', visible: false }
        , { name: 'PRICE_ID', field: 'PRICE_ID', visible: false }

        , {
            name: 'SKU_CODE', field: 'SKU_CODE', displayName: 'Product Code', enableFiltering: true, width: '15%'
        }
        , {
            name: 'MRP', field: 'MRP', displayName: 'MRP Price', enableFiltering: true, width: '10%'
        }

        , {
            name: 'EMPLOYEE_PRICE', field: 'EMPLOYEE_PRICE', displayName: 'Employee Price', enableFiltering: true, width: '12%'
        }
        , {
            name: 'SPECIAL_PRICE', field: 'SPECIAL_PRICE', displayName: 'Special Price', enableFiltering: true, width: '10%'
        }
       
        , {
            name: 'GROSS_PROFIT', field: 'GROSS_PROFIT', displayName: 'Gross Profit', enableFiltering: true, width: '10%'
        }
        , { name: 'SUPPLIMENTARY_TAX', field: 'SUPPLIMENTARY_TAX', displayName: 'Supplimentary Tax', enableFiltering: true, width: '13%' }
        , { name: 'UNIT_TP', field: 'UNIT_TP', displayName: 'Unit TP', enableFiltering: true, width: '10%' }
        , { name: 'UNIT_VAT', field: 'UNIT_VAT', displayName: 'Unit VAT', enableFiltering: true, width: '10%' }
        , { name: 'PRICE_EFFECT_DATE', field: 'PRICE_EFFECT_DATE', displayName: 'Price Effect Start', enableFiltering: true, width: '15%' }
        , { name: 'PRICE_ENTRY_DATE', field: 'PRICE_ENTRY_DATE', displayName: 'Price Entry Start', enableFiltering: true, width: '15%' }

        ,{
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Update</button>' +
                '</div>'
        },

    ];

    $scope.DataLoad = function (companyId) {
        debugger
        $scope.showLoader = true;

        ProductPriceInfoServices.LoadData(companyId).then(function (data) {
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

        ProductPriceInfoServices.GetCompany().then(function (data) {
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

        ProductPriceInfoServices.GetCompanyList().then(function (data) {
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
        window.location.href = "/SalesAndDistribution/ProductPrice/ProductPriceInfo";
    }

    $scope.EditData = function (entity) {
        debugger

        $scope.model.COMPANY_ID = entity.COMPANY_ID;
        $scope.model.EMPLOYEE_PRICE = entity.EMPLOYEE_PRICE;
        $scope.model.GROSS_PROFIT = entity.GROSS_PROFIT;
        $scope.model.MRP = entity.MRP;
        $scope.model.SKU_CODE = entity.SKU_CODE;
        $scope.model.SKU_NAME = entity.SKU_NAME;
        $scope.model.PRICE_EFFECT_DATE = entity.PRICE_EFFECT_DATE;
        $scope.model.PRICE_ENTRY_DATE = entity.PRICE_ENTRY_DATE;

        $scope.model.SKU_ID = entity.SKU_ID;
        $scope.model.SPECIAL_PRICE = entity.SPECIAL_PRICE;
        $scope.model.SUPPLIMENTARY_TAX = entity.SUPPLIMENTARY_TAX;
        $scope.model.UNIT_ID = entity.UNIT_ID;
        $scope.model.UNIT_TP = entity.UNIT_TP;
        $scope.model.UNIT_VAT = entity.UNIT_VAT;
        $scope.model.PRICE_ID = entity.PRICE_ID;
        $interval(function () {
            $scope.LoadCOMPANY_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadUNIT_ID();
        }, 800, 2);
       
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

        ProductPriceInfoServices.LoadUnitData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Unit = data.data.filter(function (element) { return element.COMPANY_ID == $scope.model.COMPANY_ID });;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
  
    $scope.AutoCompleteDataLoadForPrpoduct = function (value) {
        if (value.length >= 3) {
            debugger

            return ProductPriceInfoServices.GetSearchableProduct( $scope.model.COMPANY_ID,value).then(function (data) {
                $scope.ProductList = data.data;
                debugger

                return $scope.ProductList;
            }, function (error) {
                alert(error);
                debugger

                console.log(error);
            });
        }
    }


    $scope.typeaheadSelectedProduct = function (entity, selectedItem) {
        $scope.model.SKU_ID = selectedItem.SKU_ID;
        $scope.model.SKU_NAME = selectedItem.SKU_NAME;
        $scope.model.SKU_CODE = selectedItem.SKU_CODE;

    };
    $scope.DataLoad(0);
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.LoadUnitData();

    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;
        console.log(model);
        model.UNIT_ID = parseInt(model.UNIT_ID);
        ProductPriceInfoServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;

                window.setTimeout(function () {
                    window.location.href = "/SalesAndDistribution/ProductPrice/ProductPriceInfo";
                }, 2000)
            }
            else {
                $scope.showLoader = false;
            }
        });
    }

}]);

