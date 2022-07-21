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
    public class ProductPriceManager : IProductPriceManager
    {
        private readonly ICommonServices _commonServices;
        private readonly IConfiguration _configuration;
        public ProductPriceManager(ICommonServices commonServices, IConfiguration configuration)
        {
            _commonServices = commonServices;
            _configuration = configuration;

        }

        //-------------------Query Part ---------------------------------------------------

        string LoadData_Query() => @"SELECT ROW_NUMBER() OVER(ORDER BY Price_ID ASC) AS ROW_NO
                       ,COMPANY_ID
                       ,EMPLOYEE_PRICE
                       ,GROSS_PROFIT
                       ,MRP
                       ,TO_CHAR(PRICE_EFFECT_DATE, 'DD/MM/YYYY') PRICE_EFFECT_DATE
                       ,TO_CHAR(PRICE_ENTRY_DATE, 'DD/MM/YYYY') PRICE_ENTRY_DATE
                       ,PRICE_ID
                       ,SKU_CODE
                       ,SKU_ID
                       ,SPECIAL_PRICE
                       ,SUPPLIMENTARY_TAX
                       ,UNIT_ID
                       ,UNIT_TP
                       ,UNIT_VAT
                       From Product_Price_Info  Where COMPANY_ID = :param1";
        string LoadSearchableData_Query() => @"SELECT ROW_NUMBER() OVER(ORDER BY Price_ID ASC) AS ROW_NO
                       ,COMPANY_ID
                       ,EMPLOYEE_PRICE
                       ,GROSS_PROFIT
                       ,MRP
                       ,TO_CHAR(PRICE_EFFECT_DATE, 'DD/MM/YYYY') PRICE_EFFECT_DATE
                       ,TO_CHAR(PRICE_ENTRY_DATE, 'DD/MM/YYYY') PRICE_ENTRY_DATE
                       ,PRICE_ID
                       ,SKU_CODE
                       ,SKU_ID
                       ,SPECIAL_PRICE
                       ,SUPPLIMENTARY_TAX
                       ,UNIT_ID
                       ,UNIT_TP
                       ,UNIT_VAT
                       From Product_Price_Info Where COMPANY_ID = :param1 AND upper(PRODUCT_TYPE_NAME) Like '%' || upper(:param2) || '%'";

        string AddOrUpdate_AddQuery() => @"INSERT INTO Product_Price_Info 
                                         (COMPANY_ID, EMPLOYEE_PRICE, GROSS_PROFIT, MRP,PRICE_EFFECT_DATE, PRICE_ENTRY_DATE,PRICE_ID,SKU_CODE,SKU_ID,SUPPLIMENTARY_TAX,UNIT_ID,SPECIAL_PRICE,UNIT_TP,UNIT_VAT,  Entered_By, Entered_Date,ENTERED_TERMINAL ) 
                                         VALUES ( :param1, :param2, :param3, :param4,TO_DATE(:param5, 'DD/MM/YYYY HH:MI:SS') ,TO_DATE(:param6, 'DD/MM/YYYY HH:MI:SS'), :param7, :param8, :param9,:param10 ,:param11,:param12,:param13,:param14,:param15,TO_DATE(:param16, 'DD/MM/YYYY HH:MI:SS'),:param17)";
        string AddOrUpdate_UpdateQuery() => @"UPDATE Product_Price_Info SET 
                            COMPANY_ID = :param2
                           ,EMPLOYEE_PRICE = :param3
                           ,GROSS_PROFIT = :param4
                           ,MRP = :param5
                           ,PRICE_EFFECT_DATE =  TO_DATE(:param6, 'DD/MM/YYYY HH:MI:SS')
                           ,PRICE_ENTRY_DATE = TO_DATE(:param7, 'DD/MM/YYYY HH:MI:SS')
                           ,SKU_CODE = :param8
                           ,SKU_ID = :param9
                           ,SPECIAL_PRICE = :param10
                           ,SUPPLIMENTARY_TAX = :param11
                           ,UNIT_ID = :param12
                           ,UNIT_TP = :param13
                           ,UNIT_VAT = :param14
                           ,UPDATED_BY = :param15
                           ,UPDATED_DATE = TO_DATE(:param16, 'DD/MM/YYYY HH:MI:SS')
                           ,UPDATED_TERMINAL = :param17
                           Where PRICE_ID = :param1";
        string GetNewProductPrice_Info_IdQuery() => "SELECT NVL(MAX(PRICE_ID),0) + 1 PRICE_ID  FROM PRODUCT_PRICE_INFO";
        string Get_LastProductPrice_Ino() => "SELECT  PRICE_ID  FROM PRODUCT_PRICE_INFO Where  PRICE_ID = (SELECT   NVL(MAX(PRICE_ID),0) PRICE_ID From PRODUCT_PRICE_INFO where COMPANY_ID = :param1 )";


        //---------- Method Execution Part ------------------------------------------------



        public async Task<string> AddOrUpdate(string db, Product_Price_Info model)
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

                    if (model.PRICE_ID == 0)
                    {

                        model.PRICE_ID = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetNewProductPrice_Info_IdQuery(), _commonServices.AddParameter(new string[] { }));
                        listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_AddQuery(), 
                            _commonServices.AddParameter(new string[] { model.COMPANY_ID.ToString(), 
                               model.EMPLOYEE_PRICE.ToString(), model.GROSS_PROFIT.ToString(), model.MRP.ToString(),
                               model.PRICE_EFFECT_DATE, model.PRICE_ENTRY_DATE,model.PRICE_ID.ToString(),model.SKU_CODE.ToString(), model.SKU_ID.ToString(),
                               model.SUPPLIMENTARY_TAX.ToString(),model.UNIT_ID.ToString(),model.SPECIAL_PRICE.ToString(),
                               model.UNIT_TP.ToString(),model.UNIT_VAT.ToString(),model.ENTERED_BY.ToString(), model.ENTERED_DATE, model.ENTERED_TERMINAL })));

                    }
                    else
                    {

                        listOfQuery.Add(_commonServices.AddQuery(
                            AddOrUpdate_UpdateQuery(),
                            _commonServices.AddParameter(new string[] {
                               model.PRICE_ID.ToString(),model.COMPANY_ID.ToString(),
                               model.EMPLOYEE_PRICE.ToString(), model.GROSS_PROFIT.ToString(), model.MRP.ToString(),
                               model.PRICE_EFFECT_DATE, model.PRICE_ENTRY_DATE,model.SKU_CODE.ToString(), model.SKU_ID.ToString(),
                               model.SPECIAL_PRICE.ToString(),model.SUPPLIMENTARY_TAX.ToString(),model.UNIT_ID.ToString(),
                               model.UNIT_TP.ToString(),model.UNIT_VAT.ToString(),model.UPDATED_BY.ToString(), model.UPDATED_DATE,model.UPDATED_TERMINAL })));

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

        public async Task<string> LoadData(string db, int Company_Id) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString() })));
        public async Task<string> GetSearchableProductPrice(string db, int Company_Id, string ProductPrice) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadSearchableData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString(), ProductPrice })));

    }
}




