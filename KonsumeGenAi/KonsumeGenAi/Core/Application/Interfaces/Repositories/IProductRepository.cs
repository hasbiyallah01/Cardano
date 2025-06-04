using Seek.Core.Domain.Entities;
using SeekGenAi.Core.Domain.Entities;

namespace SeekGenAi.Core.Application.Interfaces.Repositories
{
    public interface IProductRepository
    {
        Task<Product> GenerateProductAsync(Product scannedProduct);
        Task<ICollection<Product>> GetProductByProfileIdAsync(int profileId);
        Task<Product> GetProductByIdAsync(int productId);
    }
}
