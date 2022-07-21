using Microsoft.Extensions.Configuration;
using SalesAndDistributionSystem.Domain.Common;
using SalesAndDistributionSystem.Domain.Models.Entities.SalesAndDistribution;
using SalesAndDistributionSystem.Services.Business.SalesAndDistribution.IManager;
using SalesAndDistributionSystem.Services.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.SalesAndDistribution.Manager
{
    public class CustomerPriceInfoManager:ICustomerPriceInfoManager
    {
        private readonly ICommonServices _commonServices;
        private readonly IConfiguration _configuration;
        public CustomerPriceInfoManager(ICommonServices commonServices, IConfiguration configuration)
        {
            _commonServices = commonServices;
            _configuration = configuration;

        }

        string AddOrUpdate_AddQuery() => @"INSERT INTO CUSTOMER_SKU_PRICE_MST 
                                         (CUSTOMER_PRICE_MSTID
                                            ,CUSTOMER_CODE
                                            ,CUSTOMER_ID
                                            ,ENTRY_DATE
                                            ,EFFECT_START_DATE
                                            ,EFFECT_END_DATE
                                            ,COMPANY_ID
                                            ,UNIT_ID
                                            ,STATUS
                                            ,REMARKS
                                            ,ENTERED_BY
                                            ,ENTERED_DATE
                                            ,ENTERED_TERMINAL
                                            ) 
                                          VALUES ( :param1, :param2, :param3, TO_DATE(:param4, 'DD/MM/YYYY HH:MI:SS'),TO_DATE(:param5, 'DD/MM/YYYY HH:MI:SS'),TO_DATE( :param6, 'DD/MM/YYYY HH:MI:SS'), :param7, :param8, :param9, :param10, :param11,TO_DATE(:param12, 'DD/MM/YYYY HH:MI:SS'), :param13)";       
        string AddOrUpdate_AddQueryDTL() => @"INSERT INTO CUSTOMER_SKU_PRICE_DTL 
                    (CUSTOMER_PRICE_DTLID,
                    CUSTOMER_PRICE_MSTID,
                    SKU_ID,
                    SKU_CODE,
                    GROUP_ID,
                    CATEGORY_ID,
                    BRAND_ID,
                    BASE_PRODUCT_ID,
                    PRICE_FLAG,
                    SKU_PRICE,
                    COMMISSION_FLAG,
                    COMMISSION_TYPE,
                    COMMISSION_VALUE,
                    ADD_COMMISSION1,
                    ADD_COMMISSION2,
                    STATUS,
                    COMPANY_ID,
                    UNIT_ID,
                    ENTERED_BY,
                    ENTERED_DATE,
                    ENTERED_TERMINAL
                   ) 
                    VALUES ( :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10, :param11, :param12, :param13, :param14, :param15, :param16,
                    :param17, :param18, :param19,TO_DATE(:param20, 'DD/MM/YYYY HH:MI:SS'), :param21)";

        string LoadSKUPriceDtlData_Query() => @"Select
                                                CUSTOMER_PRICE_DTLID,
                                                CUSTOMER_PRICE_MSTID,
                                                SKU_ID,
                                                SKU_CODE,
                                                GROUP_ID,
                                                CATEGORY_ID,
                                                BRAND_ID,
                                                BASE_PRODUCT_ID,
                                                PRICE_FLAG,
                                                SKU_PRICE,
                                                COMMISSION_FLAG,
                                                COMMISSION_TYPE,
                                                COMMISSION_VALUE,
                                                ADD_COMMISSION1,
                                                ADD_COMMISSION2,
                                                STATUS,
                                                COMPANY_ID,
                                                UNIT_ID,
                                                ENTERED_BY,
                                                ENTERED_DATE,
                                                ENTERED_TERMINAL,
                                                UPDATED_BY,
                                                UPDATED_DATE,
                                                UPDATED_TERMINAL

                                               from Customer_Sku_Price_Mst 
                                                Where COMPANY_ID = :param1";

        string LoadSKUPriceMstData_Query() => @"CUSTOMER_PRICE_MSTID
                                                CUSTOMER_CODE,
                                                CUSTOMER_ID,
                                                ENTRY_DATE,
                                                EFFECT_START_DATE,
                                                EFFECT_END_DATE,
                                                COMPANY_ID,
                                                UNIT_ID,
                                                STATUS,
                                                REMARKS,
                                                ENTERED_BY,
                                                ENTERED_DATE,
                                                ENTERED_TERMINAL,
                                                UPDATED_BY,
                                                UPDATED_DATE,
                                                UPDATED_TERMINAL

                                               from CUSTOMER 
                                                Where COMPANY_ID = :param1";

        string LoadCustomerExistingSku_Query() => @"select SKU_ID from CUSTOMER_SKU_PRICE_DTL cusDtl
                            left join CUSTOMER_SKU_PRICE_MST cusMst on CUSMST.CUSTOMER_PRICE_MSTID = cusDtl.CUSTOMER_PRICE_MSTID
                            where CUSMST.COMPANY_ID = :param1   and CUSMST.CUSTOMER_ID = :param2
                            group by SKU_ID";
        string LoadMasterData_Query() => @"select * from customer_sku_price_mst
                            where  COMPANY_ID = :param1"; 
        string LoadData_DetailByMasterId_Query() => @"  SELECT ROW_NUMBER() OVER(ORDER BY M.CUSTOMER_PRICE_DTLID ASC) AS ROW_NO,M.*,PI.SKU_NAME,PI.PACK_SIZE
                                          FROM Customer_Sku_Price_Dtl  M
                                          left join Product_Info pi on PI.SKU_CODE = M.SKU_CODE
                                          Where M.CUSTOMER_PRICE_MSTID = :param1";

        string LoadData_MasterById_Query() => @"
            SELECT ROW_NUMBER() OVER(ORDER BY M.CUSTOMER_PRICE_MSTID ASC) AS ROW_NO,M.CUSTOMER_PRICE_MSTID
                                            ,M.CUSTOMER_CODE
                                            ,M.CUSTOMER_ID
                                            ,M.ENTRY_DATE
                                            ,TO_CHAR(M.EFFECT_START_DATE, 'DD/MM/YYYY') EFFECT_START_DATE
                                            ,TO_CHAR(M.EFFECT_END_DATE, 'DD/MM/YYYY') EFFECT_END_DATE
                                            ,M.COMPANY_ID
                                            ,M.UNIT_ID
                                            ,M.STATUS
                                            ,M.REMARKS
                                            ,M.ENTERED_BY
                                            ,M.ENTERED_DATE
                                            ,M.ENTERED_TERMINAL                   
            FROM customer_sku_price_mst  M 
            where Customer_Price_MstId = :param1";

        string AddOrUpdate_UpdateQuery() => @"UPDATE CUSTOMER_SKU_PRICE_MST SET  
                                                    CUSTOMER_CODE= :param2,
                                                    CUSTOMER_ID= :param3,
                                                    ENTRY_DATE= TO_DATE(:param4, 'DD/MM/YYYY HH:MI:SS'),
                                                    EFFECT_START_DATE= TO_DATE(:param5, 'DD/MM/YYYY HH:MI:SS'),
                                                    EFFECT_END_DATE= TO_DATE(:param6, 'DD/MM/YYYY HH:MI:SS'),
                                                    COMPANY_ID= :param7,
                                                    UNIT_ID= :param8,
                                                    STATUS= :param9,
                                                    REMARKS= :param10,
                                                    UPDATED_BY= :param11,
                                                    UPDATED_DATE= TO_DATE(:param12, 'DD/MM/YYYY HH:MI:SS'),
                                                    UPDATED_TERMINAL= :param13
                                                WHERE CUSTOMER_PRICE_MSTID = :param1"; 

        string AddOrUpdate_UpdateQueryDTL() => @"UPDATE CUSTOMER_SKU_PRICE_DTL SET  
                                                CUSTOMER_PRICE_MSTID = :param2,
                                                SKU_ID = :param3,
                                                SKU_CODE = :param4,
                                                GROUP_ID = :param5,
                                                CATEGORY_ID = :param6,
                                                BRAND_ID = :param7,
                                                BASE_PRODUCT_ID = :param8,
                                                PRICE_FLAG = :param9,
                                                SKU_PRICE = :param10,
                                                COMMISSION_FLAG = :param11,
                                                COMMISSION_TYPE = :param12,
                                                COMMISSION_VALUE = :param13,
                                                ADD_COMMISSION1 = :param14,
                                                ADD_COMMISSION2 = :param15,
                                                STATUS = :param16,
                                                COMPANY_ID = :param17,
                                                UNIT_ID = :param18,
                                                UPDATED_BY = :param19,
                                                UPDATED_DATE = TO_DATE(:param20, 'DD/MM/YYYY HH:MI:SS'),
                                                UPDATED_TERMINAL  = :param21
                                                WHERE CUSTOMER_PRICE_DTLID = :param1"; 

        string GetCustomerPrice_Info_IdQuery() => "SELECT NVL(MAX(CUSTOMER_PRICE_MSTID),0) + 1 SKU_ID  FROM CUSTOMER_SKU_PRICE_MST";
        string GetCustomerPrice_Info_IdQuery_Dtl() => "SELECT NVL(MAX(CUSTOMER_PRICE_DTLID),0) + 1 SKU_ID  FROM CUSTOMER_SKU_PRICE_DTL";
        public async Task<string> AddOrUpdate(string db, Customer_SKU_Price_Mst model)
        {
            if (model == null)
            {
                return "No data provided to insert!!!!";

            }
            else
            {
                List<QueryPattern> listOfQuery = new List<QueryPattern>();
                try
                {

                    int dtlId = 0;
                    if (model.CUSTOMER_PRICE_MSTID == 0)
                    {

                        model.CUSTOMER_PRICE_MSTID = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetCustomerPrice_Info_IdQuery(), _commonServices.AddParameter(new string[] { }));

                        listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_AddQuery(),
                         _commonServices.AddParameter(new string[] {model.CUSTOMER_PRICE_MSTID.ToString(),
                             model.CUSTOMER_CODE, model.CUSTOMER_ID.ToString(),model.ENTRY_DATE,
                             model.EFFECT_START_DATE.ToString(), model.EFFECT_END_DATE, model.COMPANY_ID.ToString(), model.UNIT_ID.ToString(),
                             model.CUSTOMER_STATUS, model.REMARKS, model.ENTERED_BY,
                             model.ENTERED_DATE,  model.ENTERED_TERMINAL
                            })));

                        if(model.customerSkuPriceList != null && model.customerSkuPriceList.Count > 0)
                        {
                            dtlId  = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetCustomerPrice_Info_IdQuery_Dtl(), _commonServices.AddParameter(new string[] { }));
                            foreach (var item in model.customerSkuPriceList)
                            {
                              
                                
                                listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_AddQueryDTL(),
                               _commonServices.AddParameter(new string[] { dtlId.ToString(),model.CUSTOMER_PRICE_MSTID.ToString(),
                                     item.SKU_ID.ToString(),item.SKU_CODE,
                                     item.GROUP_ID.ToString(), item.CATEGORY_ID.ToString(), item.BRAND_ID.ToString(), item.BASE_PRODUCT_ID.ToString(),
                                     item.PRICE_FLAG, item.SKU_PRICE.ToString(), item.COMMISSION_FLAG,
                                     item.COMMISSION_TYPE,  item.COMMISSION_VALUE.ToString(),  item.ADD_COMMISSION1.ToString(),  item.ADD_COMMISSION2.ToString(),  item.STATUS
                                     ,  item.COMPANY_ID.ToString(),  item.UNIT_ID.ToString(),  item.ENTERED_BY,  item.ENTERED_DATE.ToString(),  item.ENTERED_TERMINAL
                                  })));
                                dtlId++;
                            }
                        }

                    }
                    else
                    {

                        listOfQuery.Add(_commonServices.AddQuery(
                            AddOrUpdate_UpdateQuery(),
                            _commonServices.AddParameter(new string[] { model.CUSTOMER_PRICE_MSTID.ToString(),
                             model.CUSTOMER_CODE, model.CUSTOMER_ID.ToString(),model.ENTRY_DATE.ToString(),
                             model.EFFECT_START_DATE.ToString(), model.EFFECT_END_DATE.ToString(), model.COMPANY_ID.ToString(), model.UNIT_ID.ToString(),
                             model.CUSTOMER_STATUS.ToString(), model.REMARKS.ToString(),
                             model.UPDATED_BY.ToString(), model.UPDATED_DATE.ToString(),
                             model.UPDATED_TERMINAL.ToString()})));
                            foreach (var item in model.customerSkuPriceList)
                            {
                                if (item.CUSTOMER_PRICE_DTLID == 0)
                                {
                                    //-------------Add new row on detail table--------------------

                                    dtlId = dtlId == 0 ? _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetCustomerPrice_Info_IdQuery_Dtl(), _commonServices.AddParameter(new string[] { })) : (dtlId + 1);

                                    listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_AddQueryDTL(), _commonServices.AddParameter(new string[] {dtlId.ToString(),model.CUSTOMER_PRICE_MSTID.ToString(),
                                         item.SKU_ID.ToString(),item.SKU_CODE,
                                         item.GROUP_ID.ToString(), item.CATEGORY_ID.ToString(), item.BRAND_ID.ToString(), item.BASE_PRODUCT_ID.ToString(),
                                         item.PRICE_FLAG, item.SKU_PRICE.ToString(), item.COMMISSION_FLAG,
                                         item.COMMISSION_TYPE,  item.COMMISSION_VALUE.ToString(),  item.ADD_COMMISSION1.ToString(),  item.ADD_COMMISSION2.ToString(),  item.STATUS
                                         ,  item.COMPANY_ID.ToString(),  item.UNIT_ID.ToString(),  item.ENTERED_BY,  item.ENTERED_DATE.ToString(),  item.ENTERED_TERMINAL })));

                                }
                                else
                                {
                                    //-------------Edit on detail table--------------------

                                    listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_UpdateQueryDTL(), _commonServices.AddParameter(new string[] { item.CUSTOMER_PRICE_DTLID.ToString(),model.CUSTOMER_PRICE_MSTID.ToString(),
                                         item.SKU_ID.ToString(),item.SKU_CODE,
                                         item.GROUP_ID.ToString(), item.CATEGORY_ID.ToString(), item.BRAND_ID.ToString(), item.BASE_PRODUCT_ID.ToString(),
                                         item.PRICE_FLAG, item.SKU_PRICE.ToString(), item.COMMISSION_FLAG,
                                         item.COMMISSION_TYPE,  item.COMMISSION_VALUE.ToString(),  item.ADD_COMMISSION1.ToString(),  item.ADD_COMMISSION2.ToString(),  item.STATUS
                                         ,item.COMPANY_ID.ToString(),  item.UNIT_ID.ToString(),item.UPDATED_BY,item.UPDATED_DATE,item.UPDATED_TERMINAL })));

                                }

                            }

                    }

                    await _commonServices.SaveChangesAsyn(_configuration.GetConnectionString(db), listOfQuery);
                    return "1";
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
        }

        public async Task<string> LoadSKUPriceDtlData(string db, int Company_Id) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadSKUPriceDtlData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString()})));
        public async Task<string> LoadSKUPriceMstData(string db, int Company_Id) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadSKUPriceMstData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString() })));
        public async Task<string> GetCustomerExistingSKUData(string db, int Company_Id, int Customer_Id) { 
            var dt = _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadCustomerExistingSku_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString(), Customer_Id.ToString() })));
            return dt;
        }
   
    
        public async Task<string> LoadData_Master(string db, int Company_Id)
        {
            List<Customer_SKU_Price_Mst> Customer_SKU_Price_Mstt_list = new List<Customer_SKU_Price_Mst>();
            DataTable data = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadMasterData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString() }));
            for (int i = 0; i < data.Rows.Count; i++)
            {
                Customer_SKU_Price_Mst customer_SKU_Price_Mst = new Customer_SKU_Price_Mst();
                customer_SKU_Price_Mst.CUSTOMER_PRICE_MSTID = Convert.ToInt32(data.Rows[i]["CUSTOMER_PRICE_MSTID"]);
                customer_SKU_Price_Mst.CUSTOMER_PRICE_MSTID_ENCRYPTED = _commonServices.Encrypt(data.Rows[i]["CUSTOMER_PRICE_MSTID"].ToString());

                customer_SKU_Price_Mst.COMPANY_ID = Convert.ToInt32(data.Rows[i]["COMPANY_ID"]);
                customer_SKU_Price_Mst.CUSTOMER_ID = data.Rows[i]["CUSTOMER_ID"].ToString();


                customer_SKU_Price_Mst.EFFECT_END_DATE = data.Rows[i]["EFFECT_END_DATE"].ToString();
                customer_SKU_Price_Mst.EFFECT_START_DATE = data.Rows[i]["EFFECT_START_DATE"].ToString();
                customer_SKU_Price_Mst.REMARKS = data.Rows[i]["REMARKS"].ToString();
                Customer_SKU_Price_Mstt_list.Add(customer_SKU_Price_Mst);
            }
            return JsonSerializer.Serialize(Customer_SKU_Price_Mstt_list);
        }

        public async Task<Customer_SKU_Price_Mst> LoadDetailData_ByMasterId_List(string db, int Id)
        {
            Customer_SKU_Price_Mst _Customer_Mst = new Customer_SKU_Price_Mst();

            DataTable dataTable = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadData_MasterById_Query(), _commonServices.AddParameter(new string[] { Id.ToString() }));
            if (dataTable.Rows.Count > 0)
            {
                _Customer_Mst.COMPANY_ID = Convert.ToInt32(dataTable.Rows[0]["COMPANY_ID"]);
                _Customer_Mst.CUSTOMER_PRICE_MSTID = Id;
                _Customer_Mst.CUSTOMER_ID = dataTable.Rows[0]["CUSTOMER_ID"].ToString();
                _Customer_Mst.CUSTOMER_CODE = dataTable.Rows[0]["CUSTOMER_CODE"].ToString();
                _Customer_Mst.EFFECT_START_DATE = dataTable.Rows[0]["EFFECT_START_DATE"].ToString();
                _Customer_Mst.EFFECT_END_DATE = dataTable.Rows[0]["EFFECT_END_DATE"].ToString();
                _Customer_Mst.REMARKS = dataTable.Rows[0]["REMARKS"].ToString();
                _Customer_Mst.UNIT_ID = Convert.ToInt32(dataTable.Rows[0]["UNIT_ID"]);
                _Customer_Mst.CUSTOMER_STATUS = dataTable.Rows[0]["CUSTOMER_STATUS"].ToString();
                _Customer_Mst.ROW_NO = Convert.ToInt32(dataTable.Rows[0]["ROW_NO"].ToString());

                DataTable dataTable_detail = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadData_DetailByMasterId_Query(), _commonServices.AddParameter(new string[] { Id.ToString() }));

                _Customer_Mst.customerSkuPriceList = new List<Customer_SKU_Price_Dtl>();

                for (int i = 0; i < dataTable_detail.Rows.Count; i++)
                {
                    Customer_SKU_Price_Dtl _Cus_Dtl = new Customer_SKU_Price_Dtl();

                    _Cus_Dtl.COMPANY_ID = Convert.ToInt32(dataTable_detail.Rows[i]["COMPANY_ID"]);
                    _Cus_Dtl.ADD_COMMISSION1 = Convert.ToInt32(dataTable_detail.Rows[i]["ADD_COMMISSION1"]);
                    _Cus_Dtl.ADD_COMMISSION2 = Convert.ToInt32(dataTable_detail.Rows[i]["ADD_COMMISSION2"]);

                    _Cus_Dtl.BASE_PRODUCT_ID = Convert.ToInt32(dataTable_detail.Rows[i]["BASE_PRODUCT_ID"]);
                    _Cus_Dtl.BRAND_ID = Convert.ToInt32(dataTable_detail.Rows[i]["BRAND_ID"]);
                    _Cus_Dtl.CATEGORY_ID = Convert.ToInt32(dataTable_detail.Rows[i]["CATEGORY_ID"]);
                    _Cus_Dtl.COMMISSION_FLAG = dataTable_detail.Rows[i]["COMMISSION_FLAG"].ToString();
                    _Cus_Dtl.COMMISSION_TYPE = dataTable_detail.Rows[i]["COMMISSION_TYPE"].ToString();
                    _Cus_Dtl.COMMISSION_VALUE = Convert.ToInt32(dataTable_detail.Rows[i]["COMMISSION_VALUE"]);
                    _Cus_Dtl.CUSTOMER_PRICE_DTLID = Convert.ToInt32(dataTable_detail.Rows[i]["CUSTOMER_PRICE_DTLID"]);
                    _Cus_Dtl.CUSTOMER_PRICE_MSTID = Convert.ToInt32(dataTable_detail.Rows[i]["CUSTOMER_PRICE_MSTID"]);
                    _Cus_Dtl.ENTERED_BY = dataTable_detail.Rows[i]["ENTERED_BY"].ToString();
                    _Cus_Dtl.ENTERED_DATE = dataTable_detail.Rows[i]["ENTERED_DATE"].ToString();
                    _Cus_Dtl.GROUP_ID = Convert.ToInt32(dataTable_detail.Rows[i]["GROUP_ID"]);
                    _Cus_Dtl.PRICE_FLAG = dataTable_detail.Rows[i]["PRICE_FLAG"].ToString();
                    _Cus_Dtl.SKU_NAME = dataTable_detail.Rows[i]["SKU_NAME"].ToString();
                    _Cus_Dtl.SKU_CODE = dataTable_detail.Rows[i]["SKU_CODE"].ToString();
                    _Cus_Dtl.SKU_ID = Convert.ToInt32(dataTable_detail.Rows[i]["SKU_ID"]);
                    _Cus_Dtl.PACK_SIZE = dataTable_detail.Rows[i]["PACK_SIZE"].ToString();
                    _Cus_Dtl.SKU_PRICE = Convert.ToInt32(dataTable_detail.Rows[i]["SKU_PRICE"]);
                    _Cus_Dtl.STATUS = dataTable_detail.Rows[i]["STATUS"].ToString();
                    _Cus_Dtl.UNIT_ID = Convert.ToInt32(dataTable_detail.Rows[i]["UNIT_ID"]);
                    _Cus_Dtl.ROW_NO = Convert.ToInt32(dataTable_detail.Rows[i]["ROW_NO"]);
                    _Customer_Mst.customerSkuPriceList.Add(_Cus_Dtl);
                }
            }

            return _Customer_Mst;



        }

        public Task<string> LoadData(string db, int Company_Id)
        {
            throw new NotImplementedException();
        }

      
    }
}
