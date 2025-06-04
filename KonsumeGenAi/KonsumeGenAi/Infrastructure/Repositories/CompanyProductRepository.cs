using KonsumeGenAi.Core.Application.Interfaces.Repositories;
using KonsumeGenAi.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Seek.Core.Domain.Entities;
using Seek.Infrastructure.Context;
using System.Linq.Expressions;

namespace KonsumeGenAi.Infrastructure.Repositories
{
    public class CompanyProductRepository : ICompanyProductsRepository
    {
        private readonly SeekContext _context;
        public CompanyProductRepository(SeekContext context)
        {
            _context = context;
        }

        public async Task AddRangeAsync(IEnumerable<CompanyProducts> products)
        {
            await _context.CompanyProducts.AddRangeAsync(products);
        }

        public async Task<CompanyProducts> AddAsync(CompanyProducts user)
        {
            await _context.Set<CompanyProducts>()
                .AddAsync(user);
            return user;
        }
        public async Task UpdateAsync(CompanyProducts product)
        {
            _context.CompanyProducts.Update(product);
            await Task.CompletedTask; 
        }


        public async Task<bool> ExistsAsync( int id)
        {
            return await _context.CompanyProducts.AnyAsync(x =>  x.Id != id);
        }
        public async Task<ICollection<CompanyProducts>> GetAllAsync()
        {
            var answer = await _context.Set<CompanyProducts>()
                            .ToListAsync();
            return answer;
        }

        public async Task<CompanyProducts> GetAsync(int id)
        {
            var answer = await _context.Set<CompanyProducts>()
                        .Where(a => !a.IsDeleted && a.Id == id)
                        .SingleOrDefaultAsync();
            return answer;
        }

        public async Task<CompanyProducts> GetAsync(Expression<Func<CompanyProducts, bool>> exp)
        {
            var answer = await _context.Set<CompanyProducts>()
                        .Where(a => !a.IsDeleted)
                        .SingleOrDefaultAsync(exp);
            return answer;
        }

        public void Remove(CompanyProducts answer)
        {
            answer.IsDeleted = true;
            _context.Set<CompanyProducts>()
                .Update(answer);
            _context.SaveChanges();
        }

        public async Task<ICollection<CompanyProducts>> GetAllByBatchIdAsync(string batchId)
        {
            return await _context.CompanyProducts
                .Where(x => x.BatchId == batchId)
                .ToListAsync();
        }


    }
}
