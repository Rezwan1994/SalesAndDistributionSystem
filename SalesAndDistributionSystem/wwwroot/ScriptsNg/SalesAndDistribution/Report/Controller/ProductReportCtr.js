ngApp.controller('ngGridCtrl', ['$scope', 'ProductReportServices', 'permissionProvider', 'notificationservice', '$http', '$log', '$filter', '$timeout', '$interval', '$q', function ($scope, ProductReportServices, permissionProvider, notificationservice, $http, $log, $filter, $timeout, $interval, $q) {

    'use strict'
    $scope.model = {
        COMPANY_ID: 0, PRODUCT_SEASON_ID: '', PRODUCT_TYPE_ID: '', PRIMARY_PRODUCT_ID: '', UNIT_ID: '', BASE_PRODUCT_ID: '', CATEGORY_ID: '', BRAND_ID:''
    }

    $scope.getPermissions = [];
    $scope.Companies = [];
    $scope.Brands = [];
    $scope.ReportData = [];
    $scope.Category = [];
    $scope.Companies = [];
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
    $scope.CompaniesLoad = function () {
        $scope.showLoader = true;
        ProductReportServices.GetCompanyList().then(function (data) {
            console.log(data.data)
            $scope.Companies = data.data;
            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
    $scope.CompanyLoad = function () {
        $scope.showLoader = true;

        ProductReportServices.GetCompany().then(function (data) {
            console.log(data.data)
            $scope.model.COMPANY_ID = parseFloat(data.data);
            $interval(function () {
                $scope.LoadCOMPANY_ID();
            }, 800, 2);
            $scope.showLoader = false;
        }, function (error) {
            $scope.showLoader = false;

        });
    }

    $scope.DataLoad = function (companyId) {
        
        $scope.showLoader = true;

        ProductReportServices.LoadData(companyId).then(function (data) {
            console.log(data.data)
            $scope.ReportData = data.data;
            $scope.showLoader = false;
            $scope.model.COMPANY_SEARCH_ID = companyId;
            $scope.model.ReportColor = "color";

            $interval(function () {
                $scope.LoadCOMPANY_ID();
            }, 800, 2);
        }, function (error) {
            $scope.showLoader = false;

        });
    }

    $scope.GetBrandData = function () {
        $scope.showLoader = true;
        var companyId = 0;
        ProductReportServices.LoadBrand(companyId).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Brands = data.data;
            var _brand = {
                BRAND_ID: "",
                BRAND_NAME: "All",
            }
            $scope.Brands.push(_brand);
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }

    $scope.GetCategoryData = function () {
        $scope.showLoader = true;
        var companyId = 0;
        ProductReportServices.LoadCategory(companyId).then(function (data) {
            debugger
            console.log(data.data)
            $scope.Category = data.data;
            var _category = {
                CATEGORY_ID: "",
                CATEGORY_NAME: "All",
            }
            $scope.Category.push(_category);
            $scope.showLoader = false;
        }, function (error) {
            alert(error);
            console.log(error);
            $scope.showLoader = false;

        });
    }
  
    $scope.LoadCompanyUnitData = function () {
        $scope.showLoader = true;

        ProductReportServices.LoadCompanyUnitData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.CompanyUnit = data.data.filter(function (element) { return element.COMPANY_ID == $scope.model.COMPANY_ID });
            var _unit = {
                UNIT_ID: "",
                UNIT_NAME: "All",
            }
            $scope.CompanyUnit.push(_unit);

            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });
    }
   
    $scope.LoadGroupData = function () {
        $scope.showLoader = true;

        ProductReportServices.LoadGroupData($scope.model.COMPANY_ID).then(function (data) {
            console.log(data.data)
            $scope.Group = data.data;
            var _Group = {
                GROUP_ID: "",
                GROUP_NAME: "All",
            }
            $scope.Group.push(_Group);
            $scope.showLoader = false;
        }, function (error) {
            $scope.showLoader = false;

        });
    }
   
    $scope.LoadPrimaryProductData = function () {
        $scope.showLoader = true;

        ProductReportServices.LoadPrimaryProductData($scope.model.COMPANY_ID).then(function (data) {
            $scope.PrimaryProduct = data.data;
            var _PrimaryProduct = {
                PRIMARY_PRODUCT_ID: "",
                PRIMARY_PRODUCT_NAME: "All",
            }
            $scope.PrimaryProduct.push(_PrimaryProduct);
            $scope.showLoader = false;
        }, function (error) {
            $scope.showLoader = false;

        });
    }
    $scope.LoadBaseProductData = function () {
        $scope.showLoader = true;

        ProductReportServices.LoadBaseProductData($scope.model.COMPANY_ID).then(function (data) {
            $scope.BaseProduct = data.data;
            var _BaseProduct = {
                BASE_PRODUCT_ID: "",
                BASE_PRODUCT_NAME: "All",
            }
            $scope.BaseProduct.push(_BaseProduct);
            $scope.showLoader = false;
        }, function (error) {
            $scope.showLoader = false;

        });
    }

    $scope.LoadProductSeasonData = function () {
        $scope.showLoader = true;

        ProductReportServices.LoadProductSeasonData($scope.model.COMPANY_ID).then(function (data) {
            $scope.ProductSeason = data.data;
            var _ProductSeason = {
                PRODUCT_SEASON_ID: "",
                PRODUCT_SEASON_NAME: "All",
            }
            $scope.ProductSeason.push(_ProductSeason);
            $scope.showLoader = false;
        }, function (error) {
            $scope.showLoader = false;

        });
    }
    $scope.LoadProductTypeData = function () {
        $scope.showLoader = true;

        ProductReportServices.LoadProductTypeData($scope.model.COMPANY_ID).then(function (data) {
            $scope.ProductType = data.data;
            var _ProductType = {
                PRODUCT_TYPE_ID: "",
                PRODUCT_TYPE_NAME: "All",
            }
            $scope.ProductType.push(_ProductType);
            $scope.showLoader = false;
        }, function (error) {
            $scope.showLoader = false;

        });
    }
    
   
    $scope.GetPermissionData = function () {
        $scope.showLoader = true;
        $scope.permissionReqModel = {
            Controller_Name: 'Report',
            Action_Name: 'ProductReport'
        }
        permissionProvider.GetPermission($scope.permissionReqModel).then(function (data) {
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
            $scope.showLoader = false;

        });
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
  
    $scope.LoadCOMPANY_ID = function () {
        $('#COMPANY_ID').trigger('change');
    }
   
    $scope.LoadReportParamters = function (reportId, id_serial) {
        $scope.showLoader = true;
        debugger
        ProductReportServices.IsReportPermitted(reportId).then(function (data) {
            $scope.model.CSV_PERMISSION = data.data.CSV_PERMISSION;
            $scope.model.PREVIEW_PERMISSION = data.data.PREVIEW_PERMISSION;
            $scope.model.PDF_PERMISSION = data.data.PDF_PERMISSION;

            var _id = 'selection[' + id_serial + ']';
            var _id_selected = 'ReportIdEncrypt[' + id_serial + ']';

            debugger
            let checkboxes = document.getElementsByClassName('checkbox-inline');
            for (var i = 0; i < checkboxes.length; i++) {
                let checkbox = document.getElementById(checkboxes[i].id);
                checkbox.checked = false;
            }
            let checkbox = document.getElementById(_id);
            $scope.model.reportIdEncryptedSelected = document.getElementById(_id_selected).value;
            checkbox.checked = true;
            if (reportId == 1) {
              
                company_param
                document.getElementById("brand_param").style.display = "block";
                document.getElementById("category_param").style.display = "block";
                document.getElementById("base_product_param").style.display = "block";
                document.getElementById("primary_product_param").style.display = "block";
                document.getElementById("group_param").style.display = "block";
                document.getElementById("product_season_param").style.display = "block";
                document.getElementById("product_type_param").style.display = "block";


            } else if (reportId == 2) {
                document.getElementById("brand_param").style.display = "none";
                document.getElementById("category_param").style.display = "none";
                document.getElementById("base_product_param").style.display = "none";
                document.getElementById("primary_product_param").style.display = "none";
                document.getElementById("group_param").style.display = "none";
                document.getElementById("product_season_param").style.display = "none";
                document.getElementById("product_type_param").style.display = "none";

            }
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

            $scope.showLoader = false;
        }, function (error) {
            console.log(error);
            $scope.showLoader = false;

        });


        
    }
    
    $scope.DataLoad($scope.model.COMPANY_ID);
    $scope.CompaniesLoad();
    $scope.CompanyLoad();
    $scope.GetPermissionData();
    $scope.LoadCompanyUnitData();
    $scope.GetBrandData();
    $scope.GetCategoryData();
    $scope.LoadBaseProductData();
    $scope.LoadGroupData();
    $scope.LoadPrimaryProductData();
    $scope.LoadProductSeasonData();
    $scope.LoadProductTypeData();
    $scope.GetPdfView = function () {
        debugger
        var color = $scope.model.ReportColor;
        var IsLogoApplicable = $scope.model.IsLogoApplicable;
        var IsCompanyApplicable = $scope.model.IsCompanyApplicable;
        var href = "/SalesAndDistribution/Report/CreatePDF?ReportId=" + $scope.model.reportIdEncryptedSelected + "&Color=" + color + "&IsLogoApplicable=" + IsLogoApplicable + "&IsCompanyApplicable=" + IsCompanyApplicable + "&BRAND_ID=" + $scope.model.BRAND_ID + "&CATEGORY_ID=" + $scope.model.CATEGORY_ID + "&PRIMARY_PRODUCT_ID=" + $scope.model.PRIMARY_PRODUCT_ID + "&BASE_PRODUCT_ID=" + $scope.model.BASE_PRODUCT_ID + "&PRODUCT_TYPE_ID=" + $scope.model.PRODUCT_TYPE_ID + "&UNIT_ID=" + $scope.model.UNIT_ID + "&PRODUCT_SEASON_ID=" + $scope.model.PRODUCT_SEASON_ID + "&GROUP_ID=" + $scope.model.GROUP_ID;
        window.open(href, '_blank');
    }
    $scope.GetPreview = function () {
        debugger
        var color = $scope.model.ReportColor;
        var IsLogoApplicable = $scope.model.IsLogoApplicable;
        var IsCompanyApplicable = $scope.model.IsCompanyApplicable;
        var href = "/SalesAndDistribution/Report/ReportPreview?ReportId=" + $scope.model.reportIdEncryptedSelected + "&Color=" + color + "&IsLogoApplicable=" + IsLogoApplicable + "&IsCompanyApplicable=" + IsCompanyApplicable;
        window.open(href, '_blank');
    }

    $scope.GetExcel = function () {
        var href = "/SalesAndDistribution/Report/ReportExcel?ReportId=" + $scope.model.reportIdEncryptedSelected;
        window.open(href, '_blank');
    }
    $scope.triggerChange = function (element) {
        let changeEvent = new Event('change');
        element.dispatchEvent(changeEvent);
    }

}]);

