﻿ngApp.service("ProductReportServices", function ($http) {
    
    this.LoadData = function (companyId) {
        return $http.post('/SalesAndDistribution/Report/LoadData', { COMPANY_ID: parseInt(companyId) });
    }

    this.LoadBrand = function (companyId) {
        return $http.post('/SalesAndDistribution/Brand/LoadData', { COMPANY_ID: parseInt(companyId) });
    }

    this.LoadCategory = function (companyId) {
        return $http.post('/SalesAndDistribution/Category/LoadData', { COMPANY_ID: parseInt(companyId) });
    }

    this.GetCompany = function () {
        return $http.get('/SalesAndDistribution/Product/GetCompany');
    }


    this.LoadCompanyUnitData = function (companyId) {
        return $http.get('/Security/Company/LoadUnitData', { COMPANY_ID: parseInt(companyId) });
    }


    this.GetCompanyList = function () {
        return $http.get('/Security/Company/LoadData');
    }
    this.LoadGroupData = function (companyId) {
        return $http.post('/SalesAndDistribution/Group/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
    this.LoadPackSizeData = function (companyId) {
        return $http.post('/SalesAndDistribution/PackSize/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
    this.LoadPrimaryProductData = function (companyId) {
        return $http.post('/SalesAndDistribution/PrimaryProduct/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
    this.LoadBaseProductData = function (companyId) {
        return $http.post('/SalesAndDistribution/BaseProduct/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
  
    this.LoadProductSeasonData = function (companyId) {
        return $http.post('/SalesAndDistribution/ProductSeason/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
    this.LoadProductTypeData = function (companyId) {
        return $http.post('/SalesAndDistribution/ProductType/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
    this.LoadStorageData = function (companyId) {
        return $http.post('/SalesAndDistribution/Storage/LoadData', { COMPANY_ID: parseInt(companyId) });
    }

    this.IsReportPermitted = function (reportId) {
        return $http.post('/SalesAndDistribution/Report/IsReportPermitted', { REPORT_ID: parseInt(reportId) });
    }

});