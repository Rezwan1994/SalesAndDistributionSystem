using FastReport.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Oracle.ManagedDataAccess.Client;
using SalesAndDistributionSystem.Services.Business.Company;
using SalesAndDistributionSystem.Services.Business.SalesAndDistribution;
using SalesAndDistributionSystem.Services.Business.SalesAndDistribution.IManager;
using SalesAndDistributionSystem.Services.Business.SalesAndDistribution.Manager;
using SalesAndDistributionSystem.Services.Business.Security;
using SalesAndDistributionSystem.Services.Business.User;
using SalesAndDistributionSystem.Services.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Odbc;
using System.Data;
using System.Data.Common;
using DinkToPdf.Contracts;
using DinkToPdf;
using SalesAndDistributionSystem.Services.ReportSpecifier;

namespace SalesAndDistributionSystem
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            FastReport.Utils.RegisteredObjects.AddConnection(typeof(OdbcDataConnection));

            services.AddControllersWithViews();
            services.AddSession();
            services.AddMvc();
            services.AddSingleton<IConfiguration>(Configuration);
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IReportSpecifier, ReportSpecifier>();



            //-------Security Module -------------------------------
            services.AddTransient<ICommonServices, CommonServices>();
            services.AddTransient<IUserManager, UserManager>();
            services.AddTransient<IMenuCategoryManager, MenuCategoryManager>();
            services.AddTransient<IMenuMasterManager, MenuMasterManager>();
            services.AddTransient<IMenuPermissionManager, MenuPermissionManager>();
            services.AddTransient<ICompanyManager, CompanyManager>();
            services.AddTransient<IRoleManager, RoleManager>();
            services.AddTransient<IUserMenuConfigManager, UserMenuConfigManager>();
            services.AddTransient<IEmailService,EmailService>();
            services.AddTransient<IReportConfigurationManager, ReportConfigurationManager>();

            //--------------Sales And Distribution Module ----------------------


            //--Sales And Distribution Module - location services

            services.AddTransient<IDivisionManager, DivisionManager>();
            services.AddTransient<IRegionManager, RegionManager>();
            services.AddTransient<IAreaManager, AreaManager>();
            services.AddTransient<ICustomerPriceInfoManager, CustomerPriceInfoManager>();
            services.AddTransient<IMarketManager, MarketManager>();
            services.AddTransient<ITerritoryManager, TerritoryManager>();


            //--Sales And Distribution Module - location Relation services
            services.AddTransient<IDivisionRegionRelationManager, DivisionRegionRelationManager>();
            services.AddTransient<IRegionAreaRelationManager, RegionAreaRelationManager>();
            services.AddTransient<IAreaTerritoryRelationManager, AreaTerritoryRelationManager>();
            services.AddTransient<ITerritoryMarketRelationManager, TerritoryMarketRelationManager>();


                    //--Sales And Distribution Module - product configuration serivces
            services.AddTransient<IBrandManager, BrandManager>();
            services.AddTransient<IBaseProductManager, BaseProductManager>();
            services.AddTransient<ICategoryManager, CategoryManager>();
            services.AddTransient<IGroupManager, GroupManager>();
            services.AddTransient<IInvoiceTypeManager, InvoiceTypeManager>();
            services.AddTransient<IPrimaryProductManager, PrimaryProductManager>();
            services.AddTransient<IProductTypeManager, ProductTypeManager>();
            services.AddTransient<IPackSizeManager, PackSizeManager>();
            services.AddTransient<IProductSeasonManager, ProductSeasonManager>();
            services.AddTransient<IStorageManager, StorageManager>();
            services.AddTransient<IMeasuringUnitManager, MeasuringUnitManager>();
            services.AddTransient<IProductManager, ProductManager>();
            services.AddTransient<IProductPriceManager, ProductPriceManager>();
            services.AddTransient<IBonusManager, BonusManager>();
            services.AddTransient<ICustomerMarketRelationManager, CustomerMarketRelationManager>();
            services.AddTransient<IGiftItemManager, GiftItemManager>();


            //--Sales And Distribution Module - Customer configuration serivces

            services.AddTransient<ICustomerTypeManager, CustomerTypeManager>();
            services.AddTransient<IPriceTypeManager, PriceTypeManager>();
            services.AddTransient<ICustomerManager, CustomerManager>();

            //--Sales And Distribution Module - Report serivces
            services.AddTransient<IReportManager, ReportManager>();


            services.AddControllers(x => x.AllowEmptyInputInBodyModelBinding = true);

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(x=>x.LoginPath="/Security/Login/Index");
            services.AddSession(options => {
                options.IdleTimeout = TimeSpan.FromMinutes(1440);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });


        }


      

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                {
                    context.Request.Path = "/Home/NotFound404";
                    await next();
                }
            });
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSession();
            app.UseRouting();
            app.UseCookiePolicy(new CookiePolicyOptions()
            {
                MinimumSameSitePolicy = SameSiteMode.Strict
            });

            //app.UseFastReport();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseRouting();
            
            app.UseAuthorization();
           
            app.UseEndpoints(endpoints =>
            {
                
                 endpoints.MapAreaControllerRoute(
                  name: "SalesAndDistribution",
                  areaName: "SalesAndDistribution",

                  pattern: "SalesAndDistribution/{controller=Division}/{action=DivisionInfo}");
                endpoints.MapAreaControllerRoute(
                  name: "Security",
                  areaName: "Security",

                  pattern: "Security/{controller=Login}/{action=Index}");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
            var path = Directory.GetCurrentDirectory();
            loggerFactory.AddFile($"{path}\\Logs\\Log.txt");
        }


       
     }
    public class OdbcDataConnection : FastReport.Data.DataConnectionBase
    {
        public override string QuoteIdentifier(string value, System.Data.Common.DbConnection connection)
        {
            return "\"" + value + "\"";

        }

        public override System.Type GetConnectionType()
        {
            return typeof(OdbcConnection);
        }

        public override System.Type GetParameterType()
        {
            return typeof(OracleDbType);
        }

        public override System.Data.Common.DbDataAdapter GetAdapter(string selectCommand, System.Data.Common.DbConnection connection, FastReport.Data.CommandParameterCollection parameters)
        {
            //using (OracleCommand oraCommand = new OracleCommand())
            //{
            //    using (oraCommand.Connection = new DBManager().getConnection())
            //    {
            //        oraCommand.CommandText = sql;
            //        oraCommand.Parameters.Add(":port_id", portID);
            //        intCount = oraCommand.ExecuteScalar();
            //    }
            //}


            using OracleConnection obcon = new OracleConnection("Data Source=(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 172.16.243.234)(PORT = 1521)))(CONNECT_DATA =(SERVICE_NAME=silsqadb1.squaregroup.com)(SERVER = DEDICATED)));User Id=STL_ERP_SDS;Password=STL_SDS");
            using OracleDataAdapter adapter = new OracleDataAdapter(selectCommand, obcon as OracleConnection);
            foreach (FastReport.Data.CommandParameter p in parameters)
            {
                OracleParameter parameter = adapter.SelectCommand.Parameters.Add(p.Name, (OracleDbType)p.DataType, p.Size);
                parameter.Value = p.Value;

            }
            return adapter;
        }
        public override void FillTableData(DataTable table, string selectCommand, CommandParameterCollection parameters)
        {
            System.Data.Common.DbConnection connection = GetConnection();
            try
            {
                using OracleConnection obcon = new OracleConnection("Data Source=(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 172.16.243.234)(PORT = 1521)))(CONNECT_DATA =(SERVICE_NAME=silsqadb1.squaregroup.com)(SERVER = DEDICATED)));User Id=STL_ERP_SDS;Password=STL_SDS");
                using OracleDataAdapter dataAdapter = new OracleDataAdapter(selectCommand, obcon as OracleConnection);
                foreach (FastReport.Data.CommandParameter p in parameters)
                {
                    OracleParameter parameter = dataAdapter.SelectCommand.Parameters.Add(p.Name, (OracleDbType)p.DataType, p.Size);
                    parameter.Value = p.Value;

                }
                DataTable dt = new DataTable();
                dataAdapter.Fill(dt);
              
            }
            finally
            {
                DisposeConnection(connection);
            }

        }
       
    }
}
