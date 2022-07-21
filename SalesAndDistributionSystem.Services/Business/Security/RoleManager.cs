using Microsoft.Extensions.Configuration;
using SalesAndDistributionSystem.Domain.Common;
using SalesAndDistributionSystem.Domain.Models.TableModels.Security;
using SalesAndDistributionSystem.Domain.Models.ViewModels.Security;
using SalesAndDistributionSystem.Domain.Utility;
using SalesAndDistributionSystem.Services.Business.User;
using SalesAndDistributionSystem.Services.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.Security
{
    public class RoleManager : IRoleManager
    {

        private readonly ICommonServices _commonServices;
        private readonly IConfiguration _configuration;
        private readonly IUserManager _userManager;

        public RoleManager(ICommonServices commonServices, IConfiguration configuration, IUserManager userManager)
        {
            _commonServices = commonServices;
            _configuration = configuration;
            _userManager = userManager;

        }

        string loadDataQuery() => @"Select ROW_NUMBER() OVER(ORDER BY R.ROLE_ID ASC) AS ROW_NO,R.ROLE_ID,R.ROLE_NAME,R.STATUS,
                                 TO_CHAR(R.ENTERED_DATE, 'YYYY-MM-DD') ENTERED_DATE, (Select C.UNIT_NAME From COMPANY_INFO C where C.UNIT_ID  = NVL(R.UNIT_ID,0) AND C.COMPANY_ID = :param1) UNIT_NAME
                                 from Role_Info R
                                 Where R.COMPANY_ID = :param1";
        string AddOrUpdate_AddQuery() => @"INSERT INTO Role_Info (
                                         ROLE_ID
                                        ,ROLE_NAME
                                        ,STATUS
                                        ,ENTERED_TERMINAL
                                        ,ENTERED_DATE
                                        ,ENTERED_BY
                                        ,COMPANY_ID
                                        ,UNIT_ID

                                       ) 
                                       VALUES ( :param1, :param2, :param3, :param4, TO_DATE(:param5, 'DD/MM/YYYY HH:MI:SS') , :param6, :param7, :param8)";
        string AddOrUpdate_UpdateQuery() => @"UPDATE Role_Info SET ROLE_NAME = :param2,
                                            UPDATED_BY = :param3, UPDATED_DATE = TO_DATE(:param4, 'DD/MM/YYYY HH:MI:SS'),UPDATED_TERMINAL = :param5 WHERE ROLE_ID = :param1";
        string ActivateRoleQuery() => "UPDATE Role_Info SET  Status = '" + Status.Active + "' WHERE ROLE_ID = :param1";
        string DeactivateRoleQuery() => "UPDATE Role_Info SET  Status = '" + Status.InActive + "' WHERE ROLE_ID = :param1";
        string GetNewRole_InfoIdQuery() => "SELECT NVL(MAX(ROLE_ID),0) + 1 ROLE_ID  FROM Role_Info";


        public string LoadData(string db, int companyId) => _commonServices.DataTableToJSON(_commonServices.GetDataTable(_configuration.GetConnectionString(db), loadDataQuery(), _commonServices.AddParameter(new string[] { companyId.ToString() })));
       

        public async Task<string> AddOrUpdate(string db, Role_Info model)
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

                    if (model.ROLE_ID == 0)
                    {

                        model.ROLE_ID = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetNewRole_InfoIdQuery(), _commonServices.AddParameter(new string[] { }));
                        model.STATUS = Status.Active;

                        listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_AddQuery(), _commonServices.AddParameter(new string[] { model.ROLE_ID.ToString(), model.ROLE_NAME, model.STATUS, model.ENTERED_TERMINAL, model.ENTERED_DATE, model.ENTERED_BY.ToString(), model.COMPANY_ID.ToString(), model.UNIT_ID.ToString() })));

                    }
                    else
                    {
                        listOfQuery.Add(_commonServices.AddQuery(AddOrUpdate_UpdateQuery(), _commonServices.AddParameter(new string[] { model.ROLE_ID.ToString(), model.ROLE_NAME, model.UPDATED_BY.ToString(), model.UPDATED_DATE, model.UPDATED_TERMINAL})));

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

        public async Task<string> ActivateRole(string db, int id)
        {
            if (id < 1)
            {
                return "No data provided !!!!";

            }
            else
            {

                List<QueryPattern> listOfQuery = new List<QueryPattern>();
                try
                {

                    listOfQuery.Add(_commonServices.AddQuery(ActivateRoleQuery(), _commonServices.AddParameter(new string[] { id.ToString() })));

                    await _commonServices.SaveChangesAsyn(_configuration.GetConnectionString(db), listOfQuery);
                    return "1";
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
        }

       
        public async Task<string> DeactivateRole(string db, int id)
        {
            if (id < 1)
            {
                return "No data provided !!!!";

            }
            else
            {
                List<QueryPattern> listOfQuery = new List<QueryPattern>();
                try
                {


                    listOfQuery.Add(_commonServices.AddQuery(DeactivateRoleQuery(), _commonServices.AddParameter(new string[] { id.ToString() })));

                    await _commonServices.SaveChangesAsyn(_configuration.GetConnectionString(db), listOfQuery);
                    return "1";
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
        }

        //----------------------------------------- ROleMENU CONFIG-------------------------------

        string GetSearchableRolesQuery() => @"Select ROW_NUMBER() OVER(ORDER BY ROLE_ID ASC) AS ROW_NO,ROLE_ID,ROLE_NAME,STATUS,
                                 TO_CHAR(ENTERED_DATE, 'YYYY-MM-DD') ENTERED_DATE
                                 from Role_Info Where COMPANY_ID = :param1 AND upper(ROLE_NAME) like '%' || upper(:param2) || '%'";

        string RoleMenuQuery() => @"SELECT M.MENU_ID, M.MENU_NAME, M.HREF HREF, SM.MENU_ID PARENT_MENU_ID, SM.MENU_NAME PARENT_MENU_NAME, SM.HREF PARENT_MENU_HREF, M.MODULE_ID, MI.MODULE_NAME FROM MENU_CONFIGURATION M
                                  LEFT OUTER JOIN MENU_CONFIGURATION SM ON SM.MENU_ID = M.PARENT_MENU_ID
                                  LEFT OUTER JOIN MODULE_INFO MI ON MI.MODULE_ID = M.MODULE_ID
                                  WHERE M.STATUS = 'Active' AND M.COMPANY_ID = :param1 ";
        string RoleConfigQuery() => @"SELECT R.ID Role_CONFIG_ID,R.MENU_ID , R.ROLE_ID, R.LIST_VIEW,R.ADD_PERMISSION, R.EDIT_PERMISSION, R.DELETE_PERMISSION, R.DETAIL_VIEW, R.DOWNLOAD_PERMISSION FROM MENU_CONFIGURATION M
                                    LEFT OUTER JOIN ROLE_MENU_CONFIGURATION R ON R.MENU_ID = M.MENU_ID 
                                    WHERE  M.COMPANY_ID = :param1 AND R.ROLE_ID = :param2 ";

        string AddRoleMenuConfigQuery() => @"Insert Into ROlE_MENU_CONFIGURATION (ID,COMPANY_ID,ROLE_ID,MENU_ID,LIST_VIEW,ADD_PERMISSION,EDIT_PERMISSION,
                                          DETAIL_VIEW,DELETE_PERMISSION,DOWNLOAD_PERMISSION,ENTERED_BY,ENTERED_DATE,ENTERED_TERMINAL)
                                          Values (:param1,:param2,:param3,:param4,:param5,:param6,:param7,:param8,:param9,:param10,:param11, TO_DATE(:param12, 'DD/MM/YYYY HH:MI:SS'), :param13)";

        string AccRoleMenuConfigUpdateQuery() => @"UPDATE ROlE_MENU_CONFIGURATION SET LIST_VIEW =:param1 ,ADD_PERMISSION = :param2,EDIT_PERMISSION =  :param3,
                                            DETAIL_VIEW = :param4,DELETE_PERMISSION = :param5, DOWNLOAD_PERMISSION = :param6 , UPDATED_BY = :param7, UPDATED_DATE = TO_DATE(:param8, 'DD/MM/YYYY HH:MI:SS'),UPDATED_TERMINAL = :param9 WHERE ID = :param10";
        string GetNewRoleMenuConfigIdQuery() => "SELECT NVL(MAX(ID),0) + 1 ID  FROM ROlE_MENU_CONFIGURATION";


        public async Task<string> GetSearchableRoles(string db, int companyId, string role_name) => _commonServices.DataTableToJSON(await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), GetSearchableRolesQuery(), _commonServices.AddParameter(new string[] { companyId.ToString(), role_name })));

        public async Task<string> RoleMenuConfigSelectionList(string db, int companyId, int roleId)
        {
           
                DataTable MenuLoad = await  _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), RoleMenuQuery(), _commonServices.AddParameter(new string[] { companyId.ToString() }));
                DataTable ConfigDataLoad = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), RoleConfigQuery(), _commonServices.AddParameter(new string[] { companyId.ToString(), roleId.ToString() }));
                List<RoleMenuConfigView> roleMenuConfigView = new List<RoleMenuConfigView>();

                for (int i = 0; i < MenuLoad.Rows.Count; i++)
                {
                RoleMenuConfigView model = new RoleMenuConfigView
                {
                    ROW_NO = i + 1,

                    MENU_ID = Convert.ToInt32(MenuLoad.Rows[i]["MENU_ID"]),
                    MENU_NAME = MenuLoad.Rows[i]["MENU_NAME"].ToString(),
                    HREF = MenuLoad.Rows[i]["HREF"].ToString()
                };
                if (MenuLoad.Rows[i]["PARENT_MENU_ID"] != null && MenuLoad.Rows[i]["PARENT_MENU_ID"].ToString() != "")
                {
                    model.PARENT_MENU_ID =  Convert.ToInt32(MenuLoad.Rows[i]["PARENT_MENU_ID"]);
                    model.PARENT_MENU_NAME = MenuLoad.Rows[i]["PARENT_MENU_NAME"].ToString();
                    model.PARENT_MENU_HREF = MenuLoad.Rows[i]["PARENT_MENU_HREF"].ToString();
                }

            
                    model.MODULE_NAME = MenuLoad.Rows[i]["MODULE_NAME"].ToString();

                    roleMenuConfigView.Add(model);
                }

                for (int i = 0; i < ConfigDataLoad.Rows.Count; i++)
                {

                    RoleMenuConfigView configView = roleMenuConfigView.Where(x=>x.MENU_ID == Convert.ToInt32(ConfigDataLoad.Rows[i]["MENU_ID"])).FirstOrDefault();
                   
                    
                    configView.ROLE_CONFIG_ID = Convert.ToInt32(ConfigDataLoad.Rows[i]["ROLE_CONFIG_ID"]);
                    configView.ROLE_ID = Convert.ToInt32(ConfigDataLoad.Rows[i]["ROLE_ID"]);
                    configView.LIST_VIEW = ConfigDataLoad.Rows[i]["LIST_VIEW"].ToString();
                    configView.ADD_PERMISSION = ConfigDataLoad.Rows[i]["ADD_PERMISSION"].ToString();

                    configView.EDIT_PERMISSION = ConfigDataLoad.Rows[i]["EDIT_PERMISSION"].ToString();
                    configView.DELETE_PERMISSION = ConfigDataLoad.Rows[i]["DELETE_PERMISSION"].ToString();
                    configView.DETAIL_VIEW = ConfigDataLoad.Rows[i]["DETAIL_VIEW"].ToString();
                    configView.DOWNLOAD_PERMISSION = ConfigDataLoad.Rows[i]["DOWNLOAD_PERMISSION"].ToString();
                }

                return JsonSerializer.Serialize(roleMenuConfigView);
            
        }

        public async Task<string> AddRoleMenuConfiguration(string db, List<Role_Menu_Configuration> roleMenuConfig)
        {
           
                List<QueryPattern> listOfQuery = new List<QueryPattern>();
                try
                {
                this.BindRoleMenuConfig(roleMenuConfig);
                int new_ID = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetNewRoleMenuConfigIdQuery(), _commonServices.AddParameter(new string[] { }));
                foreach (var model in roleMenuConfig)
                {

                    if (model.ROLE_CONFIG_ID == 0)
                    {


                        model.ID = new_ID;

                        listOfQuery.Add(_commonServices.AddQuery(AddRoleMenuConfigQuery(),
                        _commonServices.AddParameter(new string[] { model.ID.ToString(),  model.COMPANY_ID.ToString(), model.ROLE_ID.ToString(), model.MENU_ID.ToString()
                        , model.LIST_VIEW, model.ADD_PERMISSION,model.EDIT_PERMISSION, model.DETAIL_VIEW, model.DELETE_PERMISSION, model.DOWNLOAD_PERMISSION
                        , model.ENTERED_BY.ToString(), model.ENTERED_DATE, model.ENTERED_TERMINAL
                         })));
                    }
                    else
                    {
                   
                        listOfQuery.Add(_commonServices.AddQuery(AccRoleMenuConfigUpdateQuery(),
                         _commonServices.AddParameter(new string[] {  model.LIST_VIEW, model.ADD_PERMISSION,
                             model.EDIT_PERMISSION, model.DETAIL_VIEW, model.DELETE_PERMISSION, model.DOWNLOAD_PERMISSION
                        , model.UPDATED_BY.ToString(), model.UPDATED_DATE, model.UPDATED_TERMINAL, model.ROLE_CONFIG_ID.ToString()
                          })));

                    }

                    new_ID++;
                }
                await _commonServices.SaveChangesAsyn(_configuration.GetConnectionString(db), listOfQuery);

                return "1";
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            
        }


        public List<Role_Menu_Configuration> BindRoleMenuConfig(List<Role_Menu_Configuration> model)
        {
            foreach(var item in model)
            {
                item.ADD_PERMISSION = item.ADD_PERMISSION != Status.Active ? Status.InActive : Status.Active;
                item.EDIT_PERMISSION = item.EDIT_PERMISSION != Status.Active ? Status.InActive : Status.Active;
                item.DELETE_PERMISSION = item.DELETE_PERMISSION != Status.Active ? Status.InActive : Status.Active;
                item.DETAIL_VIEW = item.DETAIL_VIEW != Status.Active ? Status.InActive : Status.Active;
                item.LIST_VIEW = item.LIST_VIEW != Status.Active ? Status.InActive : Status.Active;
                item.DOWNLOAD_PERMISSION = item.DOWNLOAD_PERMISSION != Status.Active ? Status.InActive : Status.Active;
            }

            return model;
        }

        //----------------------------------Role User _Config ------------------------------------------------------------------------

        string RoleUserConfigSelectionQuery() => @"Select ROLE_ID, ROLE_NAME from Role_Info Where Company_ID = :param1";
        string RoleUserConfigQuery() => @"SELECT R.ID USER_CONFIG_ID, R.ROLE_ID, R.USER_ID, TO_CHAR(R.ENTERED_DATE, 'YYYY-MM-DD') ENTERED_DATE, TO_CHAR(R.UPDATED_DATE, 'YYYY-MM-DD') UPDATED_DATE FROM  ROLE_USER_CONFIGURATION R
                                    WHERE  R.COMPANY_ID = :param1 AND R.USER_ID = :param2";
        string RoleCentralUserConfigQuery() => @"SELECT R.ID USER_CONFIG_ID, R.ROLE_ID, R.USER_ID, TO_CHAR(R.ENTERED_DATE, 'YYYY-MM-DD') ENTERED_DATE, TO_CHAR(R.UPDATED_DATE, 'YYYY-MM-DD') UPDATED_DATE FROM  ROLE_USER_CONFIGURATION R
                                    WHERE R.USER_ID = :param1";
        string GetNewRoleUserConfigIdQuery() => "SELECT NVL(MAX(ID),0) + 1 ID  FROM ROLE_USER_CONFIGURATION";
        string AddRoleUserConfigInsertQuery() => @"Insert Into ROLE_USER_CONFIGURATION 
                                     (ID, ROLE_ID, USER_ID, PERMITTED_BY, PERMITE_DATE, COMPANY_ID, ENTERED_BY, ENTERED_DATE, ENTERED_TERMINAL)
                                     Values (:param1,:param2,:param3,:param4, TO_DATE(:param5, 'DD/MM/YYYY HH:MI:SS'),:param6,:param7,  TO_DATE(:param8, 'DD/MM/YYYY HH:MI:SS'),:param9)";
        string AddRoleUserConfigDeleteQuery() => @"DELETE from ROLE_USER_CONFIGURATION Where ID = :param1";

        public async Task<string> RoleUserConfigSelectionList(string db, int companyId, int userId)
        {

            DataTable MenuLoad = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), RoleUserConfigSelectionQuery(), _commonServices.AddParameter(new string[] { companyId.ToString() }));
            DataTable ConfigDataLoad = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), RoleUserConfigQuery(), _commonServices.AddParameter(new string[] { companyId.ToString(), userId.ToString() }));
            List<Role_User_Configuration> roleMenuConfigView = new List<Role_User_Configuration>();

            for (int i = 0; i < MenuLoad.Rows.Count; i++)
            {
                Role_User_Configuration model = new Role_User_Configuration
                {
                    ROW_NO = i + 1,

                    ROLE_ID = Convert.ToInt32(MenuLoad.Rows[i]["ROLE_ID"]),

                    ROLE_NAME = MenuLoad.Rows[i]["ROLE_NAME"].ToString()
                };

                roleMenuConfigView.Add(model);
            }

            for (int i = 0; i < ConfigDataLoad.Rows.Count; i++)
            {

                Role_User_Configuration configView = roleMenuConfigView.Where(x => x.ROLE_ID == Convert.ToInt32(ConfigDataLoad.Rows[i]["ROLE_ID"])).FirstOrDefault();
               
                configView.IS_PERMITTED = "Active";

                configView.USER_CONFIG_ID = Convert.ToInt32(ConfigDataLoad.Rows[i]["USER_CONFIG_ID"]);
                configView.ENTERED_DATE = (ConfigDataLoad.Rows[i]["ENTERED_DATE"].ToString());
                if(ConfigDataLoad.Rows[i]["USER_CONFIG_ID"]!=null && ConfigDataLoad.Rows[i]["USER_CONFIG_ID"].ToString()!="")
                {
                    configView.UPDATED_DATE = (ConfigDataLoad.Rows[i]["USER_CONFIG_ID"].ToString());

                }

            }

            return JsonSerializer.Serialize(roleMenuConfigView);

        }
        public async Task<string> RoleCentralUserConfigSelectionList(string db, int userId )
        {
            int companyId = _userManager.GetCompanyIdByUserId(db,userId);
            DataTable MenuLoad = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), RoleUserConfigSelectionQuery(), _commonServices.AddParameter(new string[] { companyId.ToString() }));
            DataTable ConfigDataLoad = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), RoleCentralUserConfigQuery(), _commonServices.AddParameter(new string[] {  userId.ToString() }));
            List<Role_User_Configuration> roleMenuConfigView = new List<Role_User_Configuration>();

            for (int i = 0; i < MenuLoad.Rows.Count; i++)
            {
                Role_User_Configuration model = new Role_User_Configuration
                {
                    ROW_NO = i + 1,

                    ROLE_ID = Convert.ToInt32(MenuLoad.Rows[i]["ROLE_ID"]),

                    ROLE_NAME = MenuLoad.Rows[i]["ROLE_NAME"].ToString()
                };

                roleMenuConfigView.Add(model);
            }

            for (int i = 0; i < ConfigDataLoad.Rows.Count; i++)
            {

                Role_User_Configuration configView = roleMenuConfigView.Where(x => x.ROLE_ID == Convert.ToInt32(ConfigDataLoad.Rows[i]["ROLE_ID"])).FirstOrDefault();

                configView.IS_PERMITTED = "Active";

                configView.USER_CONFIG_ID = Convert.ToInt32(ConfigDataLoad.Rows[i]["USER_CONFIG_ID"]);
                configView.ENTERED_DATE = (ConfigDataLoad.Rows[i]["ENTERED_DATE"].ToString());
                if (ConfigDataLoad.Rows[i]["USER_CONFIG_ID"] != null && ConfigDataLoad.Rows[i]["USER_CONFIG_ID"].ToString() != "")
                {
                    configView.UPDATED_DATE = (ConfigDataLoad.Rows[i]["USER_CONFIG_ID"].ToString());

                }

            }

            return JsonSerializer.Serialize(roleMenuConfigView);

        }

        public async Task<string> AddRoleUserConfiguration(string db, List<Role_User_Configuration> roleUserConfig)
        {

            List<QueryPattern> listOfQuery = new List<QueryPattern>();
            try
            {
              
                int new_ID = _commonServices.GetMaximumNumber<int>(_configuration.GetConnectionString(db), GetNewRoleUserConfigIdQuery(), _commonServices.AddParameter(new string[] { }));
                foreach (var model in roleUserConfig)
                {
                    if(model.USER_CONFIG_ID !=0 && model.IS_PERMITTED != Status.Active)
                    {
                        listOfQuery.Add(_commonServices.AddQuery(AddRoleUserConfigDeleteQuery(),
                                              _commonServices.AddParameter(new string[] { model.USER_CONFIG_ID.ToString(),
                                               })));
                    }
                       
                    if(model.USER_CONFIG_ID == 0 && model.IS_PERMITTED == Status.Active)
                    {

                        model.ID = new_ID;
                        listOfQuery.Add(_commonServices.AddQuery(AddRoleUserConfigInsertQuery(),
                        _commonServices.AddParameter(new string[] { model.ID.ToString(), model.ROLE_ID.ToString(), model.USER_ID.ToString(), model.PERMITTED_BY, model.PERMITE_DATE,  model.COMPANY_ID.ToString()
                        , model.ENTERED_BY.ToString(), model.ENTERED_DATE, model.ENTERED_TERMINAL
                         })));


                        new_ID++;
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
}
