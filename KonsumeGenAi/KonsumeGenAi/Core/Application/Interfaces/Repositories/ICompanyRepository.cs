using KonsumeGenAi.Core.Domain.Entities;
using Seek.Core.Domain.Entities;
using System.Linq.Expressions;

namespace KonsumeGenAi.Core.Application.Interfaces.Repositories
{
    public interface ICompanyRepository
    {
        Task<Company> AddAsync(Company user);
        Task<Company> GetUserAsync(int id);
        Task<Company> GetAsync(int id);
        Task<Company> GetAsync(Expression<Func<Company, bool>> exp);
        Task<ICollection<Company>> GetAllAsync();
        void Remove(Company user);
        Company Update(Company user);
        Task<bool> ExistsAsync(int id);
    }
}
