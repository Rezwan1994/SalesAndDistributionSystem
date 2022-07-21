﻿ngApp.service("CustomerInfoServices", function ($http) {
    
    this.LoadData = function (companyId) {
        return $http.post('/SalesAndDistribution/Customer/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
    this.GetCompany = function () {
        return $http.get('/SalesAndDistribution/Customer/GetCompany');
    }

    this.GenerateCustomerCode = function (comp_id) {
        return $http.post('/SalesAndDistribution/Customer/GenerateCustomerCode', { COMPANY_ID: parseInt(comp_id) });
    }
    

    this.AddOrUpdate = function (model) {
        debugger
        var dataType = 'application/json; charset=utf-8';
        return $http({
            type: 'POST',
            method: 'POST',
            url: "/SalesAndDistribution/Customer/AddOrUpdate",
            dataType: 'json',
            contentType: dataType,
            data: JSON.stringify(model),
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
       
    }
   
    this.GetCompanyList = function () {
        return $http.get('/Security/Company/LoadData');
    }
    this.LoadPriceTypeData = function (companyId) {
        return $http.post('/SalesAndDistribution/PriceType/LoadData', { COMPANY_ID: parseInt(companyId) });
    }
  
    this.LoadCustomerTypeData = function (companyId) {
        return $http.post('/SalesAndDistribution/CustomerType/LoadData', { COMPANY_ID: parseInt(companyId) });

    }
    this.LoadUnitData = function (companyId) {
        return $http.get('/Security/Company/LoadUnitData', { COMPANY_ID: parseInt(companyId) });
    }
    this.GetSearchableCustomer = function (comp_id, Customer) {
        return $http.post('/SalesAndDistribution/Customer/GetSearchableCustomer', { COMPANY_ID: parseInt(comp_id), CUSTOMER_NAME: Customer });
    }
});