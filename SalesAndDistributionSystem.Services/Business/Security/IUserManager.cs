using SalesAndDistributionSystem.Domain.Common;
using SalesAndDistributionSystem.Domain.Models.TableModels.Security;
using SalesAndDistributionSystem.Domain.Models.TableModels.User;
using SalesAndDistributionSystem.Domain.Models.ViewModels.Security;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SalesAndDistributionSystem.Services.Business.User
{
    public interface IUserManager
    {
        Auth GetUserByEmailAndCompany(string db, string Email,int CompanyId);

        Auth GetUserByEmail(string db, string Email);
        int GetCompanyIdByUserId(string db, int userId);

        bool IsValidUser(string db, string Email, string password, int CompanyId, string HashPass);
        string GetUserByCompanyJsonList(string db, string Company);
        Task<string> AddOrUpdate(string db, User_Info model, string ServerPath);
        string GetUsers(string db);
        string GetEmployeesWithoutAccount(string db,int CompanyId);

        string GetUsersByCompany(string db, int CompanyId);
        
        Task<string> LoadSearchableDefaultPages(string db, int companyId, string defaultpage);
        Task<string> LoadDefaultPages(string db, int companyId);
        Task<string> AddOrUpdateDefaultPage(string db, Default_Page model);
        Task<string> UpdateUserPassword(string db,PasswordChangeModel changeModel);
        User_Info IsVerified(string db, string UniquKey);
        Task<string> ForgetPasswordVerify(string db, PasswordChangeModel changeModel);

    }
}
