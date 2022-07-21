using Microsoft.Extensions.Configuration;
using SalesAndDistributionSystem.Domain.Models.TableModels.Security;
using SalesAndDistributionSystem.Domain.Models.ViewModels.Security;
using SalesAndDistributionSystem.Domain.Utility;
using SalesAndDistributionSystem.Services.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.Security
{
    public class MenuPermissionManager : IMenuPermissionManager
    {
        private readonly ICommonServices _commonServices;
        private readonly IConfiguration _configuration;
        public MenuPermissionManager(ICommonServices commonServices, IConfiguration configuration)
        {
            _commonServices = commonServices;
            _configuration = configuration;

        }

        string MenuCategoryQuery() => "select  MODULE_ID, MODULE_NAME, ORDER_BY_NO from Module_Info";
        string MenuQuery() => @"Select distinct  MENU_ID, MENU_NAME,ORDER_BY_SLNO, HREF,AREA, CONTROLLER, ACTION, PARENT_MENU_ID ,
 MODULE_ID , ADD_PERMISSION, LIST_VIEW, EDIT_PERMISSION, DELETE_PERMISSION, DETAIL_VIEW, DOWNLOAD_PERMISSION,MENU_SHOW from 

(Select distinct MC.MENU_ID, MC.MENU_NAME,MC.ORDER_BY_SLNO, MC.HREF,MC.AREA, MC.CONTROLLER, MC.ACTION, MC.PARENT_MENU_ID ,
 MC.MODULE_ID , RM.ADD_PERMISSION, RM.LIST_VIEW, RM.EDIT_PERMISSION, RM.DELETE_PERMISSION, RM.DETAIL_VIEW, RM.DOWNLOAD_PERMISSION, MC.MENU_SHOW
from ROLE_INFO R 
INNER JOIN ROLE_MENU_CONFIGURATION RM on RM.ROLE_ID = R.ROLE_ID
INNER JOIN ROLE_USER_CONFIGURATION RU on R.ROLE_ID = RU.ROLE_ID
INNER JOIN Menu_Configuration MC on MC.MENU_ID = RM.MENU_ID 
 Where MC.STATUS ='Active' AND RM.LIST_VIEW = 'Active' AND RU.USER_ID = :param2 AND RU.COMPANY_ID = :param1 
 
 UNION ALL
 
 Select distinct MC.MENU_ID, MC.MENU_NAME,MC.ORDER_BY_SLNO, MC.HREF,MC.AREA, MC.CONTROLLER, MC.ACTION, MC.PARENT_MENU_ID ,
 MC.MODULE_ID , RU.ADD_PERMISSION, RU.LIST_VIEW, RU.EDIT_PERMISSION, RU.DELETE_PERMISSION, RU.DETAIL_VIEW, RU.DOWNLOAD_PERMISSION, MC.MENU_SHOW
from  MENU_USER_CONFIGURATION RU
INNER JOIN Menu_Configuration MC on MC.MENU_ID = RU.MENU_ID 
 Where MC.STATUS ='Active' AND RU.LIST_VIEW = 'Active' AND RU.USER_ID = :param2 AND RU.COMPANY_ID = :param1 ) x";
        string defaultPageQuery() => "Select M.HREF  from USER_DEFAULT_PAGE d Left outer Join Menu_Configuration m on m.Menu_Id = D.MENU_ID Where D.USER_ID = :param1";

        string LoadPermittedMenuQuery() => "select  MENU_ID, MENU_NAME,ORDER_BY_SLNO, HREF,AREA, CONTROLLER, ACTION, PARENT_MENU_ID , MODULE_ID  from Menu_Configuration Where COMPANY_ID = :param1";

        string SearchableMenuLoadQuery() => @"Select distinct  MENU_ID, MENU_NAME,ORDER_BY_SLNO, HREF,AREA, CONTROLLER, ACTION, PARENT_MENU_ID ,
 MODULE_ID , ADD_PERMISSION, LIST_VIEW, EDIT_PERMISSION, DELETE_PERMISSION, DETAIL_VIEW, DOWNLOAD_PERMISSION from 
(Select distinct MC.MENU_ID, MC.MENU_NAME,MC.ORDER_BY_SLNO, MC.HREF,MC.AREA, MC.CONTROLLER, MC.ACTION, MC.PARENT_MENU_ID ,
 MC.MODULE_ID , RM.ADD_PERMISSION, RM.LIST_VIEW, RM.EDIT_PERMISSION, RM.DELETE_PERMISSION, RM.DETAIL_VIEW, RM.DOWNLOAD_PERMISSION
from ROLE_INFO R 
INNER JOIN ROLE_MENU_CONFIGURATION RM on RM.ROLE_ID = R.ROLE_ID
INNER JOIN ROLE_USER_CONFIGURATION RU on R.ROLE_ID = RU.ROLE_ID
INNER JOIN Menu_Configuration MC on MC.MENU_ID = RM.MENU_ID 
 Where MC.STATUS ='Active' AND RM.LIST_VIEW = 'Active'  AND RU.COMPANY_ID = :param1 AND  upper(MC.MENU_NAME) Like '%' || upper(:param2) || '%' AND MC.MENU_ID NOT IN (Select T.PARENT_MENU_ID From MENU_CONFIGURATION T) AND RU.USER_ID = :param3 
 UNION ALL
 Select distinct MC.MENU_ID, MC.MENU_NAME,MC.ORDER_BY_SLNO, MC.HREF,MC.AREA, MC.CONTROLLER, MC.ACTION, MC.PARENT_MENU_ID ,
 MC.MODULE_ID , RU.ADD_PERMISSION, RU.LIST_VIEW, RU.EDIT_PERMISSION, RU.DELETE_PERMISSION, RU.DETAIL_VIEW, RU.DOWNLOAD_PERMISSION
from  MENU_USER_CONFIGURATION RU
INNER JOIN Menu_Configuration MC on MC.MENU_ID = RU.MENU_ID 
 Where MC.STATUS ='Active' AND RU.LIST_VIEW = 'Active' AND RU.COMPANY_ID = :param1 AND  upper(MC.MENU_NAME) Like '%' || upper(:param2) || '%' AND MC.MENU_ID NOT IN (Select T.PARENT_MENU_ID From MENU_CONFIGURATION T) AND RU.USER_ID = :param3 ) x";

        public string SearchableMenuLoad(string db,string comp_id,string User_Id,string menu_name)
        {
            DataTable table = _commonServices.GetDataTable(_configuration.GetConnectionString(db), SearchableMenuLoadQuery(), _commonServices.AddParameter(new string[] { comp_id, menu_name, User_Id }));

            return _commonServices.DataTableToJSON(table);
        }

        public async Task<MenuDistribution> LoadPermittedMenuByUserId(string db,int id, int companyId)
        {
            try
            {
                List<int> ParentIDs = new List<int>();
                DataTable MenuCategoryData = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), MenuCategoryQuery(), new Dictionary<string, string>());

                DataTable MenuData = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), MenuQuery(), _commonServices.AddParameter(new string[] { id.ToString(), companyId.ToString() }));
                List<PermittedMenu> Menues = await LoadLoadPermittedMenus(db, companyId);

                List<PermittedModule> MenuCategories = new List<PermittedModule>();
                List<PermittedMenu> MenuMasters = new List<PermittedMenu>();

                for (int i = 0; i < MenuCategoryData.Rows.Count; i++)
                {
                    PermittedModule menuCategory = new PermittedModule
                    {
                        MODULE_ID = Convert.ToInt32(MenuCategoryData.Rows[i]["MODULE_ID"]),
                        ORDER_BY_NO = Convert.ToInt32(MenuCategoryData.Rows[i]["ORDER_BY_NO"].ToString()),
                        MODULE_NAME = (MenuCategoryData.Rows[i]["MODULE_NAME"].ToString())
                    };
                    MenuCategories.Add(menuCategory);
                }

                for (int i = 0; i < MenuData.Rows.Count; i++)
                {
                    PermittedMenu menuMaster = new PermittedMenu
                    {
                        MENU_ID = Convert.ToInt32(MenuData.Rows[i]["MENU_ID"]),
                        ORDER_BY_SLNO = Convert.ToInt32(MenuData.Rows[i]["ORDER_BY_SLNO"].ToString()),
                        MENU_NAME = (MenuData.Rows[i]["MENU_NAME"].ToString()),
                        HREF = (MenuData.Rows[i]["HREF"].ToString()),
                        AREA = (MenuData.Rows[i]["AREA"].ToString()),
                        MENU_SHOW = (MenuData.Rows[i]["MENU_SHOW"].ToString()),

                        CONTROLLER = (MenuData.Rows[i]["CONTROLLER"].ToString()),
                        ACTION = (MenuData.Rows[i]["ACTION"].ToString()),
                        LIST_VIEW = (MenuData.Rows[i]["LIST_VIEW"].ToString()),
                        ADD_PERMISSION = (MenuData.Rows[i]["ADD_PERMISSION"].ToString()),
                        EDIT_PERMISSION = (MenuData.Rows[i]["EDIT_PERMISSION"].ToString()),
                        DELETE_PERMISSION = (MenuData.Rows[i]["DELETE_PERMISSION"].ToString()),
                        DETAIL_VIEW = (MenuData.Rows[i]["DETAIL_VIEW"].ToString()),
                        DOWNLOAD_PERMISSION = (MenuData.Rows[i]["DOWNLOAD_PERMISSION"].ToString()),

                        MODULE_ID = Convert.ToInt32(MenuData.Rows[i]["MODULE_ID"].ToString())
                    };
                    if (MenuData.Rows[i]["PARENT_MENU_ID"] != null && MenuData.Rows[i]["PARENT_MENU_ID"].ToString() != "" )
                    {
                        menuMaster.PARENT_MENU_ID = Convert.ToInt32(MenuData.Rows[i]["PARENT_MENU_ID"]);
                        int haslisted =   ParentIDs.Where(x => x == menuMaster.PARENT_MENU_ID && menuMaster.PARENT_MENU_ID !=0).FirstOrDefault();
                        if(haslisted == 0  && menuMaster.PARENT_MENU_ID != 0)
                        {
                            ParentIDs.Add(menuMaster.PARENT_MENU_ID);

                        }
                    }
               
                    
                    MenuMasters.Add(menuMaster);
                }
                if (ParentIDs.Count > 0)
                {
                    foreach(var item in ParentIDs)
                    {
                       PermittedMenu permittedMenu = MenuMasters.Where(x => x.PARENT_MENU_ID == item).FirstOrDefault();

                        if(permittedMenu == null)
                        {
                            MenuMasters.Add(Menues.Where(x => x.MENU_ID == item).FirstOrDefault());
                        }

                    }
                }

                MenuDistribution menuDistribution = new MenuDistribution
                {
                    PermittedModules = MenuCategories,
                    PermittedMenus = MenuMasters
                };
                return menuDistribution;

            }
            catch(Exception ex)
            {
                throw ex;
            }
            
        }
        public async Task<List<PermittedMenu>> LoadLoadPermittedMenus(string db, int CompanyId)
        {
            DataTable MenuData = await _commonServices.GetDataTableAsyn(_configuration.GetConnectionString(db), LoadPermittedMenuQuery(), _commonServices.AddParameter(new string[] { CompanyId.ToString() }));

            List<PermittedMenu> MenuMasters = new List<PermittedMenu>();

       
            for (int i = 0; i < MenuData.Rows.Count; i++)
            {
                PermittedMenu menuMaster = new PermittedMenu
                {
                    MENU_ID = Convert.ToInt32(MenuData.Rows[i]["MENU_ID"]),
                    ORDER_BY_SLNO = Convert.ToInt32(MenuData.Rows[i]["ORDER_BY_SLNO"].ToString()),
                    MENU_NAME = (MenuData.Rows[i]["MENU_NAME"].ToString()),
                    HREF = (MenuData.Rows[i]["HREF"].ToString()),
                    AREA = (MenuData.Rows[i]["AREA"].ToString()),

                    CONTROLLER = (MenuData.Rows[i]["CONTROLLER"].ToString()),
                    ACTION = (MenuData.Rows[i]["ACTION"].ToString()),

                    MODULE_ID = Convert.ToInt32(MenuData.Rows[i]["MODULE_ID"].ToString())
                };
                if (MenuData.Rows[i]["PARENT_MENU_ID"] != null && MenuData.Rows[i]["PARENT_MENU_ID"].ToString() != "")
                {
                    menuMaster.PARENT_MENU_ID = Convert.ToInt32(MenuData.Rows[i]["PARENT_MENU_ID"]);

                }


                MenuMasters.Add(menuMaster);
            }
            return MenuMasters;

        }
        public string LoadUserDefaultPageById(string db, int User_Id)
        {
            DataTable MenuCategoryData =  _commonServices.GetDataTable(_configuration.GetConnectionString(db), defaultPageQuery(), _commonServices.AddParameter(new string[] { User_Id.ToString() }));
           if(MenuCategoryData!=null && MenuCategoryData.Rows.Count>0)
            {
                return MenuCategoryData.Rows[0]["HREF"].ToString();
            }
            else
            {
                return null;
            }
             
        }
      

    }
}
