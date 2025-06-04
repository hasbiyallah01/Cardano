using Seek.Core.Domain.Entities;
using Seek.Infrastructure.Context;
using SeekGenAi.Core.Application.Interfaces.Repositories;
using SeekGenAi.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace SeekGenAi.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {

        private readonly SeekContext _context;

        public ProductRepository(SeekContext context)
        {
            _context = context;
        }


        public async Task<Product> GenerateProductAsync(Product mealPlan)
        {
            if (_context == null) throw new ObjectDisposedException(nameof(SeekContext));

            await _context.Set<Product>().AddAsync(mealPlan);
            await _context.SaveChangesAsync();

            return mealPlan; 
        }

        public async Task<ICollection<Product>> GetProductByProfileIdAsync(int profileId)
        {
            return await _context.Products
                .Where(mp => mp.ProfileId == profileId)
                .Include(mp => mp.Alternatives)
                .Include(mp => mp.Ingredients)
                .ToListAsync();
        }



        public async Task<Product> GetProductByIdAsync(int mealId)
        {
            return await _context.Products
                .Include(mp => mp.Alternatives)
                .Include(mp => mp.Ingredients)
                .FirstOrDefaultAsync(mp => mp.Id == mealId);
        }
    }
}
