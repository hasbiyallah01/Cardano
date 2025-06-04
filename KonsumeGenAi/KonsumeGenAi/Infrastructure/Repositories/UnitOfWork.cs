using Seek.Core.Application.Interfaces.Repositories;
using Seek.Infrastructure.Context;

namespace Seek.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SeekContext _context;

        public UnitOfWork(SeekContext context)
        {
            _context = context;
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
