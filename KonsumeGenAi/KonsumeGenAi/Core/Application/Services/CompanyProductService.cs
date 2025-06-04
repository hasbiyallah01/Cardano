using Google.Apis.Auth;
using Seek.Core.Application.Interfaces.Repositories;
using System.Security.Claims;
using KonsumeGenAi.Core.Application.Interfaces.Services;
using KonsumeGenAi.Core.Domain.Entities;
using KonsumeGenAi.Core.Application.Interfaces.Repositories;
using Seek.Models;
using System.Text;
using System.Security.Cryptography;

namespace KonsumeGenAi.Core.Application.Services
{
    public class CompanyProductService : ICompanyProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICompanyProductsRepository _companyProductsRepository;
        private readonly ICompanyRepository _company;
        public CompanyProductService( ICompanyRepository company,IUnitOfWork unitOfWork,ICompanyProductsRepository companyProductsRepository)
        {
            _unitOfWork = unitOfWork;
            _companyProductsRepository = companyProductsRepository;
            _company = company;
        }

        public async Task<BaseResponse<ICollection<CompanyProductsResponse>>> RegisterCompanyProducts(CompanyProductRequest request, int unitCount)
        {
            var company = await _company.GetAsync(request.CompanyId);
            if (company == null)
            {
                return new BaseResponse<ICollection<CompanyProductsResponse>>
                {
                    IsSuccessful = false,
                    Message = "Company doesn’t exist",
                    Value = null
                };
            }

            string companyName = company.Name.ToLower().Replace(" ", "_");
            string productName = request.ProductName.ToLower().Replace(" ", "_");

            string baseBatchId = $"{companyName}_{productName}_{unitCount}";

            var productList = new List<CompanyProducts>();
            var responseList = new List<CompanyProductsResponse>();

            for (int i = 1; i <= unitCount; i++)
            {
                string raw = $"{request.ProductName}-{Guid.NewGuid()}";

                using var sha256 = SHA256.Create();
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(raw));
                string hashString = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

                var product = new CompanyProducts
                {
                    CompanyId = request.CompanyId,
                    ProductName = request.ProductName,
                    IsDeleted = false,
                    BatchId = baseBatchId,
                    Hash = hashString,
                    IsOriginal = true,
                    Ingredients = string.Join(",", request.Ingredients),
                    Manufacturer = request.Manufacturer,
                    ProductionDate = request.ProductionDate,
                    ExpiryDate = request.ExpiryDate,
                };

                productList.Add(product);

                responseList.Add(new CompanyProductsResponse
                {
                    BatchId = product.BatchId,
                    ProdRes = new CompanyProdRes 
                    {
                        CompanyId = product.CompanyId,
                        ProductName = product.ProductName,
                        IsOriginal = product.IsOriginal,
                        Hash = product.Hash,
                        Ingredients = product.Ingredients,
                        Manufacturer = product.Manufacturer,
                        ProductionDate = product.ProductionDate,
                        ExpiryDate = product.ExpiryDate,
                    }
                });
            }

            await _companyProductsRepository.AddRangeAsync(productList);
            await _unitOfWork.SaveAsync();

            return new BaseResponse<ICollection<CompanyProductsResponse>>
            {
                IsSuccessful = true,
                Message = $"{unitCount} units of '{request.ProductName}' registered successfully with batch ID format '{baseBatchId}-XXX'.",
                Value = responseList
            };
        }



        public async Task<BaseResponse<CompanyProducts>> VerifyProduct(string productHashId)
        {
            var product = await _companyProductsRepository.GetAsync(p => p.Hash == productHashId);

            if (product == null)
            {
                return new BaseResponse<CompanyProducts>
                {
                    IsSuccessful = false,
                    Message = "Product not found",
                };
            }

            if (!product.IsOriginal)
            {
                return new BaseResponse<CompanyProducts>
                {
                    IsSuccessful = true,
                    Message = "This product has already been used. It may be counterfeit.",
                    Value = new CompanyProducts
                    {
                        Id = product.Id,
                        ProductName = product.ProductName,
                        BatchId = product.BatchId,
                        Manufacturer = product.Manufacturer,
                        ProductionDate = product.ProductionDate,
                        ExpiryDate = product.ExpiryDate,
                        Hash = product.Hash,
                        CompanyId = product.CompanyId,
                        Ingredients = product.Ingredients,
                        IsDeleted = product.IsDeleted,
                        IsOriginal = false
                    }
                };
            }

            product.IsOriginal = false;
            await _companyProductsRepository.UpdateAsync(product);
            await _unitOfWork.SaveAsync();

            return new BaseResponse<CompanyProducts>
            {
                IsSuccessful = true,
                Message = "Product is original and verified",
                Value = new CompanyProducts
                {
                    Id = product.Id,
                    ProductName = product.ProductName,
                    BatchId = product.BatchId,
                    Manufacturer = product.Manufacturer,
                    ProductionDate = product.ProductionDate,
                    Hash = product.Hash,
                    ExpiryDate = product.ExpiryDate,
                    IsOriginal = true,
                    IsDeleted = product.IsDeleted,
                    CompanyId = product.CompanyId
                }
            };
        }

        public async Task<BaseResponse<ICollection<CompanyProductsResponse>>> GetAllByBatchBaseAsync(string batchBase)
        {
            var products = await _companyProductsRepository.GetAllByBatchIdAsync(batchBase);

            if (products == null || products.Count == 0)
            {
                return new BaseResponse<ICollection<CompanyProductsResponse>>
                {
                    IsSuccessful = false,
                    Message = "No products found for the given batch.",
                    Value = null
                };
            }

            var responseList = products.Select(p => new CompanyProductsResponse
            {
                BatchId = p.BatchId,
                ProdRes = new CompanyProdRes
                {
                    CompanyId = p.CompanyId,
                    ProductName = p.ProductName,
                    IsOriginal = p.IsOriginal,
                    Hash = p.Hash,
                    Ingredients = p.Ingredients,
                    Manufacturer = p.Manufacturer,
                    ProductionDate = p.ProductionDate,
                    ExpiryDate = p.ExpiryDate
                }
            }).ToList();

            return new BaseResponse<ICollection<CompanyProductsResponse>>
            {
                IsSuccessful = true,
                Message = $"Found {responseList.Count} product(s) for batch '{batchBase}'.",
                Value = responseList
            };
        }


    }
}
