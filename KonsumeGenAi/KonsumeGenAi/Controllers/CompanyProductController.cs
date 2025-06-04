using Microsoft.AspNetCore.Mvc;
using KonsumeGenAi.Core.Application.Services;
using Seek.Models;
using System.Threading.Tasks;
using KonsumeGenAi.Core.Domain.Entities;
using KonsumeGenAi.Core.Application.Interfaces.Services;

namespace KonsumeGenAi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyProductController : ControllerBase
    {
        private readonly ICompanyProductService _companyProductService;

        public CompanyProductController(ICompanyProductService companyProductService)
        {
            _companyProductService = companyProductService;
        }

        // POST: api/companyproduct/register/{unitCount}
        [HttpPost("register/{unitCount}")]
        public async Task<IActionResult> RegisterCompanyProducts([FromBody] CompanyProductRequest request, int unitCount)
        {
            var response = await _companyProductService.RegisterCompanyProducts(request, unitCount);

            if (!response.IsSuccessful)
                return BadRequest(response);

            return Ok(response);
        }

        // GET: api/companyproduct/verify/{productHashId}
        [HttpGet("verify/{productHashId}")]
        public async Task<IActionResult> VerifyProduct(string productHashId)
        {
            var response = await _companyProductService.VerifyProduct(productHashId);

            if (!response.IsSuccessful)
                return NotFound(response);

            return Ok(response);
        }

        // GET: api/companyproduct/batch/{batchBase}
        [HttpGet("batch/{batchBase}")]
        public async Task<IActionResult> GetAllByBatchBase(string batchBase)
        {
            var response = await _companyProductService.GetAllByBatchBaseAsync(batchBase);

            if (!response.IsSuccessful)
                return NotFound(response);

            return Ok(response);
        }
    }
}
