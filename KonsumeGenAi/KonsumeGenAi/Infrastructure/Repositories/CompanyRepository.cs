using KonsumeGenAi.Core.Application.Interfaces.Repositories;
using KonsumeGenAi.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Seek.Core.Domain.Entities;
using Seek.Infrastructure.Context;
using System.Linq.Expressions;

namespace KonsumeGenAi.Infrastructure.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {

        private readonly SeekContext _context;
        public CompanyRepository(SeekContext context)
        {
            _context = context;
        }

        public async Task<Company> AddAsync(Company user)
        {
            await _context.Set<Company>()
                .AddAsync(user);
            return user;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Companies.AnyAsync(x => x.Id != id);
        }

        public Company Update(Company entity)
        {
            _context.Companies.Update(entity);
            return entity;
        }

        public async Task<ICollection<Company>> GetAllAsync()
        {
            var answer = await _context.Set<Company>()
                            .ToListAsync();
            return answer;
        }

        public async Task<Company> GetAsync(int id)
        {
            var answer = await _context.Set<Company>()
                        .Where(a => !a.IsDeleted && a.Id == id)
                        .SingleOrDefaultAsync();
            return answer;
        }
        public async Task<Company> GetUserAsync(int id)
        {
            var answer = await _context.Set<Company>()
                        .Where(a => !a.IsDeleted && a.UserId == id)
                        .SingleOrDefaultAsync();
            return answer;
        }

        public async Task<Company> GetAsync(Expression<Func<Company, bool>> exp)
        {
            var answer = await _context.Set<Company>()
                        .Where(a => !a.IsDeleted)
                        .SingleOrDefaultAsync(exp);
            return answer;
        }

        public void Remove(Company answer)
        {
            answer.IsDeleted = true;
            _context.Set<Company>()
                .Update(answer);
            _context.SaveChanges();
        }
    }
}
