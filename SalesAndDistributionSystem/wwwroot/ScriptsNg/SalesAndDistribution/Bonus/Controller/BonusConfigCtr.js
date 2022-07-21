﻿ngApp.controller('ngGridCtrl', ['$scope', 'BonusConfigServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, BonusConfigServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = { COMPANY_ID: 0,STATUS: 'Active' }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Status = [];
    $scope.BaseProducts = [];
    $scope.Categories = [];
    $scope.Brands = [];
    $scope.Groups = [];
    $scope.Products = [];
    $scope.LocationTypes = [];
    $scope.Locations = [];
    $scope.SlabType = [];
    $scope.BonusType = [];
    $scope.CalculationType = [];
    $scope.BonusList = [];
    $scope.ProductList = [];


    $scope.gridLocationList = (gridregistrationservice.GridRegistration("Location Info"));
    $scope.gridLocationList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridLocationList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false, width: '50'
        }

        , { name: 'BONUS_LOCATION_ID', field: 'BONUS_LOCATION_ID', visible: false }
        , { name: 'BONUS_MST_ID', field: 'BONUS_MST_ID', visible: false }

        , {
            name: 'LOCATION_ID', field: 'LOCATION_ID', displayName: 'Name', enableFiltering: true, width: '20%', visible: false,
        }
        , {
            name: 'LOCATION_CODE', field: 'LOCATION_CODE', displayName: 'Location Code', enableFiltering: true, width: '30%'
        },
         {
            name: 'LOCATION_NAME', field: 'LOCATION_NAME', displayName: 'Location Name', enableFiltering: true, width: '30%'
        }
        , {
            name: 'LOCATION_TYPE', field: 'LOCATION_TYPE', displayName: 'Location', visible: false, width: '18%'
        }
        , {
            name: 'STATUS', field: 'STATUS', displayName: 'Status', enableFiltering: true, width: '25%', cellTemplate:
                '<select class="select2-single form-control"  id="LOCATION_STATUS"' +
                'name="STATUS" ng-model="row.entity.STATUS" style="width:100%" >' +
                '<option ng-repeat="item in grid.appScope.Status" ng-selected="item.STATUS == row.entity.STATUS" value="{{item.STATUS}}">{{ item.STATUS }} </option>' +
                '</select>'
        }
        ,{
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-disabled="row.entity.BONUS_LOCATION_ID>0" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.removeItemLocation(row.entity)" type="button" class="btn btn-outline-primary mb-1">Delete</button>' +
                '</div>'
        },

    ];
    $scope.gridProductList = (gridregistrationservice.GridRegistration("Product Info"));
    $scope.gridProductList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridProductList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false, width: '50'
        }

        , { name: 'BONUS_DECLARE_ID', field: 'BONUS_DECLARE_ID', visible: false }
        , {
            name: 'BONUS_MST_ID', field: 'BONUS_MST_ID', visible: false, width: '12%'
        }
        , {
            name: 'SKU_ID', field: 'SKU_ID', displayName: 'SKU_ID', enableFiltering: true, width: '20%', visible: false,
        }
        , {
            name: 'BRAND_ID', field: 'BRAND_ID', displayName: 'BRAND_ID', enableFiltering: true, width: '20%', visible: false,
        }
         , { name: 'BASE_PRODUCT_ID', field: 'BASE_PRODUCT_ID', visible: false }

        , {
            name: 'CATEGORY_ID', field: 'CATEGORY_ID', displayName: 'Name', enableFiltering: true, width: '20%', visible: false,
        }
        , {
            name: 'GROUP_ID', field: 'GROUP_ID', displayName: 'GROUP_ID', enableFiltering: true, width: '18%', visible: false,
        }
      
        , { 
            name: 'SKU_CODE', field: 'SKU_CODE', displayName: 'SKU Code', enableFiltering: true, width: '12%'
        }
        , {
            name: 'SKU_NAME', field: 'SKU_NAME', displayName: 'SKU Name', enableFiltering: true, width: '12%'
        }
        , {
            name: 'PACK_SIZE', field: 'PACK_SIZE', displayName: 'Pack Size', enableFiltering: true, width: '10%'
        }
        , {
            name: 'GROUP_NAME', field: 'GROUP_NAME', displayName: 'Group', enableFiltering: true, width: '12%'
        }
        , {
            name: 'BRAND_NAME', field: 'BRAND_NAME', displayName: 'Brand', enableFiltering: true, width: '12%'
        }
        , {
            name: 'CATEGORY_NAME', field: 'CATEGORY_NAME', displayName: 'Category', enableFiltering: true, width: '12%'
        }
        , {
            name: 'BASE_PRODUCT_NAME', field: 'BASE_PRODUCT_NAME', displayName: 'Base Product', enableFiltering: true, width: '12%'
        }
        , {
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-disabled="row.entity.BONUS_DECLARE_ID>0" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.removeItemDeclareProduct(row.entity)" type="button" class="btn btn-outline-primary mb-1">Delete</button>' +
                '</div>'
        },

    ];

    $scope.BonusTypeLoad = function () {
        var Disc_PCT = {
            BONUS_TYPE: 'Disc_%'
        }
        var Disc_Value = {
            BONUS_TYPE: 'Disc_Value'
        }
        var SKU = {
            BONUS_TYPE: 'SKU'
        }
        var Gift = {
            BONUS_TYPE: 'Gift'
        }
        $scope.BonusType.push(Disc_PCT);
        $scope.BonusType.push(Disc_Value);
        $scope.BonusType.push(SKU);
        $scope.BonusType.push(Gift);

    }

    $scope.SlabTypeLoad = function () {
        var Normal = {
            BONUS_SLAB_TYPE: 'Normal'
        }
        var Slab = {
            BONUS_SLAB_TYPE: 'Slab'
        }
        $scope.SlabType.push(Normal);
        $scope.SlabType.push(Slab);

    }
    $scope.CalculationTypeLoad = function () {
        var Fixed = {
            CALCULATION_TYPE: 'Fixed'
        }
        var Ratio = {
            CALCULATION_TYPE: 'Ratio'
        }
        $scope.CalculationType.push(Fixed);
        $scope.CalculationType.push(Ratio);

    }
    $scope.gridBonusDefalutData = function () {
        return {
            ROW_NO: 0, COMPANY_ID: 0, BONUS_DTL_ID: 0, BONUS_MST_ID: 0, BONUS_SLAB_TYPE: '', SLAB_QTY: 0, BONUS_TYPE: '', CALCULATION_TYPE: '', BONUS_SKU_ID: 0, BONUS_QTY: 0, DISCOUNT_PCT: 0, DISCOUNT_VAL: 0, GIFT_ITEM_ID: 0, GIFT_QTY: 0
        }
    }
    $scope.gridBonusList = (gridregistrationservice.GridRegistration("Bonus Info"));
    $scope.gridBonusList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridBonusList.data = [];

    //Grid Register
    $scope.gridBonusList = {
        data: [$scope.gridBonusDefalutData()]
    }


    //Generate New Row No
    $scope.rowNumberGenerate = function () {
        debugger
        for (let i = 0; i < $scope.gridBonusList.data.length; i++) {
            debugger
            $scope.gridBonusList.data[i].ROW_NO = i;
        }

    }
    $scope.rowNumberGenerateLocation = function () {
        debugger
        for (let i = 0; i < $scope.gridLocationList.data.length; i++) {
            debugger
            $scope.gridLocationList.data[i].ROW_NO = i+1;
        }

    }
    $scope.rowNumberGenerateProduct = function () {
        debugger
        for (let i = 0; i < $scope.gridProductList.data.length; i++) {
            debugger
            $scope.gridProductList.data[i].ROW_NO = i+1;
        }

    }
    //Add New Row

    $scope.addNewRow = () => {
        debugger
        if ($scope.gridBonusList.data.length > 0 && $scope.gridBonusList.data[0].SLAB_QTY != null && $scope.gridBonusList.data[0].SLAB_QTY != '' && $scope.gridBonusList.data[0].SLAB_QTY != 'undefined') {
            var newRow = {
                ROW_NO: 0, COMPANY_ID: $scope.model.COMPANY_ID, CALCULATION_TYPE: $scope.gridBonusList.data[0].CALCULATION_TYPE, BONUS_SKU_ID: $scope.gridBonusList.data[0].BONUS_SKU_ID,  BONUS_DTL_ID: $scope.gridBonusList.data[0].BONUS_DTL_ID, BONUS_MST_ID: $scope.gridBonusList.data[0].BONUS_MST_ID, BONUS_SLAB_TYPE: $scope.gridBonusList.data[0].BONUS_SLAB_TYPE, SLAB_QTY: $scope.gridBonusList.data[0].SLAB_QTY, BONUS_TYPE: $scope.gridBonusList.data[0].BONUS_TYPE, BONUS_QTY: $scope.gridBonusList.data[0].BONUS_QTY, DISCOUNT_PCT: $scope.gridBonusList.data[0].DISCOUNT_PCT, DISCOUNT_VAL: $scope.gridBonusList.data[0].DISCOUNT_VAL, GIFT_ITEM_ID: $scope.gridBonusList.data[0].GIFT_ITEM_ID, GIFT_QTY: $scope.gridBonusList.data[0].GIFT_QTY
                }
            var newRowSelected = {
                ROW_NO: 0, COMPANY_ID: 0, BONUS_DTL_ID: 0, BONUS_MST_ID: 0, CALCULATION_TYPE: 'Fixed', BONUS_SLAB_TYPE: 'Normal', SLAB_QTY: 0, BONUS_TYPE: '', BONUS_QTY: 0, DISCOUNT_PCT: 0, DISCOUNT_VAL: 0,BONUS_SKU_ID:0, GIFT_ITEM_ID: 0, GIFT_QTY: 0
            }
            debugger
                $scope.BonusList.push(newRowSelected);
                $scope.gridBonusList.data.push(newRow);
                $scope.gridBonusList.data[0] = $scope.gridBonusDefalutData();
    
            $interval(function () {
                $scope.LoadBONUS_SLAB_TYPE();
            }, 800, 2);
            $interval(function () {
                $scope.LoadGIFT_ITEM_ID();
            }, 800, 2);
            $interval(function () {
                $scope.LoadBONUS_SKU_ID();
            }, 800, 2);
            $interval(function () {
                $scope.LoadCALCULATION_TYPE();
            }, 800, 2);
            $interval(function () {
                $scope.LoadBONUS_TYPE();
            }, 800, 2);
      
        } else {
            notificationservice.Notification("Please Enter Valid Slab First", "", 'Only Single Row Left!!');
            $scope.gridBonusList.data[0] = $scope.gridBonusDefalutData();

        }
        $scope.rowNumberGenerate();

    };
    $scope.LoadBONUS_SLAB_TYPE = function () {
        $('#BONUS_SLAB_TYPE').trigger('change');

    }
    $scope.LoadGIFT_ITEM_ID = function () {
        $('#GIFT_ITEM_ID').trigger('change');

    }
    $scope.LoadBONUS_SKU_ID = function () {
        $('#BONUS_SKU_ID').trigger('change');

    }
    $scope.LoadCALCULATION_TYPE = function () {
        $('#CALCULATION_TYPE').trigger('change');

    }
    $scope.LoadBONUS_TYPE = function () {
        $('#BONUS_TYPE').trigger('change');

    }
    $scope.EditItem = (entity) => {
        debugger
        if ($scope.gridBonusList.data.length > 0) {

            var newRow = {
                ROW_NO: 0, COMPANY_ID: $scope.model.COMPANY_ID, BONUS_DTL_ID: entity.BONUS_DTL_ID, BONUS_MST_ID: entity.BONUS_MST_ID, BONUS_SLAB_TYPE: entity.BONUS_SLAB_TYPE, SLAB_QTY: entity.SLAB_QTY, BONUS_TYPE: entity.BONUS_TYPE, BONUS_QTY: entity.BONUS_QTY, DISCOUNT_PCT: entity.DISCOUNT_PCT, DISCOUNT_VAL: entity.DISCOUNT_VAL, GIFT_ITEM_ID: entity.GIFT_ITEM_ID, GIFT_QTY: entity.GIFT_QTY
            }
            $scope.gridBonusList.data[0] = newRow;


        } else {
            notificationservice.Notification("Please Select Valid data", "", 'Only Single Row Left!!');

        }
        $scope.rowNumberGenerate();
        $scope.removeItem(entity);
    };
    $scope.removeItem = function (entity) {
        debugger
        if ($scope.gridBonusList.data.length > 1) {
            var index = $scope.gridBonusList.data.indexOf(entity);
            if ($scope.gridBonusList.data.length > 0) {
                $scope.gridBonusList.data.splice(index, 1);
            }
            $scope.rowNumberGenerate();


        } else {
            notificationservice.Notification("Only Single Row Left!!", "", 'Only Single Row Left!!');
        }


    }
    $scope.removeItemLocation = function (entity) {
        debugger
        if ($scope.gridLocationList.data.length > 1) {
            var index = $scope.gridLocationList.data.indexOf(entity);
            if ($scope.gridLocationList.data.length > 0) {
                $scope.gridLocationList.data.splice(index, 1);
            }
            $scope.rowNumberGenerateLocation();


        } else {
            notificationservice.Notification("Only Single Row Left!!", "", 'Only Single Row Left!!');
        }


    }
    $scope.removeItemDeclareProduct = function (entity) {
        debugger
        if ($scope.gridProductList.data.length > 1) {
            var index = $scope.gridProductList.data.indexOf(entity);
            if ($scope.gridProductList.data.length > 0) {
                $scope.gridProductList.data.splice(index, 1);
            }
            $scope.rowNumberGenerateProduct();


        } else {
            notificationservice.Notification("Only Single Row Left!!", "", 'Only Single Row Left!!');
        }


    }
  


    $scope.gridBonusList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false, width: '50'
        }

        , { name: 'BONUS_DTL_ID', field: 'BONUS_DTL_ID', visible: false }
        , { name: 'BONUS_MST_ID', field: 'BONUS_MST_ID', visible: false }
        , {
            name: 'BONUS_SLAB_TYPE', field: 'BONUS_SLAB_TYPE', displayName: 'Slab Type', enableFiltering: true, width: '7%', cellTemplate:
                '<select class="select2-single form-control" data-select2-id="{{row.entity.BONUS_SLAB_TYPE}}" id="BONUS_SLAB_TYPE" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_DTL_ID>0"' +
                'name="BONUS_SLAB_TYPE" ng-model="row.entity.BONUS_SLAB_TYPE" style="width:100%" >' +
                '<option ng-repeat="item in grid.appScope.SlabType" ng-selected="item.BONUS_SLAB_TYPE == row.entity.BONUS_SLAB_TYPE" value="{{item.BONUS_SLAB_TYPE}}">{{ item.BONUS_SLAB_TYPE }}</option>' +
                '</select>'
        }
        , {
            name: 'SLAB_QTY', field: 'SLAB_QTY', displayName: 'Slab Qty', enableFiltering: true, width: '7%', cellTemplate:
                '<input type="number"  ng-model="row.entity.SLAB_QTY" ng-disabled="row.entity.ROW_NO !=0"   class="pl-sm" />'
        }
        , {
            name: 'BONUS_TYPE', field: 'BONUS_TYPE', displayName: 'Bonus Type', enableFiltering: true, width: '8%', cellTemplate:
                '<select class="select2-single form-control" id="BONUS_TYPE_TT" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_DTL_ID>0"' +
                'name="BONUS_TYPE" ng-model="row.entity.BONUS_TYPE" style="width:100%" >' +
                '<option ng-repeat="item in grid.appScope.BonusType" ng-selected="item.BONUS_TYPE == row.entity.BONUS_TYPE" value="{{item.BONUS_TYPE}}">{{ item.BONUS_TYPE }}</option>' +
                '</select>'
        }
        , {
            name: 'CALCULATION_TYPE', field: 'CALCULATION_TYPE', displayName: 'Calculation Type', enableFiltering: true, width: '10%', cellTemplate:
                '<select class="select2-single form-control" id="CALCULATION_TYPE" ng-disabled="row.entity.ROW_NO !=0"' +
                'name="CALCULATION_TYPE" ng-model="row.entity.CALCULATION_TYPE" style="width:100%" >' +
                '<option ng-repeat="item in grid.appScope.CalculationType" ng-selected="item.BONUS_TYPE == row.entity.CALCULATION_TYPE" value="{{item.CALCULATION_TYPE}}">{{ item.CALCULATION_TYPE }}</option>' +
                '</select>'
        }

       
        , {
            name: 'DISCOUNT_PCT', field: 'DISCOUNT_PCT', displayName: 'Discount %', enableFiltering: true, width: '8%', cellTemplate:
                '<input type="number"  ng-model="row.entity.DISCOUNT_PCT" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_TYPE != \'Disc_%\'"   class="pl-sm" />'
        }
        , {
            name: 'DISCOUNT_VAL', field: 'DISCOUNT_VAL', displayName: 'Discount Val', enableFiltering: true, width: '8%', cellTemplate:
                '<input type="number"  ng-model="row.entity.DISCOUNT_VAL" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_TYPE != \'Disc_Value\'"   class="pl-sm" />'
        }
        , {
            name: 'BONUS_SKU_ID', field: 'BONUS_SKU_ID', displayName: 'Product', enableFiltering: true,width: '25%', cellTemplate:
        '<select class="select2-single form-control"  id="BONUS_SKU_ID" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_TYPE != \'SKU\'"' +
        'name="BONUS_SKU_ID" ng-model="row.entity.BONUS_SKU_ID" style="width:100%" >' +
        '<option ng-repeat="item in grid.appScope.Products" ng-selected="item.SKU_ID == row.entity.BONUS_SKU_ID" value="{{item.SKU_ID}}">{{ item.SKU_NAME }} | Code: {{ item.SKU_CODE }} | Pack Size: {{ item.PACK_SIZE }} </option>' +
        '</select>'

        }
        , {
            name: 'BONUS_SKU_NAME', field: 'BONUS_SKU_NAME', displayName: 'Gift Product ', enableFiltering: true, width: '12%', visible: false,  cellTemplate:
                '<input type="text"  ng-model="row.entity.BONUS_SKU_NAME" ng-disabled="row.entity.ROW_NO !=0"   class="pl-sm" />'
        }
        , {
            name: 'BONUS_SKU_CODE', field: 'SKU_CODE', displayName: 'Code', enableFiltering: true, width: '12%', visible: false,  cellTemplate:
                '<input type="text"  ng-model="row.entity.BONUS_SKU_CODE" disabled="true"   class="pl-sm" />'
        }
        , {
            name: 'BONUS_QTY', field: 'BONUS_QTY', displayName: 'Bonus Qty', enableFiltering: true, width: '7%', cellTemplate:
                '<input type="number"  ng-model="row.entity.BONUS_QTY" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_TYPE != \'SKU\'"   class="pl-sm" />'
        }
        , {
            name: 'GIFT_ITEM_ID', field: 'GIFT_ITEM_ID', displayName: 'Gift Name ', width:'12%', enableFiltering: true, cellTemplate:
                '<select class="select2-single form-control" data-select2-id="{{row.entity.GIFT_ITEM_ID}}" id="BONUS_SKU_ID" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_TYPE != \'Gift\'"' +
                'name="GIFT_ITEM_ID" ng-model="row.entity.GIFT_ITEM_ID" style="width:100%" >' +
                '<option ng-repeat="item in grid.appScope.GiftItems" ng-selected="item.GIFT_ITEM_ID == row.entity.GIFT_ITEM_ID" value="{{item.GIFT_ITEM_ID}}">{{ item.GIFT_ITEM_NAME }}  </option>' +
                '</select>'        }
       
        , {
            name: 'PACK_SIZE', field: 'PACK_SIZE', displayName: 'Pack Size', enableFiltering: true, width: '12%', visible:false, cellTemplate:
                '<input type="text"  ng-model="row.entity.PACK_SIZE" disabled="true"   class="pl-sm" />'
        }
        

        , {
            name: 'GIFT_QTY', field: 'GIFT_QTY', displayName: 'Gift Qty', enableFiltering: true, width: '9%', cellTemplate:
                '<input type="number"  ng-model="row.entity.GIFT_QTY" ng-disabled="row.entity.ROW_NO !=0 || row.entity.BONUS_TYPE != \'Gift\'"   class="pl-sm" />'
        }
        
        , {
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;"  ng-disabled="row.entity.BONUS_DTL_ID>0" ng-show="row.entity.ROW_NO != 0" ng-click="grid.appScope.EditItem(row.entity)" type="button" class="btn btn-outline-success mb-1"><img src="/img/edit-icon.png" height="15px" ></button>' +

                '<button style="margin-bottom: 5px;" ng-disabled="row.entity.BONUS_DTL_ID>0"   ng-show="row.entity.ROW_NO == 0" ng-click="grid.appScope.addNewRow()" type="button" class="btn btn-outline-primary mb-1"><img src="/img/plus-icon.png" height="15px" style="border:none" ></button>' +
                '<button style="margin-bottom: 5px;" ng-disabled="row.entity.BONUS_DTL_ID>0"   ng-show="row.entity.ROW_NO != 0" ng-click="grid.appScope.removeItem(row.entity)" type="button" class="btn btn-outline-danger mb-1"><img src="/img/minus-icon.png" height="15px" ></button>' +

                '</div>'
        },

    ];


    $scope.CheckDateValidation = function (entity) {
        debugger
        var today = new Date();
        var day = entity.EFFECT_START_DATE.substring(0, 2)
        var month = entity.EFFECT_START_DATE.substring(3, 5)
        var year = entity.EFFECT_START_DATE.substring(6, 10)
        var StartDate = new Date(year, month, day);
        if (entity.EFFECT_START_DATE.substring(2, 3) != "/" || entity.EFFECT_START_DATE.substring(5, 6) != "/") {
            alert("Please Right Format of Start Date. Ex: dd/mm/yyyy (day/month/year)");
            entity.EFFECT_START_DATE = '';
            return "false";
        }
        var todate = today.getDate();
        var tomonth = today.getMonth();
        if (StartDate < today) {
            alert("Start Date Can not be any Previous Days");
            entity.EFFECT_START_DATE = '';

            return "false";
        }
        else if (parseInt(month) == parseInt(tomonth) && parseInt(day) < parseInt(todate)) {
            alert("Start Date Can not be any Previous Days");
            entity.EFFECT_START_DATE = '';
        }
        if (entity.EFFECT_END_DATE != null && entity.EFFECT_END_DATE != '') {
            var day1 = entity.EFFECT_END_DATE.substring(0, 2)
            var month1 = entity.EFFECT_END_DATE.substring(3, 5)
            var year1 = entity.EFFECT_END_DATE.substring(6, 10)
            var EndDate = new Date(year1, month1, day1);
            if (entity.EFFECT_END_DATE.substring(2, 3) != "/" || entity.EFFECT_END_DATE.substring(5, 6) != "/") {
                alert("Please Right Format of End Date. Ex: dd/mm/yyyy (day/month/year)");
                entity.EFFECT_END_DATE = '';

                return "false";
            }
            if (EndDate < today) {
                alert("End Date Can not be any Previous Days");
                entity.EFFECT_END_DATE = '';
                return "false";
            }
            if (EndDate < StartDate) {
                alert("End Date Can not be less than Start Day");
                entity.EFFECT_END_DATE = '';
                return "false";
            }
        }

        return "true"
    }
    $scope.CheckENDDateValidation = function (entity) {
        debugger
        var Startdate = new Date();


        var StartDate = new Date(entity.EFFECT_END_DATE);
        if (entity.EFFECT_START_DATE == null || entity.EFFECT_START_DATE == '') {
            alert("End date can not be entered before entering Start Date");
            entity.EFFECT_END_DATE = '';
            return "false";
        }
    }
   
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        BonusConfigServices.GetCompany().then(function (data) {
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

        BonusConfigServices.GetCompanyList().then(function (data) {
            console.log(data.data)
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }

    $scope.LoadBaseProductData = function () {
        $scope.showLoader = true;

        BonusConfigServices.LoadBaseProductData().then(function (data) {
            $scope.BaseProducts = data.data;
            var _BaseProducts = {
                BASE_PRODUCT_ID: "0",
                BASE_PRODUCT_NAME: "All",
                BASE_PRODUCT_CODE: "ALL",

            }
            $scope.BaseProducts.push(_BaseProducts);
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadBrandData = function () {
        $scope.showLoader = true;

        BonusConfigServices.LoadBrandData().then(function (data) {
            $scope.Brands = data.data;
            var _Brands = {
                BRAND_ID: "0",
                BRAND_NAME: "All",
                BRAND_CODE: "ALL",

            }
            $scope.Brands.push(_Brands);
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadCategoryData = function () {
        $scope.showLoader = true;

        BonusConfigServices.LoadCategoryData().then(function (data) {
            $scope.Categories = data.data;
            var _Categories = {
                CATEGORY_ID: "0",
                CATEGORY_NAME: "All",
                CATEGORY_CODE: "ALL",

            }
            $scope.Categories.push(_Categories);
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadGroupData = function () {
        $scope.showLoader = true;

        BonusConfigServices.LoadGroupData().then(function (data) {
            $scope.Groups = data.data;
            var _Groups = {
                GROUP_ID: "0",
                GROUP_NAME: "All",
                GROUP_CODE: "ALL",

            }
            $scope.Groups.push(_Groups);
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadProductData = function () {
        $scope.showLoader = true;

        BonusConfigServices.LoadProductData().then(function (data) {
            debugger
            $scope.Products = data.data;
            var _Products = {
                SKU_ID: "0",
                SKU_NAME: "All",
                SKU_CODE: "ALL",
                PACK_SIZE: "ALL",

            }
            $scope.Products.push(_Products);
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadLocationTypes = function () {
        $scope.showLoader = true;

        BonusConfigServices.LoadLocationTypes().then(function (data) {
            $scope.LocationTypes = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.ReleaseProductsDataFiltered = function () {
        $scope.gridProductList.data = [];
    }
    $scope.LoadProductsDataFiltered = function () {
        $scope.showLoader = true;
        window.setTimeout(function () {
            debugger

            BonusConfigServices.LoadProductsDataFiltered($scope.model.COMPANY_ID, $scope.model).then(function (data) {
                debugger
                $scope.gridProductList.data = data.data;
               
                $scope.showLoader = false;
            }, function (error) {
                alert(error);
                console.log(error);
                $scope.showLoader = false;

            });
        }, 200)

    }
    $scope.LoadLocationByLocationType = function () {
        $scope.showLoader = true;
        window.setTimeout(function () {
            BonusConfigServices.LoadLocationByLocationTypes($scope.model.COMPANY_ID, $scope.model.LOCATION_TYPE).then(function (data) {
                debugger
                $scope.Locations = data.data;
                var _Locations = {
                    LOCATION_ID: "0",
                    LOCATION_NAME: "All",
                    LOCATION_CODE: "ALL"

                }
                $scope.Locations.push(_Locations);
                $scope.showLoader = false;
            }, function (error) {
                alert(error);
                console.log(error);
                $scope.showLoader = false;

            });
        }, 200)
        
    }
  
    $scope.LoadLocationsData = function () {
        debugger
        $scope.gridLocationList.data = [];
        if ($scope.model.LOCATION_ID[0] == 0) {
            for (var i in $scope.Locations) {
                if (parseInt($scope.Locations[i].LOCATION_ID) != 0) {
                    var locationData = $scope.Locations.find(x => x.LOCATION_ID === parseInt($scope.Locations[i].LOCATION_ID));
                    locationData.STATUS = 'Active';
                    debugger
                    locationData.ROW_NO = parseInt(i) +1;
                    $scope.gridLocationList.data.push(locationData);
                }

            }
        } else {
            for (var i in $scope.Locations) {
                if (parseInt($scope.Locations[i].LOCATION_ID) != 0) {
                    var locationData = $scope.Locations.find(x => x.LOCATION_ID === parseInt($scope.model.LOCATION_ID[i]));
                    locationData.STATUS = 'Active';
                    locationData.ROW_NO = parseInt(i) + 1;

                    $scope.gridLocationList.data.push(locationData);
                }
               
            }

        }
              
    }

    $scope.UnLoadLocationsData = function () {
        $scope.gridLocationList.data = [];

    }

    $scope.LoadNewBonusNo = function () {
        $scope.showLoader = true;

        BonusConfigServices.LoadNewBonusNo().then(function (data) {
            $scope.model.BONUS_MST_ID_SHOW = data.data;
            $scope.model.BONUS_MST_ID = 0;

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
        window.location.href = "/SalesAndDistribution/Bonus/BonusConfig";

    }

   
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'Area',
            Action_Name: 'AreaInfo'
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
    $scope.formatRepo = function (repo) {
        debugger
        if (repo.loading) {
            return repo.text;
        }
        if (repo.text != "") {
            const textArray = repo.text.split("--");
            let text_title = textArray[0];
            let text_title_2 = textArray[1];
            var $container = $(
                "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title' style='font-size:14px;font-weight:700'></div>" +
                "<div class='select2-result-repository__watchers' style='font-size:12px;font-weight:700'> <span>Code: </span>  </div>" +
                "</div>" +
                "</div>"
            );

            $container.find(".select2-result-repository__title").text(text_title);
            $container.find(".select2-result-repository__watchers").append(text_title_2);


        }

        return $container;
    }

    $scope.formatRepoSelection = function (repo) {
        return repo.text.split("--")[0];
    }

    $(".select2-single-Location").select2({
        placeholder: "Select",
        templateResult: $scope.formatRepo,
        templateSelection: $scope.formatRepoSelection
    });

    $scope.formatRepoProduct = function (repo) {
        debugger
        if (repo.loading) {
            return repo.text;
        }
        if (repo.text != "") {
            const textArray = repo.text.split("--");
            let text_title = textArray[0];
            let text_title_2 = textArray[1];
            let text_title_3 = textArray[2];

            var $container = $(
                "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title' style='font-size:14px;font-weight:700'></div>" +
                "<div class='select2-result-repository__watchers' style='font-size:12px;font-weight:700'> <span>Code: </span>  </div>" +
                "<div class='select2-result-repository__watchers_2' style='font-size:12px;font-weight:700'> <span>Pack Size: </span>  </div>" +
                "</div>" +
                "</div>"
            );

            $container.find(".select2-result-repository__title").text(text_title);
            $container.find(".select2-result-repository__watchers").append(text_title_2);
            $container.find(".select2-result-repository__watchers_2").append(text_title_3);


        }

        return $container;
    }

    $scope.formatRepoSelectionProduct = function (repo) {
        return repo.text.split("--")[0];
    }

   
    $(".select2-single-Product").select2({
        placeholder: "Select",
        templateResult: $scope.formatRepoProduct,
        templateSelection: $scope.formatRepoSelectionProduct
    });
    $scope.BonusTypeLoad();
    $scope.CalculationTypeLoad();
    $scope.SlabTypeLoad();
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.LoadStatus();
    $scope.LoadBaseProductData();
    $scope.LoadProductData();
    $scope.LoadBrandData();
    $scope.LoadCategoryData();
    $scope.LoadGroupData();
    $scope.LoadLocationTypes();
    $scope.LoadNewBonusNo();
    $scope.GetEditDataById = function (value) {
        
        if (value != undefined && value.length > 0) {
            BonusConfigServices.GetEditDataById(value).then(function (data) {
                debugger
                if (data.data != null && data.data.Bonus_Dtls != null && data.data.Bonus_Dtls.length > 0) {
                    $scope.model.COMPANY_ID = data.data.COMPANY_ID;
                    $scope.model.BONUS_MST_ID = data.data.BONUS_MST_ID;
                    $scope.model.BONUS_MST_ID_SHOW = data.data.BONUS_MST_ID;

                    $scope.model.BONUS_NAME = data.data.BONUS_NAME;

                    $scope.model.LOCATION_TYPE = data.data.LOCATION_TYPE;
                    $scope.model.STATUS = data.data.STATUS;
                    $scope.model.EFFECT_START_DATE = data.data.EFFECT_START_DATE;
                    $scope.model.EFFECT_END_DATE = data.data.EFFECT_END_DATE;
                    $scope.model.REMARKS = data.data.REMARKS;
                    $scope.LoadLocationByLocationType();
                    if ($scope.model.STATUS == null) {
                        $scope.model.STATUS = 'Active';
                    }
                    if (data.data.Bonus_Locations != null) {
                        $scope.gridLocationList.data = [];
                        for (var i in data.data.Bonus_Locations) {
                            $scope.gridLocationList.data.push(data.data.Bonus_Locations[i]);
                        }
                    }
                    if (data.data.BonusDeclareProduct != null) {

                        $scope.gridProductList.data = [];
                        for (var i in data.data.BonusDeclareProduct) {
                            $scope.gridProductList.data.push(data.data.BonusDeclareProduct[i]);
                        }
                    }
                    if (data.data.Bonus_Dtls != null) {
                        $scope.gridBonusList.data = [];

                        for (var i in data.data.Bonus_Dtls) {
                            $scope.gridBonusList.data.push(data.data.Bonus_Dtls[i]);
                        }

                    }


                    $scope.addNewRow();


                }

                $scope.rowNumberGenerate();
                $scope.rowNumberGenerateLocation();
                $scope.rowNumberGenerateProduct();


                $scope.showLoader = false;
            }, function (error) {
                alert(error);
                console.log(error);
            });
        }
    }
    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;
        debugger
        $scope.showLoader = true;
        $scope.model.COMPANY_ID = parseInt($scope.model.COMPANY_ID);

        $scope.gridBonusList.data = $scope.gridBonusList.data.filter((x) => x.ROW_NO !== 0);
        for (var i in $scope.gridBonusList.data) {
            const searchIndex = $scope.Products.findIndex((x) => x.SKU_CODE == $scope.gridBonusList.data[i].BONUS_SKU_ID);
            if (searchIndex != -1) {
                $scope.gridBonusList.data[i].BONUS_SKU_ID = $scope.Products[searchIndex].SKU_ID;
                $scope.gridBonusList.data[i].BONUS_SKU_CODE = $scope.Markets[searchIndex].SKU_CODE;
                $scope.gridBonusList.data[i].SKU_NAME = $scope.Markets[searchIndex].SKU_NAME;

            }
        }

        $scope.model.Bonus_Locations = $scope.gridLocationList.data;
        $scope.model.BonusDeclareProduct = $scope.gridProductList.data;
        $scope.model.Bonus_Dtls = $scope.gridBonusList.data;
        for (var i in $scope.model.Bonus_Dtls) {
            if ($scope.model.Bonus_Dtls[i].BONUS_MST_ID == undefined || $scope.model.Bonus_Dtls[i].BONUS_MST_ID == null) {
                $scope.model.Bonus_Dtls[i].BONUS_MST_ID = 0;

            }
            if ($scope.model.Bonus_Dtls[i].BONUS_DTL_ID == undefined || $scope.model.Bonus_Dtls[i].BONUS_DTL_ID == null) {
                $scope.model.Bonus_Dtls[i].BONUS_DTL_ID = 0;

            }
            $scope.model.Bonus_Dtls[i].BONUS_SKU_ID = parseInt($scope.model.Bonus_Dtls[i].BONUS_SKU_ID);
      
        }
        for (var i in $scope.model.BonusDeclareProduct) {
            if ($scope.model.BonusDeclareProduct[i].BONUS_MST_ID == undefined || $scope.model.BonusDeclareProduct[i].BONUS_MST_ID == null) {
                $scope.model.BonusDeclareProduct[i].BONUS_MST_ID = 0;

            }
            if ($scope.model.BonusDeclareProduct[i].BONUS_DTL_ID == undefined || $scope.model.BonusDeclareProduct[i].BONUS_DTL_ID == null) {
                $scope.model.BonusDeclareProduct[i].BONUS_DTL_ID = 0;

            }

        }
        for (var i in $scope.model.Bonus_Locations) {
            if ($scope.model.Bonus_Locations[i].BONUS_MST_ID == undefined || $scope.model.Bonus_Locations[i].BONUS_MST_ID == null) {
                $scope.model.Bonus_Locations[i].BONUS_MST_ID = 0;

            }
            if ($scope.model.Bonus_Locations[i].BONUS_DTL_ID == undefined || $scope.model.Bonus_Locations[i].BONUS_DTL_ID == null) {
                $scope.model.Bonus_Locations[i].BONUS_DTL_ID = 0;

            }
            if ($scope.model.Bonus_Locations[i].BONUS_LOCATION_ID == undefined || $scope.model.Bonus_Locations[i].BONUS_LOCATION_ID == null) {
                $scope.model.Bonus_Locations[i].BONUS_LOCATION_ID = 0;

            }

            
        }
        BonusConfigServices.AddOrUpdate(model).then(function (data) {
            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.addNewRow();

            }
            else {
                $scope.showLoader = false;
                $scope.addNewRow();

            }
        });
    }

}]);

