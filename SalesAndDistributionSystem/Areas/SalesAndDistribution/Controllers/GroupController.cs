﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SalesAndDistributionSystem.Common;
using SalesAndDistributionSystem.Domain.Models.Entities.SalesAndDistribution;
using SalesAndDistributionSystem.Domain.Utility;
using SalesAndDistributionSystem.Services.Business.SalesAndDistribution;
using SalesAndDistributionSystem.Services.Business.Security;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Areas.SalesAndDistribution.Controllers
{
    [Area("SalesAndDistribution")]
    public class GroupController : Controller
    {
        private readonly IGroupManager _service;
        private readonly ILogger<GroupController> _logger;
        private readonly IConfiguration _configuration;
        private readonly ServiceProvider Provider = new ServiceProvider();

        public GroupController(IGroupManager service, ILogger<GroupController> logger, IConfiguration configuration)
        {
            _service = service;
            _logger = logger;
            _configuration = configuration;
        }
        private string GetDbConnectionString() => Provider.GetConnectionString(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value.ToString(), "SalesAndDistribution");
       
        public string GetCompany() => User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value.ToString();

        [AuthorizeCheck]
        public IActionResult GroupInfo()
        {
            _logger.LogInformation("GroupInfo (Group/GroupInfo) Page Has been accessed By " + User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserName).Value != null ? User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserName).Value.ToString() : "Unknown User" + " ( ID= " + User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserId).Value != null ? User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserId).Value.ToString() : "");

            return View();
        }

    

        [HttpPost]
        public async Task<string> LoadData([FromBody] Group_Info group_Info)
        {

            int comp_id = group_Info == null || group_Info.COMPANY_ID == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : group_Info.COMPANY_ID;
            return await _service.LoadData(GetDbConnectionString(), comp_id);

        }

        [HttpPost]
        public async Task<string> GetSearchableGroup([FromBody] Group_Info group_Info)
        {

            int comp_id = group_Info == null || group_Info.COMPANY_ID == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : group_Info.COMPANY_ID;
            return await _service.GetSearchableGroup(GetDbConnectionString(), comp_id, group_Info.GROUP_NAME);

        }

        [HttpPost]
        public async Task<JsonResult> AddOrUpdate([FromBody] Group_Info model)
        {
            string result = "";

            if (model == null)
            {
                result = "No Changes Found!";
            }
            else
            {
                try
                {
                    if (model.GROUP_ID == 0)
                    {
                        model.ENTERED_BY = User.Claims.FirstOrDefault(c => c.Type == ClaimsType.UserId)?.Value;
                        model.ENTERED_DATE = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
                        model.ENTERED_TERMINAL = HttpContext.Connection.RemoteIpAddress.ToString();

                        model.COMPANY_ID = model.COMPANY_ID == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : model.COMPANY_ID;

                    }
                    else
                    {
                        model.UPDATED_BY = User.Claims.FirstOrDefault(c => c.Type == ClaimsType.UserId)?.Value;
                        model.UPDATED_DATE = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
                        model.UPDATED_TERMINAL = HttpContext.Connection.RemoteIpAddress.ToString();
                    }

                    result = await _service.AddOrUpdate(GetDbConnectionString(), model);

                }
                catch (Exception ex)
                {
                    result = ex.Message;
                }

            }


            return Json(result);


        }

        //---------------Other Methods --------------------
        [HttpPost]
        public async Task<string> GenerateGroupCode([FromBody] Group_Info group_Info)
        {
            int comp_id = group_Info == null || group_Info.COMPANY_ID == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : group_Info.COMPANY_ID;
            return await _service.GenerateGroupCode(GetDbConnectionString(), comp_id.ToString());
          
        }

        
    }
}
