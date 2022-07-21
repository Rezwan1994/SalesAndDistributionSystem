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
    public class CustomerManager : ICustomerManager
    {
        private readonly ICommonServices _commonServices;
        private readonly IConfiguration _configuration;
        public CustomerManager(ICommonServices commonServices, IConfiguration configuration)
        {
            _commonServices = commonServices;
            _configuration = configuration;

        }

        //-------------------Query Part ---------------------------------------------------

        string LoadData_Query() => @"Select ROW_NUMBER() OVER(ORDER BY CUSTOMER_ID ASC) AS ROW_NO
                               ,BIN_NO
                               ,CLOSING_DATE
                               ,COMPANY_ID
                               ,CONTACT_PERSON_NAME
                               ,CONTACT_PERSON_NO
                               ,CUSTOMER_ADDRESS
                               ,CUSTOMER_ADDRESS_BANGLA
                               ,CUSTOMER_CODE
                               ,CUSTOMER_CONTACT
                               ,CUSTOMER_EMAIL
                               ,CUSTOMER_ID
                               ,CUSTOMER_NAME
                               ,CUSTOMER_NAME_BANGLA
                               ,CUSTOMER_REMARKS
                               ,CUSTOMER_STATUS
                               ,CUSTOMER_TYPE_ID
                               ,DB_LOCATION_ID
                               ,DB_LOCATION_NAME
                               ,DELIVERY_ADDRESS
                               ,DELIVERY_ADDRESS_BANGLA
                               ,ENTERED_BY
                               ,ENTERED_DATE
                               ,ENTERED_TERMINAL
                               ,OPENING_DATE
                               ,PRICE_TYPE_ID
                               ,PROPRIETOR_NAME
                               ,SECURITY_MONEY
                               ,TDS_FLAG
                               ,TIN_NO
                               ,TRADE_LICENSE_NO
                               ,UNIT_ID
                               ,UPDATED_BY
                               ,UPDATED_DATE
                               ,UPDATED_TERMINAL
                               ,VAT_REG_NO
                               from Customer_Info Where COMPANY_ID = :param1";

        string LoadActiveCustomerData_Query() => @"Select ROW_NUMBER() OVER(ORDER BY CUSTOMER_ID ASC) AS ROW_NO
                               ,BIN_NO
                               ,CLOSING_DATE
                               ,COMPANY_ID
                               ,CONTACT_PERSON_NAME
                               ,CONTACT_PERSON_NO
                               ,CUSTOMER_ADDRESS
                               ,CUSTOMER_ADDRESS_BANGLA
                               ,CUSTOMER_CODE
                               ,CUSTOMER_CONTACT
                               ,CUSTOMER_EMAIL
                               ,CUSTOMER_ID
                               ,CUSTOMER_NAME
                               ,CUSTOMER_NAME_BANGLA
                               ,CUSTOMER_REMARKS
                               ,CUSTOMER_STATUS
                               ,CUSTOMER_TYPE_ID
                               ,DB_LOCATION_ID
                               ,DB_LOCATION_NAME
                               ,DELIVERY_ADDRESS
                               ,DELIVERY_ADDRESS_BANGLA
                               ,ENTERED_BY
                               ,ENTERED_DATE
                               ,ENTERED_TERMINAL
                               ,OPENING_DATE
                               ,PRICE_TYPE_ID
                               ,PROPRIETOR_NAME
                               ,SECURITY_MONEY
                               ,TDS_FLAG
                               ,TIN_NO
                               ,TRADE_LICENSE_NO
                               ,UNIT_ID
                               ,UPDATED_BY
                               ,UPDATED_DATE
                               ,UPDATED_TERMINAL
                               ,VAT_REG_NO
                               from Customer_Info Where COMPANY_ID = :param1 and Customer_Status = 'Active'";
        string LoadSearchableData_Query() => @"Select ROW_NUMBER() OVER(ORDER BY CUSTOMER_ID ASC) AS ROW_NO
                               ,BIN_NO
                               ,CLOSING_DATE
                               ,COMPANY_ID
                               ,CONTACT_PERSON_NAME
                               ,CONTACT_PERSON_NO
                               ,CUSTOMER_ADDRESS
                               ,CUSTOMER_ADDRESS_BANGLA
                               ,CUSTOMER_CODE
                               ,CUSTOMER_CONTACT
                               ,CUSTOMER_EMAIL
                               ,CUSTOMER_ID
                               ,CUSTOMER_NAME
                               ,CUSTOMER_NAME_BANGLA
                               ,CUSTOMER_REMARKS
                               ,CUSTOMER_STATUS
                               ,CUSTOMER_TYPE_ID
                               ,DB_LOCATION_ID
                               ,DB_LOCATION_NAME
                               ,DELIVERY_ADDRESS
                               ,DELIVERY_ADDRESS_BANGLA
                               ,ENTERED_BY
                               ,ENTERED_DATE
                               ,ENTERED_TERMINAL
                               ,OPENING_DATE
                               ,PRICE_TYPE_ID
                               ,PROPRIETOR_NAME
                               ,SECURITY_MONEY
                               ,TDS_FLAG
                               ,TIN_NO
                               ,TRADE_LICENSE_NO
                               ,UNIT_ID
                               ,UPDATED_BY
                               ,UPDATED_DATE
                               ,UPDATED_TERMINAL
                               ,VAT_REG_NO
                               from Customer_Info Where COMPANY_ID = :param1 AND upper(CUSTOMER_NAME) Like '%' || upper(:param2) || '%'";
        string AddOrUpdate_AddQuery() => @"INSERT INTO Customer_Info 
                                         (BIN_NO
                               ,CLOSING_DATE
                               ,COMPANY_ID
                               ,CONTACT_PERSON_NAME
                               ,CONTACT_PERSON_NO
                               ,CUSTOMER_ADDRESS
                               ,CUSTOMER_ADDRESS_BANGLA
                               ,CUSTOMER_CODE
                               ,CUSTOMER_CONTACT
                               ,CUSTOMER_EMAIL
                               ,CUSTOMER_ID
                               ,CUSTOMER_NAME
                               ,CUSTOMER_NAME_BANGLA
                               ,CUSTOMER_REMARKS
                               ,CUSTOMER_STATUS
                               ,CUSTOMER_TYPE_ID
                               ,DB_LOCATION_ID
                               ,DB_LOCATION_NAME
                               ,DELIVERY_ADDRESS
                               ,DELIVERY_ADDRESS_BANGLA
                               ,ENTERED_BY
                               ,ENTERED_DATE
                               ,ENTERED_TERMINAL
                               ,OPENING_DATE
                               ,PRICE_TYPE_ID
                               ,PROPRIETOR_NAME
                               ,SECURITY_MONEY
                               ,TDS_FLAG
                               ,TIN_NO
                               ,TRADE_LICENSE_NO
                               ,UNIT_ID
                               ,VAT_REG_NO) 
                                VALUES ( :param1, TO_DATE(:param2, 'DD/MM/YYYY HH:MI:SS'), :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10, :param11, :param12, :param13, :param14,:param15, :param16, :param17, :param18, :param19,:param20,:param21,TO_DATE(:param22, 'DD/MM/YYYY HH:MI:SS') , :param23,TO_DATE(:param24, 'DD/MM/YYYY HH:MI:SS'), :param25, :param26, :param27, :param28, :param29, :param30, :param31, :param32 )";
        string AddOrUpdate_UpdateQuery() => @"UPDATE Customer_Info SET  
                                             BIN_NO = :param1
                               ,CONTACT_PERSON_NAME = :param2
                               ,CONTACT_PERSON_NO = :param3
                               ,CUSTOMER_ADDRESS = :param4
                               ,CUSTOMER_ADDRESS_BANGLA = :param5
                               ,CUSTOMER_CONTACT = :param6
                               ,CUSTOMER_EMAIL = :param7
                               ,CUSTOMER_NAME = :param8
                               ,CUSTOMER_NAME_BANGLA = :param9
                               ,CUSTOMER_REMARKS = :param10
                               ,CUSTOMER_STATUS = :param11
                               ,CUSTOMER_TYPE_ID = :param12
                               ,DB_LOCATION_ID = :param13
                               ,DB_LOCATION_NAME = :param14
                               ,DELIVERY_ADDRESS = :param15
                               ,DELIVERY_ADDRESS_BANGLA = :param16
                               
                               ,PRICE_TYPE_ID = :param17
                               ,PROPRIETOR_NAME = :param18
                               ,SECURITY_MONEY = :param19
                               ,TDS_FLAG = :param20
                               ,TIN_NO = :param21
                               ,TRADE_LICENSE_NO = :param22
                               ,UNIT_ID = :param23
                               ,VAT_REG_NO = :param24
                               ,UPDATED_BY = :param25
                               ,UPDATED_DATE = TO_DATE(:param26, 'DD/MM/YYYY HH:MI:SS'), 
                                UPDATED_TERMINAL = :param27 WHERE CUSTOMER_ID = :param28";
        string GetNewCustomer_Info_IdQuery() => "SELECT NVL(MAX(CUSTOMER_ID),0) + 1 CUSTOMER_ID  FROM CUSTOMER_INFO";
        string Get_LastCustomer_Ino() => "SELECT  CUSTOMER_ID, CUSTOMER_CODE  FROM CUSTOMER_INFO Where  CUSTOMER_ID = (SELECT   NVL(MAX(CUSTOMER_ID),0) CUSTOMER_ID From CUSTOMER_INFO where COMPANY_ID = :param1 )";


        //---------- Method Execution Part ------------------------------------------------



        public async Task<string> AddOrUpdate(string db, Customer_Info model)
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


                    if (model.CUSTOMER_ID == 0)
                    {

                        model.CUSTOMER_ID = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetNewCustomer_Info_IdQuery(), _commonServices.AddParameter(new string[] { }));
                        model.DB_LOCATION_ID = model.CUSTOMER_ID;
                        listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_AddQuery(),
                         _commonServices.AddParameter(new string[] { model.BIN_NO,
                             model.CLOSING_DATE.ToString(), model.COMPANY_ID.ToString(),model.CONTACT_PERSON_NAME,
                             model.CONTACT_PERSON_NO, model.CUSTOMER_ADDRESS, model.CUSTOMER_ADDRESS_BANGLA, model.CUSTOMER_CODE,
                             model.CUSTOMER_CONTACT, model.CUSTOMER_EMAIL, model.CUSTOMER_ID.ToString(),
                             model.CUSTOMER_NAME,  model.CUSTOMER_NAME_BANGLA,
                             model.CUSTOMER_REMARKS, model.CUSTOMER_STATUS, model.CUSTOMER_TYPE_ID.ToString(),
                             model.DB_LOCATION_ID.ToString(), model.DB_LOCATION_NAME, model.DELIVERY_ADDRESS,
                             model.DELIVERY_ADDRESS_BANGLA,model.ENTERED_BY.ToString(), model.ENTERED_DATE, model.ENTERED_TERMINAL,  model.OPENING_DATE,
                             model.PRICE_TYPE_ID.ToString(), model.PROPRIETOR_NAME, model.SECURITY_MONEY.ToString(), model.TDS_FLAG == "Yes"? "1": "0",
                             model.TIN_NO,model.TRADE_LICENSE_NO,model.UNIT_ID.ToString(),model.VAT_REG_NO
                             })));

                    }
                    else
                    {

                        listOfQuery.Add(_commonServices.AddQuery(
                            AddOrUpdate_UpdateQuery(),
                            _commonServices.AddParameter(new string[] {
                             model.BIN_NO,
                             model.CONTACT_PERSON_NAME,
                             model.CONTACT_PERSON_NO, model.CUSTOMER_ADDRESS, model.CUSTOMER_ADDRESS_BANGLA,
                             model.CUSTOMER_CONTACT, model.CUSTOMER_EMAIL,
                             model.CUSTOMER_NAME,  model.CUSTOMER_NAME_BANGLA,
                             model.CUSTOMER_REMARKS, model.CUSTOMER_STATUS, model.CUSTOMER_TYPE_ID.ToString(),
                             model.DB_LOCATION_NAME, model.DELIVERY_ADDRESS,
                             model.DELIVERY_ADDRESS_BANGLA,  model.OPENING_DATE,
                             model.PRICE_TYPE_ID.ToString(), model.PROPRIETOR_NAME, model.SECURITY_MONEY.ToString(), model.TDS_FLAG.ToString(),
                             model.TIN_NO,model.TRADE_LICENSE_NO,model.UNIT_ID.ToString(),model.VAT_REG_NO, model.UPDATED_BY.ToString(), model.UPDATED_DATE,
                                model.UPDATED_TERMINAL, model.CUSTOMER_ID.ToString() })));

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
        public async Task<string> LoadActiveCustomerData(string db, int Company_Id) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadActiveCustomerData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString() })));
        public async Task<string> GetSearchableCustomer(string db, int Company_Id, string customer) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadSearchableData_Query(), _commonServices.AddParameter(new string[] { Company_Id.ToString(), customer })));

        public async Task<string> GenerateCustomerCode(string db, string Company_Id,string Company_Name)
        {
            try
            {
                string code;
                DataTable dataTable = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), Get_LastCustomer_Ino(), _commonServices.AddParameter(new string[] { Company_Id.ToString() }));
                if (dataTable.Rows.Count > 0)
                {
                    string serial = (Convert.ToInt32(dataTable.Rows[0]["CUSTOMER_CODE"].ToString().Substring(1, (CodeConstants.CustomerInfo_CodeLength - 1))) + 1).ToString();
                    int serial_length = serial.Length;
                    code = CodeConstants.CustomerInfo_CodeConst;
                    for (int i = 0; i < (CodeConstants.CustomerInfo_CodeLength - (serial_length + 1)); i++)
                    {
                        code += "0";
                    }
                    code += serial;
                }
                else
                {
                    code = CodeConstants.CustomerInfo_CodeConst + "00001";
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




