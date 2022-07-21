ngApp.controller('ngGridCtrl', ['$scope', 'CustomerPriceInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, CustomerPriceInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = {
        CUSTOMER_PRICE_MSTID: 0,
        COMPANY_ID: 0,
        CUSTOMER_ID: "",
        CUSTOMER_CODE: null,
        EFFECT_START_DATE: ""
        , EFFECT_END_DATE: ""
        , CUSTOMER_STATUS: ""
        , REMARKS: ""
        , ENTRY_DATE: ""
        , GROUP_ID: ""
        , BRAND_ID: ""
        , CATEGORY_ID: ""
        , BASE_PRODUCT_ID: ""
        , PRODUCT_ID: ""
        , SKU_PRICE: 0
        , COMMISSION_FLAG: ""
        , PRICE_FLAG: ""
        , COMMISSION_VALUE: 0
        , COMMISSION_TYPE: ""
        , ADD_COMMISSION1: 0
        , ADD_COMMISSION2: 0
        , customerSkuPriceList: []
    }
   

    $scope.getPermissions = [];
    $scope.ProductList = [];
    $scope.Companies = [];
    $scope.Unit = [];
    $scope.CustomerData = [];
    $scope.CustomerType = [];
    $scope.ProductList = [];

    $scope.BaseProducts = [];
    $scope.Categories = [];
    $scope.Brands = [];
    $scope.Groups = [];
    $scope.Products = [];
    $scope.existingSKU = [];

    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Product Price Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }

    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false, width: '50'
        }
        , {
            name: 'SKU_CODE', field: 'SKU_CODE', displayName: 'SKU Code', enableFiltering: true, width: '10%'
        }
        , {
            name: 'SKU_NAME', field: 'SKU_NAME', displayName: 'SKU Name', enableFiltering: true, width: '10%'
        }
        , {
            name: 'PACK_SIZE', field: 'PACK_SIZE', displayName: 'Pack Size', enableFiltering: true, width: '10%'
        }
        , {
            name: 'PRICE_FLAG', field: 'PRICE_FLAG', displayName: 'Price Flag', enableFiltering: true, width: '10%', cellTemplate:
                ` <select class="form-control"  ng-model="row.entity.PRICE_FLAG" >
                                        <option  value="Yes">Yes</option>
                                        <option  value="No">No</option>
                                    </select>`
        }
        , {
            name: 'SKU_PRICE', field: 'SKU_PRICE', displayName: 'SKU Price', enableFiltering: true, width: '10%', cellTemplate:
                ` <input type="number" class="form-control" ng-model="row.entity.SKU_PRICE" >`
        }
        , {
            name: 'COMMISSION_FLAG', field: 'COMMISSION_FLAG', displayName: 'Commission Flag', enableFiltering: true, width: '10%', cellTemplate:
                ` <select class="form-control" ng-model="row.entity.COMMISSION_FLAG" >
                                        <option  value="Yes">Yes</option>
                                        <option  value="No">No</option>
                                    </select>`
        }
        , {
            name: 'COMMISSION_TYPE', field: 'COMMISSION_TYPE', displayName: 'Commission Type', enableFiltering: true, width: '10%', cellTemplate:
                ` <input type="text" class="form-control" ng-model="row.entity.COMMISSION_TYPE" >`
        }
        , {
            name: 'COMMISSION_VALUE', field: 'COMMISSION_VALUE', displayName: 'Commission Value', enableFiltering: true, width: '10%', cellTemplate:
                ` <input type="number" class="form-control" ng-model="row.entity.COMMISSION_VALUE" >`
        }
        , {
            name: 'ADDITIONAL_COMMISSION', field: 'ADDITIONAL_COMMISSION', displayName: 'Additional Comm.', enableFiltering: true, width: '10%', cellTemplate:
                ` <input type="number" class="form-control" ng-model="row.entity.ADD_COMMISSION1" >`
        }
        , {
            name: 'ADD_COMMISSION', field: 'ADD_COMMISSION', displayName: 'Add Comm. 2', enableFiltering: true, width: '10%', cellTemplate:
                ` <input type="number" class="form-control" ng-model="row.entity.ADD_COMMISSION2" >`
        }
        , {
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Delete</button>' +
                '</div>'
        },

    ];


    $scope.LoadCustomerTypeData = function () {
        $scope.showLoader = true;

        CustomerPriceInfoServices.LoadCustomerTypeData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.CustomerType = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }

    $scope.GetExistingSku = function () {
        $scope.showLoader = true;
        debugger;
        $scope.existingSKU = [];
        CustomerPriceInfoServices.LoadExistingSkuData($scope.model.COMPANY_ID,$scope.model.CUSTOMER_ID).then(function (data) {
            debugger;
            $scope.existingSKU = data.data;
            console.log($scope.existingSKU)
            $scope.showLoader = false;

        }, function (error) {
            alert(error);
            $scope.showLoader = false;

        });
    }


    $scope.ClearForm = function () {
        window.location.href = "/SalesAndDistribution/PriceInfo/CustomerPriceInfo";
    }
    $scope.DataLoad = function (companyId) {
        $scope.showLoader = true;
        $scope.SkuList = "";
        $scope.GetExistingSku();
        console.log($scope.existingSKU);
        setTimeout(function () {
            CustomerPriceInfoServices.LoadFilteredProduct($scope.model).then(function (data) {
                debugger;
                var dataList = [];
                var flag = 0
                for (var i = 0; i < data.data.length; i++) {
                    for (var j = 0; j < $scope.existingSKU.length; j++) {
                        if (data.data[i].SKU_ID == $scope.existingSKU[j].SKU_ID) {
                            flag = 1;
                        }
                    }
                    if (flag == 0) {
                        dataList.push(data.data[i]);

                    }
                    else {
                        flag = 0;
                    }
                }
                $scope.gridOptionsList.data = dataList;
                //if ($scope.existingSKU.length > 0) {
                //    debugger;
                //    for (var j = 0; j < $scope.existingSKU.length; j++) {
                //        $scope.SkuList += $scope.existingSKU[j].SKU_ID + ",";
                //    }
                //    notificationservice.Notification(1, 1, $scope.SkuList + " already exist!");
                //}
                $scope.showLoader = false;

            }, function (error) {
                alert(error);
                $scope.showLoader = false;

            });
        },2000)
    
    }
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        CustomerPriceInfoServices.GetCompany().then(function (data) {
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

        CustomerPriceInfoServices.GetCompanyList().then(function (data) {
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

        CustomerPriceInfoServices.LoadBaseProductData().then(function (data) {
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

        CustomerPriceInfoServices.LoadBrandData().then(function (data) {
            $scope.Brands = data.data;
            $scope.showLoader = false;
            var _Brands = {
                BRAND_ID: "0",
                BRAND_NAME: "All",
                BRAND_CODE: "ALL",

            }
            $scope.Brands.push(_Brands);
        }, function (error) {
            alert(error);
            console.log(error);
          
            $scope.showLoader = false;

        });
    }
    $scope.LoadCategoryData = function () {
        $scope.showLoader = true;

        CustomerPriceInfoServices.LoadCategoryData().then(function (data) {
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

        CustomerPriceInfoServices.LoadGroupData().then(function (data) {
            $scope.Groups = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            var _Groups = {
                GROUP_ID: "0",
                GROUP_NAME: "All",
                GROUP_CODE: "ALL",

            }
            $scope.Groups.push(_Groups);
            $scope.showLoader = false;

        });
    }
    $scope.LoadProductData = function () {
        $scope.showLoader = true;

        CustomerPriceInfoServices.LoadProductData().then(function (data) {
            debugger
            $scope.Products = data.data;
            $scope.showLoader = false;
            var _Products = {
                PRODUCT_ID: "0",
                PRODUCT_NAME: "All",
                PRODUCT_CODE: "ALL",

            }
            $scope.Products.push(_Products);
        }, function (error) {
            alert(error);
            console.log(error);
           
            $scope.showLoader = false;

        });
    }
    $scope.LoadLocationTypes = function () {
        $scope.showLoader = true;

        CustomerPriceInfoServices.LoadLocationTypes().then(function (data) {
            $scope.LocationTypes = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            var _Locations = {
                LOCATION_ID: "0",
                LOCATION_NAME: "All",
                LOCATION_CODE: "ALL",

            }
            $scope.Locations.push(_Locations);

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

        CustomerPriceInfoServices.LoadUnitData($scope.model.COMPANY_ID).then(function (data) {
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

        CustomerPriceInfoServices.LoadCustomerData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.CustomerData = data.data.filter(function (element) { return element.COMPANY_ID == $scope.model.COMPANY_ID });;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.AutoCompleteDataLoadForPrpoduct = function (value) {
        if (value.length >= 3) {
            debugger

            return CustomerPriceInfoServices.GetSearchableProduct($scope.model.COMPANY_ID, value).then(function (data) {
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


    $scope.GetEditDataById = function (value) {
        debugger
        if (value != undefined && value.length > 0) {
            CustomerPriceInfoServices.GetEditDataById(value).then(function (data) {
                debugger

                if (data.data != null && data.data.customerSkuPriceList != null && data.data.customerSkuPriceList.length > 0) {
                    $scope.model.CUSTOMER_ID = data.data.CUSTOMER_ID;
                    $scope.model.CUSTOMER_PRICE_MSTID = data.data.CUSTOMER_PRICE_MSTID;
                    $scope.model.CUSTOMER_CODE = data.data.CUSTOMER_CODE;
                    $scope.model.EFFECT_START_DATE = data.data.EFFECT_START_DATE;
                    $scope.model.EFFECT_END_DATE = data.data.EFFECT_END_DATE;
                    $scope.model.CustomerType = data.data.CustomerType;
                    $scope.model.REMARKS = data.data.REMARKS;

                    if (data.data.customerSkuPriceList != null) {
                        $scope.gridOptionsList.data  = data.data.customerSkuPriceList;

                    }


                }
                //$scope.rowNumberGenerate();
                $scope.showLoader = false;
            }, function (error) {
                alert(error);
                console.log(error);
            });
        }
    }
/*    $scope.DataLoad(0);*/
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.LoadUnitData();
    $scope.LoadCustomerData();
    $scope.LoadCustomerTypeData();

    $scope.LoadProductData();
    $scope.LoadBrandData();
    $scope.LoadCategoryData();
    $scope.LoadGroupData();
    $scope.LoadBaseProductData();
    $scope.SaveData = function (model) {
        debugger
        var flag = false;

        $scope.showLoader = true;
        for (var i = 0; i < $scope.gridOptionsList.data.length; i++) {
            if ($scope.gridOptionsList.data[i].PRICE_FLAG != "" && $scope.gridOptionsList.data[i].PRICE_FLAG != null) {
                flag = true;
            }
            if ($scope.gridOptionsList.data[i].COMMISSION_FLAG != "" && $scope.gridOptionsList.data[i].COMMISSION_FLAG != null) {
                flag = true;
            }
            if ($scope.gridOptionsList.data[i].COMMISSION_TYPE != "" && $scope.gridOptionsList.data[i].COMMISSION_TYPE != null) {
                flag = true;
            }
            if ($scope.gridOptionsList.data[i].SKU_PRICE> 0) {
                flag = true;
            }
            if ($scope.gridOptionsList.data[i].COMMISSION_VALUE > 0) {
                flag = true;
            }
            if ($scope.gridOptionsList.data[i].ADD_COMMISSION1 > 0) {
                flag = true;
            }
            if ($scope.gridOptionsList.data[i].ADD_COMMISSION2 > 0) {
                flag = true;
            }
            if (flag == true) {
         
                $scope.ProductList.push($scope.gridOptionsList.data[i]);
                flag = false
            }
        }
        model.customerSkuPriceList = $scope.ProductList;
        console.log(model);
    
        CustomerPriceInfoServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;

                window.setTimeout(function () {
                    window.location.href = "/SalesAndDistribution/PriceInfo/CustomerPriceInfo";
                }, 2000)
            }
            else {
           
                $scope.showLoader = false;
            }
            model.customerSkuPriceList = [];
            $scope.ProductList = [];
        });
    }

}]);

