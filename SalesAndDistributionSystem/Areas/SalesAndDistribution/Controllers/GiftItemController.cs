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
    public class GiftItemController : Controller
    {
        private readonly IGiftItemManager _service;
        private readonly ILogger<GiftItemController> _logger;
        private readonly IConfiguration _configuration;
        private readonly ServiceProvider Provider = new ServiceProvider();

        public GiftItemController(IGiftItemManager service, ILogger<GiftItemController> logger, IConfiguration configuration)
        {
            _service = service;
            _logger = logger;
            _configuration = configuration;
        }
        private string GetDbConnectionString() => Provider.GetConnectionString(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value.ToString(), "SalesAndDistribution");
       
        public string GetCompany() => User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value.ToString();

        [AuthorizeCheck]
        public IActionResult GiftItemInfo()
        {
            _logger.LogInformation("Gift_ItemInfo (Gift_Item/Gift_ItemInfo) Page Has been accessed By " + User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserName).Value != null ? User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserName).Value.ToString() : "Unknown User" + " ( ID= " + User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserId).Value != null ? User.Claims.FirstOrDefault(x => x.Type == ClaimsType.UserId).Value.ToString() : "");

            return View();
        }

    

        [HttpPost]
        public async Task<string> LoadData([FromBody] Gift_Item_Info Gift_Item_Info)
        {

            int comp_id = Gift_Item_Info == null || Gift_Item_Info.COMPANY_ID == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : Gift_Item_Info.COMPANY_ID;
            return await _service.LoadData(GetDbConnectionString(), comp_id);

        }

        [HttpPost]
        public async Task<string> GetSearchableGift_Item([FromBody] Gift_Item_Info Gift_Item_Info)
        {

            int comp_id = Gift_Item_Info == null || Gift_Item_Info.COMPANY_ID == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : Gift_Item_Info.COMPANY_ID;
            return await _service.GetSearchableGift_Item(GetDbConnectionString(), comp_id, Gift_Item_Info.GIFT_ITEM_NAME);

        }

        [HttpPost]
        public async Task<JsonResult> AddOrUpdate([FromBody] Gift_Item_Info model)
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
                    if (model.GIFT_ITEM_ID == 0)
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

       

        
    }
}
