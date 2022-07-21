using SalesAndDistributionSystem.Domain.Models.Entities.SalesAndDistribution;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.SalesAndDistribution
{
    public interface ICustomerManager
    {
        Task<string> LoadData(string db, int Company_Id);
        Task<string> LoadActiveCustomerData(string db, int Company_Id);
        Task<string> AddOrUpdate(string db, Customer_Info model);
        Task<string> GetSearchableCustomer(string db, int Company_Id, string customer);
        Task<string> GenerateCustomerCode(string db, string Company_Id, string Company_Name);
    }
}
