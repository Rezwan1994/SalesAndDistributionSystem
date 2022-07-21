ngApp.controller('ngGridCtrl', ['$scope', 'RolesServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, RolesServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    $scope.model = { COMPANY_ID:0, ROLE_ID: 0, ROLE_NAME: '' }


    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("Roles Info"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.ActivityID = [];
    $scope.RoleLst = [];
    $scope.Companies = []

    $scope.AutoCompleteDataLoadForRole = function (value) {
        if (value.length >= 3) {
            debugger
            
            return RolesServices.GetSearchableRoles(value, $scope.model.COMPANY_ID).then(function (data) {
                $scope.RoleLst = data.data;
                debugger

                return $scope.RoleLst;
            }, function (error) {
                alert(error);
                debugger

                console.log(error);
            });
        }
    }


    $scope.typeaheadSelectedRole = function (entity, selectedItem) {
        $scope.model.ROLE_ID = selectedItem.ROLE_ID;
        $scope.model.ROLE_NAME = selectedItem.ROLE_NAME;

    };
    $scope.selectionOfPermission = function (entity, permissionfield) {
        debugger
        $scope.ActivityID.push(entity.MENU_ID);
        if (permissionfield == "ALL") {
            if (!entity.ALL_PERMISSION_CHECK) {
                entity.LIST_VIEW = "Active";
                entity.LIST_VIEW_CHECK = true;

                entity.ADD_PERMISSION = "Active";
                entity.ADD_PERMISSION_CHECK = true;

                entity.EDIT_PERMISSION = "Active";
                entity.EDIT_PERMISSION_CHECK = true;

                entity.DELETE_PERMISSION = "Active";
                entity.DELETE_PERMISSION_CHECK = true;

                entity.DETAIL_VIEW = "Active";
                entity.DETAIL_VIEW_CHECK = true;

                entity.DOWNLOAD_PERMISSION = "Active";
                entity.DOWNLOAD_PERMISSION_CHECK = true;
            }
            else {
                entity.LIST_VIEW = "InActive";
                entity.LIST_VIEW_CHECK = false;

                entity.ADD_PERMISSION = "InActive";
                entity.ADD_PERMISSION_CHECK = false;

                entity.EDIT_PERMISSION = "InActive";
                entity.EDIT_PERMISSION_CHECK = false;

                entity.DELETE_PERMISSION = "InActive";
                entity.DELETE_PERMISSION_CHECK = false;

                entity.DETAIL_VIEW = "InActive";
                entity.DETAIL_VIEW_CHECK = false;

                entity.DOWNLOAD_PERMISSION = "InActive";
                entity.DOWNLOAD_PERMISSION_CHECK = false;
            }



        }
        if (permissionfield == "LIST_VIEW_CHECK") {
            if (!entity.LIST_VIEW_CHECK) {
                entity.LIST_VIEW = "Active";
                entity.LIST_VIEW_CHECK = true;


            } else {
                entity.LIST_VIEW = "InActive";
                entity.LIST_VIEW_CHECK = false;
            }

        }
        if (permissionfield == "ADD_PERMISSION_CHECK") {
            if (!entity.ADD_PERMISSION_CHECK) {
                entity.ADD_PERMISSION = "Active";
                entity.ADD_PERMISSION_CHECK = true;


            } else {
                entity.ADD_PERMISSION = "InActive";
                entity.ADD_PERMISSION_CHECK = false;
            }

        }
        if (permissionfield == "EDIT_PERMISSION_CHECK") {
            if (!entity.EDIT_PERMISSION_CHECK) {
                entity.EDIT_PERMISSION = "Active";
                entity.EDIT_PERMISSION_CHECK = true;


            } else {
                entity.EDIT_PERMISSION = "InActive";
                entity.EDIT_PERMISSION_CHECK = false;
            }

        }
        if (permissionfield == "DELETE_PERMISSION_CHECK") {
            if (!entity.DELETE_PERMISSION_CHECK) {
                entity.DELETE_PERMISSION = "Active";
                entity.DELETE_PERMISSION_CHECK = true;


            } else {
                entity.DELETE_PERMISSION = "InActive";
                entity.DELETE_PERMISSION_CHECK = false;
            }

        }
        if (permissionfield == "DETAIL_VIEW_CHECK") {
            if (!entity.DETAIL_VIEW_CHECK) {
                entity.DETAIL_VIEW = "Active";
                entity.DETAIL_VIEW_CHECK = true;


            } else {
                entity.DETAIL_VIEW = "InActive";
                entity.DETAIL_VIEW_CHECK = false;
            }

        }
        if (permissionfield == "DOWNLOAD_PERMISSION_CHECK") {
            if (!entity.DOWNLOAD_PERMISSION_CHECK) {
                entity.DOWNLOAD_PERMISSION = "Active";
                entity.DOWNLOAD_PERMISSION_CHECK = true;


            } else {
                entity.DOWNLOAD_PERMISSION = "InActive";
                entity.DOWNLOAD_PERMISSION_CHECK = false;
            }

        }
    };
    $scope.filterData = function (entity) {

        if (entity.LIST_VIEW == "Active" && entity.ADD_PERMISSION == "Active" && entity.EDIT_PERMISSION == "Active"
            && entity.DELETE_PERMISSION == "Active" && entity.DETAIL_VIEW == "Active" && entity.DOWNLOAD_PERMISSION == "Active") {
            entity.ALL_PERMISSION_CHECK = true;
        }
        else {

            entity.ALL_PERMISSION_CHECK = false;
        }


        if (entity.LIST_VIEW == "Active") {

            entity.LIST_VIEW_CHECK = true;

        } else {
            entity.LIST_VIEW_CHECK = false;
        }
        debugger
        if (entity.ADD_PERMISSION == "Active") {
            
            entity.ADD_PERMISSION_CHECK = true;

        } else {
            entity.ADD_PERMISSION_CHECK = false;
        }


        if (entity.EDIT_PERMISSION == "Active") {

            entity.EDIT_PERMISSION_CHECK = true;


        } else {
            entity.EDIT_PERMISSION_CHECK = false;
        }


        if (entity.DELETE_PERMISSION == "Active") {
            entity.DELETE_PERMISSION_CHECK = true;

        } else {
            entity.DELETE_PERMISSION_CHECK = false;
        }


        if (entity.DETAIL_VIEW == "Active") {

            entity.DETAIL_VIEW_CHECK = true;


        } else {
            entity.DETAIL_VIEW_CHECK = false;
        }


        if (entity.DOWNLOAD_PERMISSION == "Active") {

            entity.DOWNLOAD_PERMISSION_CHECK = true;


        } else {
            entity.DOWNLOAD_PERMISSION_CHECK = false;
        }


    };
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger

        $scope.permissionReqModel = {
            Controller_Name: 'Role',
            Action_Name: 'RoleMenuConfig'
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

        RolesServices.GetCompanyList().then(function (data) {
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

        RolesServices.GetCompany().then(function (data) {
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


    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.GetPermissionData();

    $scope.gridOptionsList.columnDefs = [
        { name: 'SL', field: 'ROW_NO', enableFiltering: false, width: '50' }

        , { name: 'ROLE_ID', field: 'ROLE_ID', visible: false  }
        , { name: 'MENU_ID', field: 'MENU_ID', visible: false }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }

        , { name: 'ROLE_CONFIG_ID', field: 'ROLE_CONFIG_ID', visible: false }


        , { name: 'PARENT_MENU_ID', field: 'PARENT_MENU_ID', visible: false }
        , { name: 'MODULE_ID', field: 'MODULE_ID', visible: false }

        , { name: 'MODULE_NAME', field: 'MODULE_NAME', displayName: 'Module', enableFiltering: true, width: ' 10%' }
        , { name: 'PARENT_MENU_NAME', field: 'PARENT_MENU_NAME', displayName: 'Parent', enableFiltering: true, width: ' 10%' }

        , {
            name: 'MENU_NAME', field: 'MENU_NAME', displayName: 'Menu', enableFiltering: true, width: '12%', cellTemplate:
                '<a class="" href="../{{row.entity.HREF}}"  style="margin:10px;margin-top:15px;margin-bottom:0px !important" target="_blank">{{row.entity.MENU_NAME}}</a>'
        }

        , {
            name: 'ALL_PERMISSION_CHECK', field: 'ALL_PERMISSION_CHECK', displayName: 'ALL', enableFiltering: false, width: '10%', cellTemplate:
                '<input class=\"ngSelectionCheckbox\" ng-click="grid.appScope.selectionOfPermission(row.entity,\'ALL\')"  ng-model="row.entity.ALL_PERMISSION_CHECK" type=\"checkbox\" ng-checked=\"row.entity.ALL_PERMISSION_CHECK\" style="margin-top:0px !important" />'
        }
        , { name: 'LIST_VIEW', field: 'LIST_VIEW', visible: false }


        , {
            name: 'LIST_VIEW_CHECK', field: 'LIST_VIEW_CHECK', displayName: 'List', enableFiltering: false, width: '9%', cellTemplate:
                '<input class=\"ngSelectionCheckbox\" ng-click="grid.appScope.selectionOfPermission(row.entity,\'LIST_VIEW_CHECK\')" ng-model="row.entity.LIST_VIEW_CHECK" type=\"checkbox\" ng-checked=\"row.entity.LIST_VIEW_CHECK\"  style="margin-top:0px !important" />'
        }
        , { name: 'ADD_PERMISSION', field: 'ADD_PERMISSION', visible: false }

        , {
            name: 'ADD_PERMISSION_CHECK', field: 'ADD_PERMISSION_CHECK', displayName: 'Add', enableFiltering: false, width: '9%', cellTemplate:
                '<input class=\"ngSelectionCheckbox\" ng-click="grid.appScope.selectionOfPermission(row.entity,\'ADD_PERMISSION_CHECK\')" ng-model="row.entity.ADD_PERMISSION_CHECK" type=\"checkbox\" ng-checked=\"row.entity.ADD_PERMISSION_CHECK\" style="margin-top:0px !important" />'
        }
        , { name: 'EDIT_PERMISSION', field: 'EDIT_PERMISSION', visible: false }

        , {
            name: 'EDIT_PERMISSION_CHECK', field: 'EDIT_PERMISSION_CHECK', displayName: 'Edit', enableFiltering: false, width: '9%', cellTemplate:
                '<input class=\"ngSelectionCheckbox\" ng-click="grid.appScope.selectionOfPermission(row.entity,\'EDIT_PERMISSION_CHECK\')" type=\"checkbox\" ng-model="row.entity.EDIT_PERMISSION_CHECK" ng-checked=\"row.entity.EDIT_PERMISSION_CHECK\"  style="margin-top:0px !important" />'
        }
        , { name: 'DELETE_PERMISSION', field: 'DELETE_PERMISSION', visible: false }

        , {
            name: 'DELETE_PERMISSION_CHECK', field: 'DELETE_PERMISSION_CHECK', displayName: 'Delete', enableFiltering: false, width: '9%', cellTemplate:
                '<input class=\"ngSelectionCheckbox\" ng-click="grid.appScope.selectionOfPermission(row.entity,\'DELETE_PERMISSION_CHECK\')" ng-model="row.entity.DELETE_PERMISSION_CHECK" type=\"checkbox\" ng-checked=\"row.entity.DELETE_PERMISSION_CHECK\"  style="margin-top:0px !important" />'
        }
        , { name: 'DETAIL_VIEW', field: 'DETAIL_VIEW', visible: false }

        , {
            name: 'DETAIL_VIEW_CHECK', field: 'DETAIL_VIEW_CHECK', displayName: 'Detail', enableFiltering: false, width: '9%', cellTemplate:
                '<input class=\"ngSelectionCheckbox\"  ng-click="grid.appScope.selectionOfPermission(row.entity,\'DETAIL_VIEW_CHECK\')" ng-model="row.entity.DETAIL_VIEW_CHECK" type=\"checkbox\" ng-checked=\"row.entity.DETAIL_VIEW_CHECK\" style="margin-top:0px !important" />'
        }
        , { name: 'DOWNLOAD_PERMISSION', field: 'DOWNLOAD_PERMISSION', visible: false }

        , {
            name: 'DOWNLOAD_PERMISSION_CHECK', field: 'DOWNLOAD_PERMISSION_CHECK', displayName: 'Download', enableFiltering: false, width: '9%', cellTemplate:
                '<input class=\"ngSelectionCheckbox\" ng-click="grid.appScope.selectionOfPermission(row.entity,\'DOWNLOAD_PERMISSION_CHECK\')" type=\"checkbox\" ng-model="row.entity.DOWNLOAD_PERMISSION_CHECK" ng-checked=\"row.entity.DOWNLOAD_PERMISSION_CHECK\"  style="margin-top:0px !important" />'
        }



    ];

    $scope.MenuRoleConfigData = [];

    $scope.bindMenuRoleConfigData = function (model) {
        debugger
        $scope.MenuRoleConfigData = [];
        for (var i = 0; i < $scope.gridOptionsList.data.length; i++) {
            var activity = $scope.ActivityID.indexOf($scope.gridOptionsList.data[i].MENU_ID);
            if (activity != (-1) || ($scope.gridOptionsList.data[i].ROLE_CONFIG_ID != null && $scope.gridOptionsList.data[i].ROLE_CONFIG_ID > 0)) {

                $scope.loadData = {
                    ID: 0,
                    ROLE_ID: model.ROLE_ID,
                    MENU_ID: $scope.gridOptionsList.data[i].MENU_ID,
                    ADD_PERMISSION: $scope.gridOptionsList.data[i].ADD_PERMISSION,
                    EDIT_PERMISSION: $scope.gridOptionsList.data[i].EDIT_PERMISSION,
                    LIST_VIEW: $scope.gridOptionsList.data[i].LIST_VIEW,
                    DOWNLOAD_PERMISSION: $scope.gridOptionsList.data[i].DOWNLOAD_PERMISSION,
                    DETAIL_VIEW: $scope.gridOptionsList.data[i].DETAIL_VIEW,
                    DELETE_PERMISSION: $scope.gridOptionsList.data[i].DELETE_PERMISSION,
                    ROLE_CONFIG_ID: $scope.gridOptionsList.data[i].ROLE_CONFIG_ID,
                    COMPANY_ID: parseInt($scope.model.COMPANY_ID)

                };
                debugger
                $scope.MenuRoleConfigData.push($scope.loadData);
            }

        }


    };
    $scope.SaveData = function (model) {
        debugger
        model.MenuRoleConfigData = $scope.gridOptionsList.data;
        $scope.bindMenuRoleConfigData(model);
        $scope.showLoader = true;
        console.log(model);
        RolesServices.SaveRoleMenuPermission($scope.MenuRoleConfigData).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.RoleMenuConfigSelectionList();
                $scope.ClearForm();
            }
            else {
                $scope.showLoader = false;
            }
        });
    }

    $scope.RoleMenuConfigSelectionList = function () {
        debugger
        var Id = $scope.model.ROLE_ID;
        var CompId = $scope.model.COMPANY_ID;

        $scope.showLoader = true;
        RolesServices.RoleMenuConfigSelectionList(Id, CompId).then(function (data) {

            $scope.gridOptionsList.data = data.data;
            for (var i = 0; i < $scope.gridOptionsList.data.length; i++) {
                $scope.filterData($scope.gridOptionsList.data[i])
            }
            $scope.showLoader = false;

        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }



}]);

