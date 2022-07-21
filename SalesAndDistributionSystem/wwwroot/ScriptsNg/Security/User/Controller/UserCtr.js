ngApp.controller('ngGridCtrl', ['$scope', 'UserServices', 'permissionProvider','CompanyService', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, UserServices, permissionProvider, CompanyService, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    $scope.model = { USER_ID: 0, USER_NAME: '', COMPANY_ID: 0, UNIT_ID: 0 }
    $scope.CompanyData = [];
    $scope.UnitData = [];
    $scope.UserTypeData = [];
    $scope.EmployeeData = [];


    $scope.gridOptionsList = (gridregistrationservice.GridRegistration("User Ctr"));
    $scope.gridOptionsList.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }


  
    $scope.CompanyDataLoad = function () {
          CompanyService.GetCompanyList().then(function (data) {
                $scope.CompanyData = data.data;
            }, function (error) {
                console.log(error);
            });
    }

    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        CompanyService.GetCompany().then(function (data) {
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
    $scope.UnitDataLoad = function (id) {
        CompanyService.GetUnitList().then(function (data) {
            debugger
            if (id != 0) {
                $scope.UnitData = data.data.filter(function (element) { return element.COMPANY_ID == id });

            } else {
                $scope.UnitData = data.data.filter(function (element) { return element.COMPANY_ID == $scope.gridOptionsList.data[0].COMPANY_ID });

            }
        }, function (error) {
            console.log(error);
        });
    }
    $scope.UserTypeDataLoad = function () {
        $scope.UserType = {
            Type: 'General'
        }
        $scope.UserType1 = {
            Type: 'Admin'
        }

        
        $scope.UserTypeData.push($scope.UserType);
        $scope.UserTypeData.push($scope.UserType1);
        if ($scope.model.UserType == 'SuperAdmin') {
            $scope.UserType2 = {
                Type: 'SuperAdmin'
            }
            $scope.UserTypeData.push($scope.UserType2);

        }

    }
   
    $scope.typeaheadSelectedCompany = function (entity) {
        debugger
        $scope.model.COMPANY_ID = entity.COMPANY_ID;
        $scope.UnitDataLoad($scope.model.COMPANY_ID);

    };
    $scope.DataLoad = function () {
        $scope.showLoader = true;
        UserServices.LoadData().then(function (data) {
            console.log(data.data)
            $scope.gridOptionsList.data = data.data;
            $scope.ParantData = data.data;

            $scope.showLoader = false;
            console.log(data.data)
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.ClearForm = function () {
        $scope.model.USER_ID = 0;
        $scope.model.USER_NAME = "";
        $scope.model.COMPANY_ID = 0;
        $scope.model.UNIT_ID = 0;
        $scope.model.USER_TYPE = '';
        $scope.model.EMPLOYEE_ID = '';
        $scope.model.EMAIL = '';


    }

    $scope.EditData = function (entity) {
        debugger
        $scope.model.USER_ID = entity.USER_ID;
        $scope.model.USER_PASSWORD = entity.USER_PASSWORD;
        $scope.model.USER_NAME = entity.USER_NAME;
        $scope.model.EMAIL = entity.EMAIL;
        $scope.model.EMPLOYEE_ID = entity.EMPLOYEE_ID;
        $scope.model.USER_TYPE = entity.USER_TYPE;

        $scope.SaveData($scope.model);

    }
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'User',
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

    $scope.GetEmployeeData = function () {
        UserServices.GetEmployees($scope.model.COMPANY_ID).then(function (data) {
            $scope.EmployeeData = data.data;
        }, function (error) {
            console.log(error);
        });
    }
    $scope.DataLoad();
    $scope.GetPermissionData();
    $scope.UserTypeDataLoad()
    $scope.CompanyDataLoad();
    $scope.UnitDataLoad(0);
    $scope.GetEmployeeData();
    $scope.CompanyLoad();

    $scope.gridOptionsList.columnDefs = [
        { name: 'SL', field: 'ROW_NO', enableFiltering: false, width: 40 }

        , { name: 'USER_ID', field: 'USER_ID', visible: false }

        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }

        , {
            name: 'USER_NAME', field: 'USER_NAME', displayName: 'User Name', enableFiltering: true, width: '20%'
        }
        , {
            name: 'EMPLOYEE_ID', field: 'EMPLOYEE_ID', displayName: 'Employee Id', enableFiltering: true, width: ' 16%', cellTemplate:
                '<input required="required"  type="text"  ng-model="row.entity.EMPLOYEE_ID"  class="pl-sm" />'
        }
        , { name: 'COMPANY_NAME', field: 'COMPANY_NAME', displayName: 'Company', enableFiltering: true, width: ' 22%' }
        , {
            name: 'USER_TYPE', field: 'USER_TYPE', displayName: 'User Type', enableFiltering: true, visible: false, width: '8%'
        },
        {
            name: 'USER_PASSWORD', field: 'USER_PASSWORD', displayName: 'USER_PASSWORD', enableFiltering: true, width: '15%'
        }
        , {
            name: 'EMAIL', field: 'EMAIL', displayName: 'Email', enableFiltering: true, width: '25%', cellTemplate:
                '<input required="required"  type="text"  ng-model="row.entity.EMAIL"  class="pl-sm" />'
        }
 
        , {
            name: 'Actions', displayName: 'Actions', width: '20%', visible: false, enableFiltering: false, enableColumnMenu: false, cellTemplate:
               '<div style="margin:1px;">' +
               '<button style="margin-bottom: 5px;" ng-show="grid.appScope.model.EDIT_PERMISSION == \'Active\'" ng-click="grid.appScope.EditData(row.entity)" type="button" class="btn btn-outline-primary mb-1">Update</button>' +
             '</div>'
        },

    ];

   


    $scope.SaveData = function (model) {
        debugger
       
        $scope.showLoader = true;
        console.log(model);
        UserServices.AddOrUpdate(model).then(function (data) {

            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.DataLoad();
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
                $scope.DataLoad();

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
                $scope.DataLoad();

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
                    $scope.DataLoad();

                }
                else {
                    $scope.showLoader = false;
                }
            });
        }


    }

}]);

