ngApp.controller('ngGridCtrl', ['$scope', 'ProductInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, ProductInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = {
          COMPANY_ID: 0
        , FONT_COLOR: ''
        , PACK_UNIT: ''
        , PACK_VALUE: 0
        , QTY_PER_PACK: 0
        , REMARKS: ''
        , SHIPPER_QTY: 0
        , SHIPPER_VOLUME: 0
        , SHIPPER_WEIGHT: 0
        , SKU_CODE: ''
        , PRODUCT_STATUS: 'Active'
        , SKU_ID: 0
        , SKU_NAME:''
        , SKU_NAME_BANGLA: ''
    }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Categories = [];
    $scope.Brand = [];
    $scope.Unit = [];
    $scope.PrimaryProduct = [];
    $scope.ProductSeason = [];
    $scope.ProductType = [];
    $scope.BaseProduct = [];
    $scope.Group = [];
    $scope.PackSize = [];
    $scope.ProducStorage = [];
    $scope.Status = [];
    $scope.CompanyUnit = [];
    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Product Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false,  width: '50'
        }

        , { name: 'SKU_ID', field: 'SKU_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }
     
        , {
            name: 'SKU_NAME', field: 'SKU_NAME', displayName: 'Name', enableFiltering: true, width: '22%'
        }
        , {
            name: 'SKU_CODE', field: 'SKU_CODE', displayName: 'Code', enableFiltering: true, width: '15%'
        }
       
        , {
            name: 'REMARKS', field: 'REMARKS', displayName: 'Remark', enableFiltering: true, width: '25%'
        }
        , { name: 'PRODUCT_STATUS', field: 'PRODUCT_STATUS', displayName: 'Status', enableFiltering: true, width: '18%' }
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

        ProductInfoServices.LoadData(companyId).then(function (data) {
            debugger
            console.log(data.data)
            $scope.gridOptionsList.data = data.data;
            $scope.showLoader = false;
            $scope.model.COMPANY_SEARCH_ID = companyId;
            $interval(function () {
                $scope.LoadCOMPANY_ID();
            }, 800, 2);
        }, function (error) {
            debugger
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        ProductInfoServices.GetCompany().then(function (data) {
            console.log(data.data)
            $scope.model.COMPANY_ID = parseFloat(data.data);
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadCompanyUnitData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadCompanyUnitData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.CompanyUnit = data.data.filter(function (element) { return element.COMPANY_ID == $scope.model.COMPANY_ID });;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompaniesLoad = function () {
        $scope.showLoader = true;

        ProductInfoServices.GetCompanyList().then(function (data) {
            console.log(data.data)
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadGroupData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadGroupData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.Group = data.data;

            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadPackSizeData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadPackSizeData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.PackSize = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadPrimaryProductData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadPrimaryProductData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.PrimaryProduct = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadBaseProductData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadBaseProductData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.BaseProduct = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadBrandData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadBrandData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.Brand = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadCategoryData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadCategoryData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.Categories = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadProductSeasonData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadProductSeasonData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.ProductSeason = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadProductTypeData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadProductTypeData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.ProductType = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadStorageData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadStorageData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.ProducStorage = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadUnitData = function () {
        $scope.showLoader = true;

        ProductInfoServices.LoadUnitData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Unit = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.LoadStatusFilteredDataAll = function () {
        debugger
        if ($scope.AllCustomer == true) {
            $scope.DataLoad($scope.model.COMPANY_ID);
            $scope.ActiveCustomer = false;
            $scope.InActiveCustomer = false;

        }

    }
    $scope.LoadStatusFilteredDataActive = function () {


        if ($scope.ActiveCustomer == true) {
            $scope.showLoader = true;

            ProductInfoServices.LoadData($scope.model.COMPANY_ID).then(function (data) {
                debugger
                $scope.gridOptionsList.data = data.data.filter(function (element) { return element.PRODUCT_STATUS == 'Active' });;
                $scope.AllCustomer = false;
                $scope.InActiveCustomer = false;
                $scope.showLoader = false;

            }, function (error) {
                debugger
                alert(error);
                console.log(error);
                $scope.showLoader = false;

            });

        }

    }
    $scope.LoadStatusFilteredDataInActive = function () {

        if ($scope.InActiveCustomer == true) {
            $scope.showLoader = true;

            ProductInfoServices.LoadData($scope.model.COMPANY_ID).then(function (data) {
                debugger
                $scope.gridOptionsList.data = data.data.filter(function (element) { return element.PRODUCT_STATUS == 'InActive' });;
                $scope.AllCustomer = false;
                $scope.ActiveCustomer = false;
                $scope.showLoader = false;

            }, function (error) {
                debugger
                alert(error);
                console.log(error);
                $scope.showLoader = false;

            });

        }



    }
    //$scope.LoadGeneratedProductCode = function () {
    //    $scope.showLoader = true;
    //    debugger
    //    ProductInfoServices.GenerateProductCode($scope.model.COMPANY_ID).then(function (data) {
    //        debugger
    //        console.log(data.data)
    //        $scope.model.SKU_CODE = data.data;
    //        $scope.showLoader = false;
    //    }, function (error) {
    //        alert(error);
    //        console.log(error);
    //        $scope.showLoader = false;

    //    });
    //}
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
        window.location.href = "/SalesAndDistribution/Product/ProductInfo";

    }

    $scope.EditData = function (entity) {
        debugger
        $scope.model.SKU_ID = entity.SKU_ID;
        $scope.model.SKU_NAME = entity.SKU_NAME;
        $scope.model.SKU_CODE = entity.SKU_CODE;
        $scope.model.SKU_NAME_BANGLA = entity.SKU_NAME_BANGLA;
        $scope.model.COMPANY_ID = entity.COMPANY_ID;
        $scope.model.PRODUCT_STATUS = entity.PRODUCT_STATUS;
        $scope.model.FONT_COLOR = entity.FONT_COLOR;
        $scope.model.PACK_UNIT = entity.PACK_UNIT;
        $scope.model.QTY_PER_PACK = entity.QTY_PER_PACK;
        $scope.model.REMARKS = entity.REMARKS;
        $scope.model.SHIPPER_QTY = entity.SHIPPER_QTY;
        $scope.model.SHIPPER_VOLUME = entity.SHIPPER_VOLUME;
        $scope.model.SHIPPER_WEIGHT = entity.SHIPPER_WEIGHT;
        $scope.model.UNIT_ID = entity.UNIT_ID;
        $scope.model.PACK_SIZE = entity.PACK_SIZE;
        $scope.model.WEIGHT_PER_PACK = entity.WEIGHT_PER_PACK;
        $scope.model.WEIGHT_UNIT = entity.WEIGHT_UNIT;

        $scope.model.BASE_PRODUCT_ID = entity.BASE_PRODUCT_ID;
        $scope.model.BRAND_ID = entity.BRAND_ID;
        $scope.model.CATEGORY_ID = entity.CATEGORY_ID;
        $scope.model.GROUP_ID = entity.GROUP_ID;
        $scope.model.PRIMARY_PRODUCT_ID = entity.PRIMARY_PRODUCT_ID;
        $scope.model.PRODUCT_SEASON_ID = entity.PRODUCT_SEASON_ID;
        $scope.model.PRODUCT_TYPE_ID = entity.PRODUCT_TYPE_ID;
        $scope.model.STORAGE_ID = entity.STORAGE_ID;
        $scope.model.SHIPPER_VOLUME_UNIT = entity.SHIPPER_VOLUME_UNIT;
        $scope.model.SHIPPER_WEIGHT_UNIT = entity.SHIPPER_WEIGHT_UNIT;
        $scope.model.PACK_VALUE = entity.PACK_VALUE;

        $interval(function () {
            $scope.LoadPRODUCT_SEASON_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadPRIMARY_PRODUCT_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadPRODUCT_TYPE_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadBASE_PRODUCT_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadSTORAGE_ID();
        }, 800, 2);
      
        $interval(function () {
            $scope.LoadBRAND_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadUNIT_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadCATEGORY_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadGROUP_ID();
        }, 800, 2);
       
      
        $interval(function () {
            $scope.LoadCOMPANY_ID();
        }, 800, 2);
       
       
    }
    $scope.LoadPRODUCT_SEASON_ID = function () {
        $('#PRODUCT_SEASON_ID').trigger('change');

    }
    $scope.LoadPRIMARY_PRODUCT_ID = function () {
        $('#PRIMARY_PRODUCT_ID').trigger('change');

    }
    $scope.LoadPRODUCT_TYPE_ID = function () {
        $('#PRODUCT_TYPE_ID').trigger('change');

    }
    $scope.LoadBASE_PRODUCT_ID = function () {
        $('#BASE_PRODUCT_ID').trigger('change');

    }
    $scope.LoadSTORAGE_ID = function () {
        $('#STORAGE_ID').trigger('change');

    }
    $scope.LoaPACK_SIZE = function () {
        $('#PACK_SIZE').trigger('change');
    }
    $scope.LoadUNIT_ID = function () {
        $('#UNIT_ID').trigger('change');
    }
    $scope.LoadBRAND_ID = function () {
        $('#BRAND_ID').trigger('change');
    }
    $scope.LoadCATEGORY_ID = function () {
        $('#CATEGORY_ID').trigger('change');
    }
    $scope.LoadGROUP_ID = function () {
        $('#GROUP_ID').trigger('change');
    }
    $scope.LoadWEIGHT_UNIT = function () {
        $('#WEIGHT_UNIT').trigger('change');
    }
    $scope.LoadCOMPANY_ID = function () {
        $('#COMPANY_ID').trigger('change');
    }
    $scope.LoadSHIPPER_VOLUME_UNIT = function () {
        $('#SHIPPER_VOLUME_UNIT').trigger('change');
    }
    $scope.LoadSHIPPER_WEIGHT_UNIT = function () {
        $('#SHIPPER_WEIGHT_UNIT').trigger('change');
    }
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'Product',
            Action_Name: 'ProductInfo'
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
   
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.LoadStatus();
    //$scope.LoadGeneratedProductCode();  commented date: 6/27/2022
    $scope.LoadBaseProductData();
    $scope.LoadBrandData();
    $scope.LoadCategoryData();
    $scope.LoadGroupData();
    $scope.LoadPackSizeData();
    $scope.LoadPrimaryProductData();
    $scope.LoadProductSeasonData();
    $scope.LoadProductTypeData();
    $scope.LoadStorageData();
    $scope.LoadUnitData();
    $scope.LoadCompanyUnitData();

    $scope.DataLoad($scope.model.COMPANY_ID);



    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;
        model.BASE_PRODUCT_ID = parseInt(model.BASE_PRODUCT_ID);
        model.BRAND_ID = parseInt(model.BRAND_ID);
        model.CATEGORY_ID = parseInt(model.CATEGORY_ID);
        model.COMPANY_ID = parseInt(model.COMPANY_ID);
        model.GROUP_ID = parseInt(model.GROUP_ID);
        model.PRIMARY_PRODUCT_ID = parseInt(model.PRIMARY_PRODUCT_ID);
        model.PRODUCT_SEASON_ID = parseInt(model.PRODUCT_SEASON_ID);
        model.PRODUCT_TYPE_ID = parseInt(model.PRODUCT_TYPE_ID);
        model.SKU_ID = parseInt(model.SKU_ID);
        model.STORAGE_ID = parseInt(model.STORAGE_ID);
        model.UNIT_ID = parseInt(model.UNIT_ID);

        console.log(model);
        ProductInfoServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;

                window.setTimeout(function () {
                    window.location.href = "/SalesAndDistribution/Product/ProductInfo";
                }, 2000)
            }
            else {
                $scope.showLoader = false;
            }
        });
    }

}]);

