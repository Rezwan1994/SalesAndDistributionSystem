﻿ngApp.controller('ngGridCtrl', ['$scope', 'InsertOrEditServices', 'AreaInfoServices', 'TerritoryInfoServices', 'permissionProvider', 'notificationservice', 'gridregistrationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, InsertOrEditServices, AreaInfoServices, TerritoryInfoServices, permissionProvider, notificationservice, gridregistrationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = { COMPANY_ID: 0, AREA_ID: 0, AREA_CODE: '', AREA_TERRITORY_MST_STATUS: 'Active', EFFECT_START_DATE: '', EFFECT_END_DATE: '', REMARKS: ''}

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Status = [];
    $scope.Areas = [];
    $scope.AreasList = [];
    $scope.AreasListAll = [];

    $scope.Territorys = [];
    $scope.TerritorysList = [];
    $scope.TerritorysListAll = [];

    $scope.Dtl_Status = [];

    $scope.DefalutData = function () {
        return { COMPANY_ID: 0, AREA_ID: 0, AREA_CODE: '', AREA_TERRITORY_MST_STATUS: 'Active', EFFECT_START_DATE: '', EFFECT_END_DATE: '', REMARKS: '' }
    }

    $scope.GridDefalutData = function () {
        return {
            ROW_NO: 1, COMPANY_ID: 0, TERRITORY_ID: 0, TERRITORY_CODE: '', AREA_TERRITORY_DTL_STATUS: 'Active', EFFECT_START_DATE: '', EFFECT_END_DATE: '', REMARKS: ''
        }
    }

    $scope.gridOptions = (gridregistrationservice.GridRegistration("Area Info"));
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }
    $scope.gridOptions.data = [];
    //Grid Register
    $scope.gridOptions = {
        data: [$scope.GridDefalutData()]
    }

    //Generate New Row No
    $scope.rowNumberGenerate = function () {
        debugger
        for (let i = 0; i < $scope.gridOptions.data.length; i++) {
            debugger
            $scope.gridOptions.data[i].ROW_NO = i;
            if ($scope.gridOptions.data[i].TERRITORY_CODE == '') {
                $scope.gridOptions.data[i].TERRITORY_ID = 0;
                $scope.gridOptions.data[i].TERRITORY_NAME = '';
                $scope.gridOptions.data[i].TERRITORY_NAME_CODE = '';

            }
           
           
        }

    }
    $scope.CheckDateValidation = function (entity) {
        debugger
        if (entity.AREA_TERRITORY_DTL_ID > 0 && entity.ROW_NO == 0) {
            return "true";
        }
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
    //Add New Row

    $scope.addNewRow = () => {
        debugger
        if ($scope.gridOptions.data.length > 0 && $scope.gridOptions.data[0].TERRITORY_CODE != null && $scope.gridOptions.data[0].TERRITORY_CODE != '' && $scope.gridOptions.data[0].TERRITORY_CODE != 'undefined') {
            var result = $scope.CheckDateValidation($scope.gridOptions.data[0]);
            if (result == "true") {
                var newRow = {
                    ROW_NO: 1, COMPANY_ID: $scope.model.COMPANY_ID, AREA_TERRITORY_MST_ID: $scope.gridOptions.data[0].AREA_TERRITORY_MST_ID, AREA_TERRITORY_DTL_ID: $scope.gridOptions.data[0].AREA_TERRITORY_DTL_ID, TERRITORY_ID: $scope.gridOptions.data[0].TERRITORY_ID, TERRITORY_CODE: $scope.gridOptions.data[0].TERRITORY_CODE, AREA_TERRITORY_DTL_STATUS: $scope.gridOptions.data[0].AREA_TERRITORY_DTL_STATUS, EFFECT_START_DATE: $scope.gridOptions.data[0].EFFECT_START_DATE, EFFECT_END_DATE: $scope.gridOptions.data[0].EFFECT_END_DATE, REMARKS: $scope.gridOptions.data[0].REMARKS
                }
                var newRowSelected = {
                    TERRITORY_CODE: $scope.gridOptions.data[0].TERRITORY_CODE
                }
                $scope.TerritorysList.push(newRowSelected);
                $scope.gridOptions.data.push(newRow);
                $scope.gridOptions.data[0] = $scope.GridDefalutData();
            }

        } else {
            notificationservice.Notification("Please Enter Valid Region First", "", 'Only Single Row Left!!');

        }
        $scope.rowNumberGenerate();
    };

    $scope.EditItem = (entity) => {
        debugger
        if ($scope.gridOptions.data.length > 0) {

            var newRow = {
                ROW_NO: 1, COMPANY_ID: $scope.model.COMPANY_ID, AREA_TERRITORY_MST_ID: entity.AREA_TERRITORY_MST_ID, AREA_TERRITORY_DTL_ID: entity.AREA_TERRITORY_DTL_ID, TERRITORY_ID: entity.TERRITORY_ID, TERRITORY_CODE: entity.TERRITORY_CODE, AREA_TERRITORY_DTL_STATUS: entity.AREA_TERRITORY_DTL_STATUS, EFFECT_START_DATE: entity.EFFECT_START_DATE, EFFECT_END_DATE: entity.EFFECT_END_DATE, REMARKS: entity.REMARKS
            }
            $scope.gridOptions.data[0] = newRow;


        } else {
            notificationservice.Notification("Please Select Valid data", "", 'Only Single Row Left!!');

        }
        $scope.rowNumberGenerate();
        $scope.removeItem(entity);
    };
    // Grid one row remove if this mehtod is call
    $scope.removeItem = function (entity) {
        debugger
        if ($scope.gridOptions.data.length > 1) {
            var index = $scope.gridOptions.data.indexOf(entity);
            if ($scope.gridOptions.data.length > 0) {
                $scope.gridOptions.data.splice(index, 1);
            }
            $scope.rowNumberGenerate();
            

        } else {
            notificationservice.Notification("Only Single Row Left!!", "", 'Only Single Row Left!!');
        }

        
    }

    $scope.gridOptions.columnDefs = [
        {
            name: '#', field: 'ROW_NO', enableFiltering: false,  width: '50'
        }
        , {
            name: 'TERRITORY_ID', field: 'TERRITORY_ID', visible: false
        }
        , { name: 'COMPANY_ID', field: 'COMPANY_ID', visible: false }
        , {
            name: 'TERRITORY_NAME', field: 'TERRITORY_NAME', displayName: 'Territory', enableFiltering: false, width: '28%', cellTemplate:
                '<select class="select2-single form-control" data-select2-id="{{row.entity.AREA_ID_GR}}" id="TERRITORY_CODE" ng-disabled="row.entity.ROW_NO !=0"' +
                'name="TERRITORY_CODE" ng-model="row.entity.TERRITORY_CODE" style="width:100%" >' +
                '<option ng-repeat="item in grid.appScope.Territorys" ng-selected="item.TERRITORY_CODE == row.entity.TERRITORY_CODE" value="{{item.TERRITORY_CODE}}">{{ item.TERRITORY_NAME }} | Code: {{ item.TERRITORY_CODE }}</option>' +
                '</select>'
        }
        , {
            name: 'TERRITORY_CODE', field: 'TERRITORY_CODE', displayName: 'Code', enableFiltering: false, visible:false, width: '12%', cellTemplate:
                '<input type="text"  ng-model="row.entity.TERRITORY_CODE" disabled="true"  class="pl-sm" />'
        }
       
        , {
            name: 'EFFECT_START_DATE', field: 'EFFECT_START_DATE', displayName: 'Start', enableFiltering: false, width: '15%', cellTemplate:
                '<div class="simple-date2">'
                + '<div class="input-group date">'
               
                + '<input type="text" class="form-control" ng-disabled="row.entity.ROW_NO !=0" ng-model="row.entity.EFFECT_START_DATE" placeholder="dd/mm/yyyy" id="EFFECT_START_DATE">'
                + '</div>'
                + '</div>'
        }
        , {
            name: 'EFFECT_END_DATE', field: 'EFFECT_END_DATE', displayName: 'End', enableFiltering: false, width: '15%', cellTemplate:
                '<div class="simple-date2">'
                + '<div class="input-group date">'
                + '<input type="text" class="form-control" ng-change="grid.appScope.CheckENDDateValidation(row.entity)" ng-disabled="row.entity.ROW_NO !=0" ng-model="row.entity.EFFECT_END_DATE" placeholder="dd/mm/yyyy"  id="EFFECT_END_DATE">'
                + '</div>'
                + '</div>'
        }
        
        , {
            name: 'REMARKS', field: 'REMARKS', displayName: 'Remark', enableFiltering: false, width: '15%', cellTemplate:
                '<input type="text"  ng-model="row.entity.REMARKS"  class="pl-sm" />'
        }
        , {
            name: 'AREA_TERRITORY_DTL_STATUS', field: 'AREA_TERRITORY_DTL_STATUS', displayName: 'Status', enableFiltering: false, width: '12%', cellTemplate:
                '<select class="form-control" id="AREA_TERRITORY_DTL_STATUS" ng-disabled="row.entity.ROW_NO !=0"'
                +'name="AREA_TERRITORY_DTL_STATUS" ng-model="row.entity.AREA_TERRITORY_DTL_STATUS" style="width:100%">'

                +'<option ng-repeat="item in grid.appScope.Status" value="{{item.STATUS}}" ng-selected="item.STATUS == row.entity.AREA_TERRITORY_DTL_STATUS" >{{ item.STATUS }}</option>'
                +'</select>'
        }
        ,{
            name: 'Action', displayName: 'Action', width: '15%', enableFiltering: false, enableColumnMenu: false, cellTemplate:
                '<div style="margin:1px;">' +
                '<button style="margin-bottom: 5px;" ng-show="row.entity.ROW_NO != 0" ng-click="grid.appScope.EditItem(row.entity)" type="button" class="btn btn-outline-success mb-1"><img src="/img/edit-icon.png" height="15px" ></button>' +

                '<button style="margin-bottom: 5px;"  ng-show="row.entity.ROW_NO == 0" ng-click="grid.appScope.addNewRow()" type="button" class="btn btn-outline-primary mb-1"><img src="/img/plus-icon.png" height="15px" style="border:none" ></button>' +
                '<button style="margin-bottom: 5px;"  ng-show="row.entity.ROW_NO != 0" ng-click="grid.appScope.removeItem(row.entity)" type="button" class="btn btn-outline-danger mb-1"><img src="/img/minus-icon.png" height="15px" ></button>' +
                '</div>'
        },

    ];

    $scope.CompanyLoad = function () {

        InsertOrEditServices.GetCompany().then(function (data) {
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
    $scope.AutoCompleteDataLoadForArea = function (value) {
        if (value.length >= 3) {
            debugger

            return AreaInfoServices.GetSearchableArea($scope.model.COMPANY_ID, value).then(function (data) {
                debugger
                $scope.AreasList = [];
                for (var i = 0; i < data.data.length; i++) {
                    var _area = {
                        AREA_CODE: data.data[i].AREA_CODE,
                        AREA_NAME: data.data[i].AREA_NAME,
                        AREA_ID: data.data[i].AREA_ID,
                        AREA_NAME_CODE: data.data[i].AREA_NAME + ' (' + data.data[i].AREA_CODE + ')',
                    }
                    $scope.AreasList.push(_area);

                }

                return $scope.AreasList;
            }, function (error) {
                alert(error);
                debugger

                console.log(error);
            });
        }
    }

    $scope.SearchableTerritoryLoad = function (value) {
        if (value.length >= 3) {
            debugger

            return TerritoryInfoServices.GetSearchableTerritory($scope.model.COMPANY_ID, value).then(function (data) {
                debugger
                $scope.TerritorysList = [];
                for (var i = 0; i < data.data.length; i++) {
                    var _territory = {
                        TERRITORY_CODE: data.data[i].TERRITORY_CODE,
                        TERRITORY_NAME: data.data[i].TERRITORY_NAME,
                        TERRITORY_ID: data.data[i].TERRITORY_ID,
                        TERRITORY_NAME_CODE: data.data[i].TERRITORY_NAME + ' (' + data.data[i].TERRITORY_CODE + ')',
                    }
                    $scope.TerritorysList.push(_territory);

                }

                return $scope.TerritorysList;
            }, function (error) {
                alert(error);
                debugger

                console.log(error);
            });
        }
    }

    $scope.typeaheadSelectedArea = function () {
        debugger
        const searchIndex = $scope.Areas.findIndex((x) => x.AREA_CODE == $scope.model.AREA_CODE);

        $scope.model.AREA_ID = $scope.Areas[searchIndex].AREA_ID;
        $scope.model.AREA_NAME = $scope.Areas[searchIndex].AREA_NAME;
        $scope.model.AREA_CODE = $scope.Areas[searchIndex].AREA_CODE;

    };

    $scope.typeaheadSelectedTerritory = function (entity, selectedItem) {
        debugger
        entity.TERRITORY_ID = selectedItem.TERRITORY_ID;
         entity.TERRITORY_CODE = selectedItem.TERRITORY_CODE;
          entity.TERRITORY_NAME = selectedItem.TERRITORY_NAME;
        entity.TERRITORY_NAME_CODE = selectedItem.TERRITORY_NAME_CODE;

    };

    
    $scope.AreasLoad = function () {
        
        $scope.showLoader = true;

        InsertOrEditServices.GetExistingArea($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Areas = data.data;

            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.TerritorysLoad = function () {

        $scope.showLoader = true;

        InsertOrEditServices.GetExistingTerritory($scope.model.COMPANY_ID).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Territorys = data.data;

            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompaniesLoad = function () {
        $scope.showLoader = true;

        InsertOrEditServices.GetCompanyList().then(function (data) {
            console.log(data.data)
            $scope.Companies = data.data;
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
        window.location = "/SalesAndDistribution/AreaTerritoryRelation/InsertOrEdit";

    }
    $scope.GetCompanyDisableStatus = function (entity) {
        
        if ($scope.model.USER_TYPE == "SuperAdmin") {
            return false;
        }
        else {
            return true;
        }
    }
    
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        debugger
        $scope.permissionReqModel = {
            Controller_Name: 'AreaTerritoryRelation',
            Action_Name: 'InsertOrEdit'
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

    $(".select2-single-Area").select2({
        placeholder: "Select",
        templateResult: $scope.formatRepo,
        templateSelection: $scope.formatRepoSelection
    });


    $scope.GetPermissionData();
    $scope.CompaniesLoad();
    $scope.CompanyLoad();

    $scope.LoadStatus();
    $scope.AreasLoad();
    $scope.TerritorysLoad();
    // This Method work is Edit Data Loading
    $scope.GetEditDataById = function (value) {
        debugger
        if (value != undefined && value.length > 0) {
            InsertOrEditServices.GetEditDataById(value).then(function (data) {
                debugger
               
                if (data.data != null && data.data.area_Territory_Dtls != null && data.data.area_Territory_Dtls.length > 0) {
                    $scope.model = data.data;
                    if ($scope.model.AREA_TERRITORY_MST_STATUS == null) {
                        $scope.model.AREA_TERRITORY_MST_STATUS = 'Active';
                    }
                    if (data.data.area_Territory_Dtls != null) {
                        $scope.gridOptions.data = data.data.area_Territory_Dtls;

                    }
                    var AreaData = {
                        AREA_CODE: $scope.model.AREA_CODE,
                        AREA_NAME: $scope.model.AREA_NAME,
                        AREA_ID: $scope.model.AREA_ID,
                    }
                    $scope.Areas.push(AreaData);
                    for (var i in $scope.gridOptions.data) {

                        var TerritoryData = {
                            TERRITORY_CODE: $scope.gridOptions.data[i].TERRITORY_CODE,
                            TERRITORY_NAME: $scope.gridOptions.data[i].TERRITORY_NAME,
                            TERRITORY_ID: $scope.gridOptions.data[i].TERRITORY_ID,
                        }
                        $scope.Territorys.push(TerritoryData);
                    }
                    $scope.addNewRow();


                }
                $scope.rowNumberGenerate();
                $scope.showLoader = false;
            }, function (error) {
                alert(error);
                console.log(error);
            });
        }
    }
    $scope.LoadFormData = function () {
        debugger
        $scope.showLoader = true;

        InsertOrEditServices.LoadData($scope.model.COMPANY_ID).then(function (data) {
            debugger
            $scope.showLoader = false;


            for (var i in data.data) {
                debugger
                if (data.data[i].AREA_CODE
                    == $scope.model.AREA_CODE) {
                    debugger
                    $scope.model.AREA_TERRITORY_MST_ID_ENCRYPTED = data.data[i].AREA_TERRITORY_MST_ID_ENCRYPTED;
                    $scope.GetEditDataById($scope.model.AREA_TERRITORY_MST_ID_ENCRYPTED);
                    $scope.addNewRow();
                }
            }
        }, function (error) {
            debugger
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.SaveData = function (model) {
        debugger
        $scope.showLoader = true;
        $scope.model.COMPANY_ID = parseInt($scope.model.COMPANY_ID);
        $scope.gridOptions.data = $scope.gridOptions.data.filter((x) => x.ROW_NO !== 0);
        for (var i in $scope.gridOptions.data) {
            const searchIndex = $scope.Territorys.findIndex((x) => x.TERRITORY_CODE == $scope.gridOptions.data[i].TERRITORY_CODE);
            if (searchIndex != -1) {
                $scope.gridOptions.data[i].TERRITORY_ID = $scope.Territorys[searchIndex].TERRITORY_ID;
                $scope.gridOptions.data[i].TERRITORY_CODE = $scope.Territorys[searchIndex].TERRITORY_CODE;
                $scope.gridOptions.data[i].TERRITORY_NAME = $scope.Territorys[searchIndex].TERRITORY_NAME;

            }
        }


        $scope.model.area_Territory_Dtls = $scope.gridOptions.data;

        InsertOrEditServices.AddOrUpdate(model).then(function (data) {
            notificationservice.Notification(data.data, 1, 'Data Save Successfully !!');
            if (data.data == 1) {
                $scope.showLoader = false;
                $scope.LoadFormData();

            }
            else {
                $scope.showLoader = false;
                $scope.addNewRow();

            }
        });
    }

}]);

