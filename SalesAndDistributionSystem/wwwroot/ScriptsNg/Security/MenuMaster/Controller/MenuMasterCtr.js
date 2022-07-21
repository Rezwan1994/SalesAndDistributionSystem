ngApp.controller('ngGridCtrl', ['$scope', 'MenuMasterServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, MenuMasterServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    $scope.model = { COMPANY_ID: 0, MENU_ID: 0, MENU_NAME: '', ORDER_BY_SLNO: 0, MODULE_ID: 0, CONTROLLER: '', ACTION: '', HREF: '', STATUS: '', PARENT_MENU_ID: 0, MENU_SHOW: 'Active'}
    $scope.MenuCategories = [];
    $scope.Companies = [];
    $scope.IsReportValues = [];
    $scope.showLoader = true;
    $scope.ParantData = [];
    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Menu Master"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }


  
    $scope.AutoCompleteDataLoadForMenuCategory = function () {
        debugger
        return MenuMasterServices.GetMenuCetagories($scope.model.COMPANY_ID).then(function (data) {
            debugger
                $scope.MenuCategories = data.data;
            }, function (error) {
                debugger
                alert(error);
                console.log(error);
            });
        
    }
    $scope.Load_IsMenuShow = function () {
        var Active = {
            STATUS: 'Active'
        }
        var InActive = {
            STATUS: 'InActive'
        }
        
        $scope.IsReportValues.push(Active);
        $scope.IsReportValues.push(InActive);

    }
    $scope.Load_IsMenuShow();
    $scope.typeaheadSelectedMenuCategory = function (entity, selectedItem) {
        $scope.model.MODULE_ID = selectedItem.MODULE_ID;
        $scope.model.MODULE_NAME = selectedItem.MODULE_NAME;
    };


    $scope.DataLoad = function (companyId) {
        $scope.showLoader = true;
        MenuMasterServices.GetMenu(companyId).then(function (data) {
            debugger
            console.log(data.data)
            $scope.gridOptionsList.data = data.data;
            $scope.ParantData = data.data;
            $scope.model.COMPANY_SEARCH_ID = companyId;
            $scope.AutoCompleteDataLoadForMenuCategory();
            $scope.showLoader = false;
            console.log(data.data)
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.ClearForm = function () {
        $scope.model.COMPANY_SEARCH_ID = 0;
        $scope.model.COMPANY_ID = 0;

        $scope.model.MENU_ID = 0;
        $scope.model.MENU_NAME = "";
        $scope.model.AREA = "";

        $scope.model.ORDER_BY_SLNO = 0;
        $scope.model.MODULE_ID = 0;
        $scope.model.MODULE = '';
        $scope.model.CONTROLLER = '';
        $scope.model.ACTION = '';
        $scope.model.HREF = '';
        $scope.model.STATUS = '';
        $scope.model.PARENT_MENU_ID = 0;
        $scope.model.PARENT_MENU = '';
        $scope.model.MENU_SHOW = 'Active';

    }

    $scope.EditData = function (entity) {
        debugger

        $scope.model.MENU_ID = entity.MENU_ID;
        $scope.model.MENU_NAME = entity.MENU_NAME;
        $scope.model.ORDER_BY_SLNO = entity.ORDER_BY_SLNO;
        $scope.model.MODULE_ID = entity.MODULE_ID;
        $scope.model.CONTROLLER = entity.CONTROLLER;
        $scope.model.AREA = entity.AREA;
        $scope.model.MENU_SHOW = entity.MENU_SHOW;

        $scope.model.ACTION = entity.ACTION;
        $scope.model.HREF = entity.HREF;
        $scope.model.PARENT_MENU_ID = entity.PARENT_MENU_ID!=null? entity.PARENT_MENU_ID : 0;
        $scope.SaveData($scope.model);

    }
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'MenuMaster',
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

        MenuMasterServices.GetCompanyList().then(function (data) {
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

        MenuMasterServices.GetCompany().then(function (data) {
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

    $scope.DataLoad(0);
    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();

    $scope.gridOptionsList.columnDefs = [
        { name: 'SL', field: 'ROW_NO', enableFiltering: false, width: '60' }

        , { name: 'MENU_ID', field: 'MENU_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }


        , {
            name: 'MENU_NAME', field: 'MENU_NAME', displayName: 'Menu Name', enableFiltering: true, width: '18%', cellTemplate:
                '<input required="required"   ng-model="row.entity.MENU_NAME"  class="pl-sm" />'
        }
        , {
            name: 'ORDER_BY_SLNO', field: 'ORDER_BY_SLNO', displayName: 'Order', enableFiltering: true, width: '10%', cellTemplate:
                '<input required="required"  type="number"  ng-model="row.entity.ORDER_BY_SLNO"  class="pl-sm" />'
        }
        , { name: 'STATUS', field: 'STATUS', displayName: 'Status', enableFiltering: true, width: '10%' }
        , {
            name: 'HREF', field: 'HREF', displayName: 'URL', enableFiltering: true, visible: false, width: '10%'
        },
        , {
            name: 'AREA', field: 'AREA', displayName: 'Area', enableFiltering: true, width: '10%', cellTemplate:
                '<input required="required"  type="text"  ng-model="row.entity.AREA"  class="pl-sm" />'
        }
        , {
            name: 'CONTROLLER', field: 'CONTROLLER', displayName: 'Controller', enableFiltering: true, width: '12%', cellTemplate:
                '<input required="required"  type="text"  ng-model="row.entity.CONTROLLER"  class="pl-sm" />'
        }
        , {
            name: 'ACTION', field: 'ACTION', displayName: 'Action', enableFiltering: true, width: '12%', cellTemplate:
                '<input required="required"  type="text"  ng-model="row.entity.ACTION"  class="pl-sm" />'
        }
        , {
            name: 'PARENT_MENU_ID', field: 'PARENT_MENU_ID', displayName: 'Parent', enableFiltering: true, width: '10%', cellTemplate:
                '<script src="~/Design/vendor/select2/dist/js/select2.min.js"></script><script type="text/javascript">$(document).ready(function () {$(".select2-single").select2({ }); });</script><select  class="select2-single form-control pl-sm" id="PARENT_MENU_ID"   ng-model="row.entity.PARENT_MENU_ID" style = "width:100%"> <option ng-repeat="item in grid.appScope.ParantData" ng-value="{{item.MENU_ID}}" ng-selected="row.entity.PARENT_MENU_ID == item.MENU_ID">{{ item.MENU_NAME }}</option> </select > '
        }
        , {
            name: 'MODULE_ID', field: 'MODULE_ID', displayName: 'Module', enableFiltering: true, width: '12%', cellTemplate:
                '<select  class="select2-single form-control pl-sm" id="MODULE_ID"   ng-model="row.entity.MODULE_ID" style = "width:100%"> <option ng-repeat="item in grid.appScope.MenuCategories" ng-value="{{item.MODULE_ID}}" ng-selected="row.entity.MODULE_ID == item.MODULE_ID">{{ item.MODULE_NAME }}</option> </select > '
        }
        , {
            name: 'MENU_SHOW', field: 'MENU_SHOW', displayName: 'Menu Show', enableFiltering: true, width: '12%', cellTemplate:
                '<select  class="select2-single form-control pl-sm" id="MENU_SHOW"   ng-model="row.entity.MENU_SHOW" style = "width:100%"> <option ng-repeat="item in grid.appScope.IsReportValues" value="{{item.STATUS}}" ng-selected="item.STATUS == row.entity.MENU_SHOW" >{{item.STATUS}}</option></select > '
        }
       , {
            name: 'Actions', displayName: 'Actions', width: '35%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
               '<div style="margin:1px;">' +
               '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Update</button>' +
               '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.ActivateMenu(row.entity.MENU_ID)" type="button" class="btn btn-outline-success mb-1"  ng-disabled="row.entity.STATUS == \'Active\'">Activate</button>' +
               '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" type="button" class="btn btn-outline-secondary mb-1" ng-disabled="row.entity.STATUS == \'InActive\'" ng-click="grid.appScope.DeactivateMenu(row.entity.MENU_ID)">Deactive</button>' +
               '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.DELETE_PERMISSION == \'Active\'" ng-click="grid.appScope.DeleteMenu(row.entity.MENU_ID)" type="button" class="btn btn-outline-danger mb-1">Delete</button>' +
               '</div>'
        },

    ];

   


    $scope.SaveData = function (model) {
        debugger
       
        $scope.showLoader = true;
        console.log(model);
        MenuMasterServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.DataLoad($scope.model.COMPANY_ID);
                $scope.model.Name = "";
                $scope.model.SerialNo = "";
            }
            else {
                $scope.showLoader = false;
            }
        });
    }

    


    $scope.ActivateMenu = function (Id) {
        debugger
        $scope.showLoader = true;
        MenuMasterServices.ActivateMenu(Id).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Activated the selected category !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.DataLoad($scope.model.COMPANY_ID);

            }
            else {
                $scope.showLoader = false;
            }
        });
    }

    $scope.DeactivateMenu = function (Id) {
        debugger
        $scope.showLoader = true;
        MenuMasterServices.DeactivateMenu(Id).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Deactivated the selected category !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.DataLoad($scope.model.COMPANY_ID);

            }
            else {
                $scope.showLoader = false;
            }
        });
    }
    $scope.DeleteMenu = function (Id) {
        debugger
        $scope.showLoader = true;
        if (window.confirm("Are you sure to delete this Menu Category?")) {
            MenuMasterServices.DeleteMenu(Id).then(function (data) {

                notificationservice.Notification(data.data, 1, 'Deleted the selected category !!');
                if (data.data == 1) {
                    $scope.showLoader = false;
                    $scope.DataLoad($scope.model.COMPANY_ID);

                }
                else {
                    $scope.showLoader = false;
                }
            });
        }


    }

}]);

