ngApp.controller('ngGridCtrl', ['$scope', 'CustomerInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, CustomerInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = {
          BIN_NO: ''
        , COMPANY_ID: 0
        , CONTACT_PERSON_NAME: ''
        , CONTACT_PERSON_NO: ''
        , CUSTOMER_ADDRESS: ''
        , CUSTOMER_ADDRESS_BANGLA: ''
        , CUSTOMER_CODE: ''
        , CUSTOMER_CONTACT: ''
        , CUSTOMER_EMAIL: ''
        , CUSTOMER_ID: 0
        , CUSTOMER_NAME: ''
        , CUSTOMER_NAME_BANGLA: ''
        , CUSTOMER_REMARKS: ''
        , CUSTOMER_STATUS: 'Active'
        , CUSTOMER_TYPE_ID: 0
        , DB_LOCATION_NAME: ''
        , DELIVERY_ADDRESS: ''
        , DELIVERY_ADDRESS_BANGLA: ''
        , PRICE_TYPE_ID: 0
        , PROPRIETOR_NAME: ''
        , SECURITY_MONEY: 0
        , TDS_FLAG: ''
        , TIN_NO: ''
        , TRADE_LICENSE_NO: ''
        , UNIT_ID: 0
        , VAT_REG_NO: ''
    }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.PriceType = [];
    $scope.Unit = [];
    $scope.CustomerType = [];
    $scope.Status = [];
    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Customer Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridOptionsList.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false,  width: '50'
        }

        , { name: 'CUSTOMER_ID', field: 'CUSTOMER_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }
     
        , {
            name: 'CUSTOMER_NAME', field: 'CUSTOMER_NAME', displayName: 'Name', enableFiltering: true, width: '22%'
        }
        , {
            name: 'CUSTOMER_CODE', field: 'CUSTOMER_CODE', displayName: 'Code', enableFiltering: true, width: '15%'
        }
       
        , {
            name: 'CUSTOMER_REMARKS', field: 'CUSTOMER_REMARKS', displayName: 'Remark', enableFiltering: true, width: '25%'
        }
        , { name: 'CUSTOMER_STATUS', field: 'CUSTOMER_STATUS', displayName: 'Status', enableFiltering: true, width: '18%' }
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

        CustomerInfoServices.LoadData(companyId).then(function (data) {
            debugger
            console.log(data.data)
            $scope.gridOptionsList.data = data.data;
            $scope.showLoader = false;
            $scope.model.COMPANY_SEARCH_ID = companyId;
            $interval(function () {
                $('.select2-single').trigger('change');
            }, 800, 4);
        }, function (error) {
            debugger
            alert(error);
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

            CustomerInfoServices.LoadData($scope.model.COMPANY_ID).then(function (data) {
                debugger
                $scope.gridOptionsList.data = data.data.filter(function (element) { return element.CUSTOMER_STATUS == 'Active' });;
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

            CustomerInfoServices.LoadData($scope.model.COMPANY_ID).then(function (data) {
                debugger
                $scope.gridOptionsList.data = data.data.filter(function (element) { return element.CUSTOMER_STATUS == 'InActive' });;
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
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        CustomerInfoServices.GetCompany().then(function (data) {
            console.log(data.data)
            $scope.model.COMPANY_ID = parseFloat(data.data);
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
    
    $scope.LoadPriceTypeData = function () {
        $scope.showLoader = true;

        CustomerInfoServices.LoadPriceTypeData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.PriceType = data.data;

            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    //$scope.LoadData = function () {
    //    $scope.showLoader = true;

    //    CustomerInfoServices.LoadPackSizeData($scope.model.COMPANY_ID).then(function (data) {
    //        console.log(data.data)
    //        $scope.PackSize = data.data;
    //        $scope.showLoader = false;
    //    }, function (error) {
    //        console.log(error);
    //        $scope.showLoader = false;

    //    });
    //}
    
    $scope.LoadCustomerTypeData = function () {
        console.log("Customer type")
        $scope.showLoader = true;

        CustomerInfoServices.LoadCustomerTypeData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.CustomerType = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
   
    $scope.LoadUnitData = function () {
        $scope.showLoader = true;

        CustomerInfoServices.LoadUnitData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Unit = data.data.filter(function (element) { return element.COMPANY_ID == $scope.model.COMPANY_ID });;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }

    $scope.LoadGeneratedCustomerCode = function () {
    
    }
    $scope.LoadStatus = function () {
        var Active = {
            STATUS: 'Active'
        }
        var InActive = {
            STATUS: 'InActive'
        }
        var Hold = {
            STATUS: 'Hold'
        }
        $scope.Status.push(Active);
        $scope.Status.push(InActive);
        $scope.Status.push(Hold);

    }
    $scope.ClearForm = function () {
        window.location.href = "/SalesAndDistribution/Customer/CustomerInfo";

    }

    $scope.EditData = function (entity) {
        debugger
        $scope.model.BIN_NO = entity.BIN_NO;
        $scope.model.COMPANY_ID = entity.COMPANY_ID;
        $scope.model.CONTACT_PERSON_NAME = entity.CONTACT_PERSON_NAME;
        $scope.model.CONTACT_PERSON_NO = entity.CONTACT_PERSON_NO;
        $scope.model.CUSTOMER_ADDRESS = entity.CUSTOMER_ADDRESS;
        $scope.model.CUSTOMER_ADDRESS_BANGLA = entity.CUSTOMER_ADDRESS_BANGLA;
        $scope.model.CUSTOMER_CODE = entity.CUSTOMER_CODE;
        $scope.model.CUSTOMER_CONTACT = entity.CUSTOMER_CONTACT;
        $scope.model.CUSTOMER_EMAIL = entity.CUSTOMER_EMAIL;
        $scope.model.CUSTOMER_ID = entity.CUSTOMER_ID;
        $scope.model.CUSTOMER_NAME = entity.CUSTOMER_NAME;
        $scope.model.CUSTOMER_NAME_BANGLA = entity.CUSTOMER_NAME_BANGLA;
        $scope.model.CUSTOMER_REMARKS = entity.CUSTOMER_REMARKS;
        $scope.model.CUSTOMER_STATUS = entity.CUSTOMER_STATUS;
        $scope.model.CUSTOMER_TYPE_ID = entity.CUSTOMER_TYPE_ID;
        $scope.model.DB_LOCATION_NAME = entity.DB_LOCATION_NAME;
        $scope.model.DELIVERY_ADDRESS = entity.DELIVERY_ADDRESS;
        $scope.model.DELIVERY_ADDRESS_BANGLA = entity.DELIVERY_ADDRESS_BANGLA;
        $scope.model.PRICE_TYPE_ID = entity.PRICE_TYPE_ID;
        $scope.model.PROPRIETOR_NAME = entity.PROPRIETOR_NAME;
        $scope.model.SECURITY_MONEY = entity.SECURITY_MONEY;
        $scope.model.TDS_FLAG = entity.TDS_FLAG;
        $scope.model.TIN_NO = entity.TIN_NO;
        $scope.model.TRADE_LICENSE_NO = entity.TRADE_LICENSE_NO;
        $scope.model.UNIT_ID = entity.UNIT_ID;
        $scope.model.VAT_REG_NO = entity.VAT_REG_NO;

       
        $interval(function () {
            $scope.LoadCUSTOMER_TYPE_ID();
        }, 800, 2);

        $interval(function () {
            $scope.LoadUNIT_ID();
        }, 800, 2);
   
        $interval(function () {
            $scope.LoadCOMPANY_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadPRICE_TYPE_ID();
        }, 800, 2);
        $interval(function () {
            $scope.LoadCUSTOMER_STATUS();
        }, 800, 2);
        $interval(function () {
            $scope.LoadTDS_FLAG();
        }, 800, 2);
       
       
    }
    $scope.LoadPRICE_TYPE_ID = function () {
        $('#PRICE_TYPE_ID').trigger('change');

    }
   
    $scope.LoadCUSTOMER_TYPE_ID = function () {
        $('#CUSTOMER_TYPE_ID').trigger('change');

    }
    
    $scope.LoadUNIT_ID = function () {
        $('#UNIT_ID').trigger('change');
    }
   
    $scope.LoadCOMPANY_ID = function () {
        $('#COMPANY_ID').trigger('change');
    }
    $scope.LoadTDS_FLAG = function () {
        $('#TDS_FLAG').trigger('change');
    }
    $scope.LoadCUSTOMER_STATUS = function () {
        $('#CUSTOMER_STATUS').trigger('change');
    }

    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'Customer',
            Action_Name: 'CustomerInfo'
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
    $scope.LoadPriceTypeData();
    $scope.LoadCustomerTypeData();
    $scope.LoadUnitData();
    $scope.DataLoad($scope.model.COMPANY_ID);
    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;
        model.PRICE_TYPE_ID = parseInt(model.PRICE_TYPE_ID);
        model.SECURITY_MONEY = model.SECURITY_MONEY == null? 0 : parseFloat(model.SECURITY_MONEY);
        model.COMPANY_ID = parseInt(model.COMPANY_ID);
        model.CUSTOMER_TYPE_ID = parseInt(model.CUSTOMER_TYPE_ID);
        model.CUSTOMER_ID = parseInt(model.CUSTOMER_ID);
        model.UNIT_ID = parseInt(model.UNIT_ID);

        console.log(model);
        CustomerInfoServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;

            }
            else {
                $scope.showLoader = false;
            }
        });
    }

}]);

