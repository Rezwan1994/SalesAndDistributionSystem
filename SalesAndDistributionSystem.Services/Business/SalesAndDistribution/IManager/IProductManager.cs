using SalesAndDistributionSystem.Domain.Models.Entities.SalesAndDistribution;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.SalesAndDistribution
{
    public interface IProductManager
    {
        Task<string> LoadData(string db,int Company_Id);
        Task<string> LoadFilteredData(Price_Dtl_Param Price_Dt_Info);
        Task<string> AddOrUpdate(string db, Product_Info model);
        Task<string> GetSearchableProduct(string db, int Company_Id, string product) ;
        Task<string> GenerateProductCode(string db, string Company_Id);
        Task<DataTable> LoadDataTable(string db, int Company_Id);
    }
}
