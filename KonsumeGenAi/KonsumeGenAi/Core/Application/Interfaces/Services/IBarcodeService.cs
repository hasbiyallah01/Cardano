using Seek.Models;
using SeekGenAi.Core.Domain.Entities;
using static BarcodeService;

namespace SeekGenAi.Core.Application.Interfaces.Services
{
    public interface IBarcodeService
    {
        public Task<Product> DecodeBarcodeAsync(string barcode, int Id);
        public Task<Product> Search(string productname, int id);
        Task<BaseResponse<ICollection<Product>>> GetRecentScans(int profileId);
    }
}
