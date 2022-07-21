using FastReport.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SalesAndDistributionSystem.Common;
using Oracle.ManagedDataAccess.Client;
using System.Linq;
using ServiceProvider = SalesAndDistributionSystem.Common.ServiceProvider;
using SalesAndDistributionSystem.Domain.Utility;
using System.IO;
using Microsoft.Extensions.Hosting;
using FastReport.Data;
using FastReport.Utils;
using SalesAndDistributionSystem.Services.Business.SalesAndDistribution;
using SalesAndDistributionSystem.Services.Common;

using System;
using AspNetCore.Reporting;
using System.Collections.Generic;
using System.Data.Odbc;
using DinkToPdf;
using DinkToPdf.Contracts;
using SalesAndDistributionSystem.Domain.Common;
using System.Threading.Tasks;
using SalesAndDistributionSystem.Services.ReportSpecifier;
using ClosedXML.Excel;
using System.Data;
using SalesAndDistributionSystem.Services.Business.Security;
using SalesAndDistributionSystem.Domain.Models.ViewModels.Security;
using SalesAndDistributionSystem.Domain.Models.Entities.Security;
using SalesAndDistributionSystem.Domain.Models.ViewModels.SalesAndDistributionSystem;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace SalesAndDistributionSystem.Areas.SalesAndDistribution.Controllers
{
    [Area("SalesAndDistribution")]
    public class ReportController : Controller
    {
        private readonly ILogger<ReportController> _logger;
        private readonly IReportManager _reportService;
        private readonly IConverter _converter;
        private readonly IReportSpecifier _reportSpecifier;
        private readonly ICommonServices _commonService;
        private readonly IReportConfigurationManager _reportManager;


        private readonly ServiceProvider Provider = new ServiceProvider();
        
        public ReportController(ILogger<ReportController> logger, IReportManager reportService, IConverter converter, IReportSpecifier reportSpecifier, ICommonServices commonService, IReportConfigurationManager reportManager)
        {
            _logger = logger;
            _reportService = reportService;
            _converter = converter;
            _reportSpecifier = reportSpecifier;
            _commonService = commonService;
            _reportManager = reportManager;
        }
        private string GetDbConnectionString() => Provider.GetConnectionString(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value.ToString(), "SalesAndDistribution", "Operation");
        private string GetDbConnectionStringSecurity() => Provider.GetConnectionString(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value.ToString(), "Security", "Operation");

        public string GetCompany() => User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value.ToString();
        public IActionResult Index()
        {
           
            return View();
        }
        public IActionResult GetReports()
        {
            List<ReportDataSpecify> reportData = _reportSpecifier.GetReportList();
            foreach (ReportDataSpecify reportDataSpecify in reportData)
            {
                reportDataSpecify.ReportIdEncrypt = _commonService.Encrypt(reportDataSpecify.ReportId.ToString());
            }
            return View(reportData);
        }


        public async Task<IActionResult> ProductReport()
        {
            int User_id = Convert.ToInt32(User.Claims.Where(x => x.Type == ClaimsType.UserId).FirstOrDefault().Value);

            int Comp_id = Convert.ToInt32(User.Claims.Where(x => x.Type == ClaimsType.CompanyId).FirstOrDefault().Value);
            List<ReportPermission> reportData = await _reportManager.LoadReportPermissionData(GetDbConnectionStringSecurity(),Comp_id, User_id);
            foreach (ReportPermission reportDataSpecify in reportData)
            {
                reportDataSpecify.ReportIdEncrypt = _commonService.Encrypt(reportDataSpecify.REPORT_ID.ToString());

            }
            return View(reportData);
        }

        [HttpPost]
        public async Task<string> LoadData([FromBody] Report_Configuration report_Info)
        {

            int comp_id = report_Info == null || report_Info.COMPANY_ID == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : report_Info.COMPANY_ID;
            return await _reportManager.LoadData(GetDbConnectionStringSecurity(), comp_id);

        }


        [HttpGet]
        public async Task<IActionResult> CreatePDF(string ReportId, string Color, ProductReportParameters reportParameters, string IsLogoApplicable = "Yes", string IsCompanyApplicable = "Yes", int companyId = 0)
        {
            int comp_id  = companyId == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : companyId;
            string User_Name = User.Claims.Where(x => x.Type == ClaimsType.UserName).FirstOrDefault().Value;
            string User_Id = User.Claims.Where(x => x.Type == ClaimsType.UserId).FirstOrDefault().Value;
            ReportDataGenerator reportData = await  _reportService.GeneratePDF(ReportId, GetDbConnectionString(),comp_id, IsLogoApplicable, IsCompanyApplicable, reportParameters, Convert.ToInt32(User_Id), GetDbConnectionStringSecurity());
            var globalSettings = new GlobalSettings
            {
                ColorMode = Color == "Color"? ColorMode.Color : Color == "Grayscale"? ColorMode.Grayscale : reportData.ColorMode == "Color"? ColorMode.Color : ColorMode.Grayscale,
                Orientation = reportData.PageOrientation == "Landscape"? Orientation.Landscape : Orientation.Portrait,
                PaperSize = reportData.PaperKind == "Letter"? PaperKind.Letter: reportData.PaperKind == "A4" ? PaperKind.A4 : reportData.PaperKind == "Legal" ? PaperKind.Legal : PaperKind.LegalExtra,
                Margins = new MarginSettings { Top = reportData.MarginTop  },
                DocumentTitle = reportData.DocumentTitle,
            };
            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                HtmlContent = reportData.HtmlContentData,
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot", "css", "ReportStyle.css") },
                FooterSettings  = { FontName = "Arial", FontSize = 9, Center = "Powered by: Square Informatix Ltd - 2022", Right = "Page [page] of [toPage]", Left = "Printed By: "+ User_Name, Line = true, Spacing = 1.8 },
                HeaderSettings = { FontName = "Arial", FontSize = 9, Line = true,  Spacing = 1.8 }
            };
            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };
           var file =  _converter.Convert(pdf);
            return File(file, "application/pdf");
        }


        [HttpGet]
        public async Task<IActionResult> ReportPreview(string ReportId, ProductReportParameters reportParameters, string IsLogoApplicable = "Yes", string IsCompanyApplicable = "Yes", int companyId = 0)
        {
            int comp_id = companyId == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : companyId;
            string User_Name = User.Claims.Where(x => x.Type == ClaimsType.UserName).FirstOrDefault().Value;
            string User_Id = User.Claims.Where(x => x.Type == ClaimsType.UserId).FirstOrDefault().Value;

            ReportDataGenerator reportData = await _reportService.GeneratePDF(ReportId, GetDbConnectionString(), comp_id, IsLogoApplicable, IsCompanyApplicable,reportParameters,Convert.ToInt32(User_Id), GetDbConnectionStringSecurity());
            ViewBag.ReportParameters = reportParameters;
            ViewBag.ReportId = ReportId;
            ViewBag.IsLogoApplicable = IsLogoApplicable;

            ViewBag.IsCompanyApplicable = IsCompanyApplicable;
            ViewBag.companyId = companyId;

            return View(reportData);
        }
        [HttpGet]
        public async Task<IActionResult> ReportExcel(string ReportId, ProductReportParameters reportParameters, int companyId = 0)
        {
            using (XLWorkbook wb = new XLWorkbook())
            {
                int comp_id = companyId == 0 ? Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimsType.CompanyId).Value) : companyId;

                DataSet dt =await _reportService.GenerateExcel(ReportId,GetDbConnectionString(), comp_id,reportParameters);
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  "_ExcelReport.xlsx");
                }
            }



            
        }
        //load report View permission

        [HttpPost]
        public string IsReportPermitted([FromBody] ReportPermission report)
        {
            List<ReportPermission> reportPermissions = JsonSerializer.Deserialize<List<ReportPermission>>(HttpContext.Session.GetString(ClaimsType.ReportPermission));
            return JsonSerializer.Serialize(_reportManager.IsReportPermitted(report.REPORT_ID, reportPermissions));

        }
    }
}
