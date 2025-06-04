using KonsumeGenAi.Core.Domain.Entities;
using Seek.Models;

namespace KonsumeGenAi.Core.Application.Interfaces.Services
{
    public interface ICompanyService
    {
        Task<BaseResponse<CompanyResponse>> GetCompany(int id);
        Task<BaseResponse<ICollection<CompanyResponse>>> GetAllCompanies();
        Task<BaseResponse<CompanyResponse>> CreateCompany(CompanyRequest request);
    }
    public interface ICompanyProductService
    {
        Task<BaseResponse<ICollection<CompanyProductsResponse>>> RegisterCompanyProducts(CompanyProductRequest request, int unitCount);
        Task<BaseResponse<CompanyProducts>> VerifyProduct(string productHashId);
        Task<BaseResponse<ICollection<CompanyProductsResponse>>> GetAllByBatchBaseAsync(string batchBase);
    }
}
