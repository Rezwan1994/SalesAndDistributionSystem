using Microsoft.Extensions.Configuration;
using SalesAndDistributionSystem.Domain.Common;
using SalesAndDistributionSystem.Domain.Models.Entities.SalesAndDistribution;
using SalesAndDistributionSystem.Domain.Utility;
using SalesAndDistributionSystem.Services.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.SalesAndDistribution
{
    public class ProductManager : IProductManager
    {
        private readonly ICommonServices _commonServices;
        private readonly IConfiguration _configuration;
        public ProductManager(ICommonServices commonServices, IConfiguration configuration)
        {
            _commonServices = commonServices;
            _configuration = configuration;

        }

        //-------------------Query Part ---------------------------------------------------
        string FilterQry= "";
      

        string LoadData_Query() => @"Select
                               ROW_NUMBER() OVER(ORDER BY SKU_ID ASC) AS ROW_NO
                              ,BASE_PRODUCT_ID
                              ,BRAND_ID
                              ,CATEGORY_ID
                              ,COMPANY_ID
                              ,FONT_COLOR
                              ,GROUP_ID
                              ,PACK_SIZE
                              ,PACK_UNIT
                              ,PACK_VALUE
                              ,PRIMARY_PRODUCT_ID
                              ,PRODUCT_SEASON_ID
                              ,PRODUCT_STATUS
                              ,PRODUCT_TYPE_ID
                              ,QTY_PER_PACK
                              ,REMARKS
                              ,SHIPPER_QTY
                              ,SHIPPER_VOLUME
                              ,SHIPPER_VOLUME_UNIT
                              ,SHIPPER_WEIGHT
                              ,SHIPPER_WEIGHT_UNIT
                              ,SKU_CODE
                              ,SKU_ID
                              ,SKU_NAME
                              ,SKU_NAME_BANGLA
                              ,STORAGE_ID
                              ,UNIT_ID
                              ,WEIGHT_PER_PACK
                              ,WEIGHT_UNIT
                               from Product_Info Where COMPANY_ID = :param1";

        string LoadFilteredData_Query() => string.Format(@"Select
                               ROW_NUMBER() OVER(ORDER BY SKU_ID ASC) AS ROW_NO
                              ,BASE_PRODUCT_ID
                              ,BRAND_ID
                              ,CATEGORY_ID
                              ,COMPANY_ID
                              ,GROUP_ID
                              ,PACK_SIZE
                              ,'' PRICE_FLAG
                              ,0 SKU_PRICE
                              ,'' COMMISSION_FLAG
                              ,'' COMMISSION_TYPE
                              ,0 COMMISSION_VALUE
                              ,0 ADD_COMMISSION1
                              ,0 ADD_COMMISSION2
                              ,REMARKS
                            
                              ,SKU_CODE
                              ,SKU_ID
                              ,SKU_NAME
                              ,SKU_NAME_BANGLA
                             
                               from Product_Info Where COMPANY_ID = :param1 {0}", FilterQry);
        string LoadSearchableData_Query() => @"Select
                                ROW_NUMBER() OVER(ORDER BY SKU_ID ASC) AS ROW_NO
                               ,BASE_PRODUCT_ID
                               ,BRAND_ID
                               ,CATEGORY_ID
                               ,COMPANY_ID
                               ,FONT_COLOR
                               ,GROUP_ID
                               ,PACK_SIZE
                               ,PACK_UNIT
                               ,PACK_VALUE
                               ,PRIMARY_PRODUCT_ID
                               ,PRODUCT_SEASON_ID
                               ,PRODUCT_STATUS
                               ,PRODUCT_TYPE_ID
                               ,QTY_PER_PACK
                               ,REMARKS
                               ,SHIPPER_QTY
                               ,SHIPPER_VOLUME
                               ,SHIPPER_VOLUME_UNIT
                               ,SHIPPER_WEIGHT
                               ,SHIPPER_WEIGHT_UNIT
                               ,SKU_CODE
                               ,SKU_ID
                               ,SKU_NAME
                               ,SKU_NAME_BANGLA
                               ,STORAGE_ID
                               ,UNIT_ID
                               ,WEIGHT_PER_PACK
                               ,WEIGHT_UNIT
                               from Product_Info Where COMPANY_ID = :param1 AND upper(SKU_NAME) Like '%' || upper(:param2) || '%'";
        string AddOrUpdate_AddQuery() => @"INSERT INTO PRODUCT_INFO 
                                         (BASE_PRODUCT_ID
                                          ,BRAND_ID
                                          ,CATEGORY_ID
                                          ,COMPANY_ID
                                          ,FONT_COLOR
                                          ,GROUP_ID
                                          ,PACK_SIZE
                                          ,PACK_UNIT
                                          ,PACK_VALUE
                                          ,PRIMARY_PRODUCT_ID
                                          ,PRODUCT_SEASON_ID
                                          ,PRODUCT_STATUS
                                          ,PRODUCT_TYPE_ID
                                          ,QTY_PER_PACK
                                          ,REMARKS
                                          ,SHIPPER_QTY
                                          ,SHIPPER_VOLUME
                                          ,SHIPPER_VOLUME_UNIT
                                          ,SHIPPER_WEIGHT
                                          ,SHIPPER_WEIGHT_UNIT
                                          ,SKU_CODE
                                          ,SKU_ID
                                          ,SKU_NAME
                                          ,SKU_NAME_BANGLA
                                          ,STORAGE_ID
                                          ,UNIT_ID
                                          ,WEIGHT_PER_PACK
                                          ,WEIGHT_UNIT
                                          ,Entered_By
                                          ,Entered_Date,
                                        ENTERED_TERMINAL ) 
                                          VALUES ( :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10, :param11, :param12, :param13, :param14,:param15, :param16, :param17, :param18, :param19,:param20,:param21, :param22, :param23, :param24, :param25, :param26, :param27, :param28, :param29,TO_DATE(:param30, 'DD/MM/YYYY HH:MI:SS'), :param31 )";
        string AddOrUpdate_UpdateQuery() => @"UPDATE Product_Info SET  
                                             BASE_PRODUCT_ID = :param1
                                            ,BRAND_ID =  :param2
                                            ,CATEGORY_ID =  :param3
                                            ,COMPANY_ID =  :param4
                                            ,FONT_COLOR =  :param5
                                            ,GROUP_ID =  :param6
                                            ,PACK_SIZE =  :param7
                                            ,PACK_UNIT =  :param8
                                            ,PACK_VALUE =  :param9
                                            ,PRIMARY_PRODUCT_ID =  :param10
                                            ,PRODUCT_SEASON_ID =  :param11
                                            ,PRODUCT_STATUS =  :param12
                                            ,PRODUCT_TYPE_ID =  :param13
                                            ,QTY_PER_PACK =  :param14
                                            ,REMARKS =  :param15
                                            ,SHIPPER_QTY =  :param16
                                            ,SHIPPER_VOLUME =  :param17
                                            ,SHIPPER_VOLUME_UNIT =  :param18
                                            ,SHIPPER_WEIGHT =  :param19
                                            ,SHIPPER_WEIGHT_UNIT =  :param20
                                            ,SKU_CODE =  :param21
                                            ,SKU_NAME =  :param22
                                            ,SKU_NAME_BANGLA =  :param23
                                            ,STORAGE_ID =  :param24
                                            ,UNIT_ID =  :param25
                                            ,WEIGHT_PER_PACK =  :param26
                                            ,WEIGHT_UNIT  =  :param27,
                                            UPDATED_BY = :param28, UPDATED_DATE = TO_DATE(:param29, 'DD/MM/YYYY HH:MI:SS'), 
                                            UPDATED_TERMINAL = :param30 WHERE SKU_ID = :param31";
        string GetNewProduct_Info_IdQuery() => "SELECT NVL(MAX(SKU_ID),0) + 1 SKU_ID  FROM PRODUCT_INFO";
        string Get_LastProduct_Ino() => "SELECT  SKU_ID, SKU_CODE  FROM PRODUCT_INFO Where  SKU_ID = (SELECT   NVL(MAX(SKU_ID),0) SKU_ID From PRODUCT_INFO where COMPANY_ID = :param1 )";


        //---------- Method Execution Part ------------------------------------------------



        public async Task<string> AddOrUpdate(string db, Product_Info model)
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


                    if (model.SKU_ID == 0)
                    {

                        model.SKU_ID = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetNewProduct_Info_IdQuery(), _commonServices.AddParameter(new string[] { }));

                        listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_AddQuery(),
                         _commonServices.AddParameter(new string[] { model.BASE_PRODUCT_ID.ToString(),
                             model.BRAND_ID.ToString(), model.CATEGORY_ID.ToString(),model.COMPANY_ID.ToString(),
                             model.FONT_COLOR, model.GROUP_ID.ToString(), model.PACK_SIZE, model.PACK_UNIT,
                             model.PACK_VALUE.ToString(), model.PRIMARY_PRODUCT_ID.ToString(), model.PRODUCT_SEASON_ID.ToString(),
                             model.PRODUCT_STATUS.ToString(),  model.PRODUCT_TYPE_ID.ToString(),
                             model.QTY_PER_PACK.ToString(), model.REMARKS, model.SHIPPER_QTY.ToString(),
                             model.SHIPPER_VOLUME.ToString(), model.SHIPPER_VOLUME_UNIT, model.SHIPPER_WEIGHT.ToString(),
                             model.SHIPPER_WEIGHT_UNIT.ToString(),model.SKU_CODE, model.SKU_ID.ToString(),
                             model.SKU_NAME, model.SKU_NAME_BANGLA, model.STORAGE_ID.ToString(), model.UNIT_ID.ToString(),
                             model.WEIGHT_PER_PACK.ToString(),model.WEIGHT_UNIT.ToString(),
                             model.ENTERED_BY.ToString(), model.ENTERED_DATE, model.ENTERED_TERMINAL })));

                    }
                    else
                    {

                        listOfQuery.Add(_commonServices.AddQuery(
                            AddOrUpdate_UpdateQuery(),
                            _commonServices.AddParameter(new string[] {
                             model.BASE_PRODUCT_ID.ToString(),
                             model.BRAND_ID.ToString(), model.CATEGORY_ID.ToString(),model.COMPANY_ID.ToString(),
                             model.FONT_COLOR, model.GROUP_ID.ToString(), model.PACK_SIZE, model.PACK_UNIT,
                             model.PACK_VALUE.ToString(), model.PRIMARY_PRODUCT_ID.ToString(), model.PRODUCT_SEASON_ID.ToString(),
                             model.PRODUCT_STATUS.ToString(),  model.PRODUCT_TYPE_ID.ToString(),
                             model.QTY_PER_PACK.ToString(), model.REMARKS, model.SHIPPER_QTY.ToString(),
                             model.SHIPPER_VOLUME.ToString(), model.SHIPPER_VOLUME_UNIT, model.SHIPPER_WEIGHT.ToString(),
                             model.SHIPPER_WEIGHT_UNIT.ToString(),model.SKU_CODE,
                             model.SKU_NAME, model.SKU_NAME_BANGLA, model.STORAGE_ID.ToString(), model.UNIT_ID.ToString(),
                             model.WEIGHT_PER_PACK.ToString(),model.WEIGHT_UNIT.ToString(),
                                model.UPDATED_BY.ToString(), model.UPDATED_DATE,
                                model.UPDATED_TERMINAL, model.SKU_ID.ToString() })));

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
        public async Task<DataTable> LoadDataTable(string db, int Company_Id) => await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString()}));
        public async Task<DataTable> LoadFilteredDataTable(string db, int Company_Id) => await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadFilteredData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString()}));
        public async Task<string> LoadData(string db, int Company_Id) => _commonServices.DataTableToJSON(await LoadDataTable(db,Company_Id));
        public async Task<string> GetSearchableProduct(string db, int Company_Id, string product) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadSearchableData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString(), product })));

        public async Task<string> LoadFilteredData(Price_Dtl_Param priceInfo)
        {
            if (!string.IsNullOrEmpty(priceInfo.GROUP_ID) && priceInfo.GROUP_ID != "0")
            {
              
                FilterQry += string.Format("  and Group_ID = {0}", Convert.ToInt32(priceInfo.GROUP_ID));
            }
            if (!string.IsNullOrEmpty(priceInfo.BRAND_ID) && priceInfo.BRAND_ID != "0")
            {
                FilterQry += string.Format("  and Brand_ID = {0}", Convert.ToInt32(priceInfo.BRAND_ID));
            }
           
            if (!string.IsNullOrEmpty(priceInfo.BASE_PRODUCT_ID) && priceInfo.BASE_PRODUCT_ID !="0")
            {
                FilterQry += string.Format("  and Base_Product_Id = {0}", Convert.ToInt32(priceInfo.BASE_PRODUCT_ID));
            }
            if (!string.IsNullOrEmpty(priceInfo.CATEGORY_ID) && priceInfo.CATEGORY_ID != "0")
            {
                FilterQry += string.Format("  and Category_Id = {0}", Convert.ToInt32(priceInfo.CATEGORY_ID));
            }

            if (!string.IsNullOrEmpty(priceInfo.PRODUCT_ID) && priceInfo.PRODUCT_ID != "0")
            {
                FilterQry += string.Format("  and SKU_ID = {0}", Convert.ToInt32(priceInfo.PRODUCT_ID));
            }
             var dd =_commonServices.DataTableToJSON(await LoadFilteredDataTable(priceInfo.db, priceInfo.COMPANY_ID));
            return dd;
        }
        public async Task<string> GenerateProductCode(string db, string Company_Id)
        {
            try
            {
                string code;
                DataTable dataTable = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), Get_LastProduct_Ino(), _commonServices.AddParameter(new string[] { Company_Id.ToString() }));
                if (dataTable.Rows.Count > 0)
                {
                    string serial = (Convert.ToInt32(dataTable.Rows[0]["SKU_CODE"].ToString().Substring(3, (CodeConstants.ProductInfo_CodeLength - 3))) + 1).ToString();
                    int serial_length = serial.Length;
                    code = CodeConstants.ProductInfo_CodeConst;
                    for (int i = 0; i < (CodeConstants.ProductInfo_CodeLength - (serial_length + 3)); i++)
                    {
                        code += "0";
                    }
                    code += serial;
                }
                else
                {
                    code = CodeConstants.ProductInfo_CodeConst + "0001";
                }
                return code;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}




