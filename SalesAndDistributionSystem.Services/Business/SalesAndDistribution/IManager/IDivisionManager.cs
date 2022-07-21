using SalesAndDistributionSystem.Domain.Models.Entities.SalesAndDistribution;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.SalesAndDistribution
{
    public interface IDivisionManager
    {
        Task<string> LoadData(string db,int Company_Id);
        Task<string> AddOrUpdate(string db, Division_Info model);
        Task<string> GenerateDivisionCode(string db, string Company_Id);
        Task<string> GetSearchableDivision(string db, int Company_Id, string division) ;

    }
}
