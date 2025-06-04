using KonsumeGenAi.Core.Domain.Entities;
using Seek.Core.Domain.Entities;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace KonsumeGenAi.Core.Application.Interfaces.Repositories
{
    public interface ICompanyProductsRepository
    {
        Task AddRangeAsync(IEnumerable<CompanyProducts> products);
        Task<CompanyProducts> AddAsync(CompanyProducts user);
        Task<CompanyProducts> GetAsync(int id);
        Task<CompanyProducts> GetAsync(Expression<Func< CompanyProducts, bool>> exp);
        Task<ICollection<CompanyProducts>> GetAllAsync();
        Task<ICollection<CompanyProducts>> GetAllByBatchIdAsync(string BatchId);
        void Remove(CompanyProducts user);
        Task UpdateAsync(CompanyProducts product);
        Task<bool> ExistsAsync(int id);
    }
}
