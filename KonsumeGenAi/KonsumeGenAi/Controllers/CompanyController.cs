using KonsumeGenAi.Core.Application.Interfaces.Services;
using KonsumeGenAi.Core.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KonsumeGenAi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterCompany([FromBody] CompanyRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _companyService.CreateCompany(request);
            if (!response.IsSuccessful)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            var response = await _companyService.GetAllCompanies();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            var response = await _companyService.GetCompany(id);
            if (!response.IsSuccessful)
                return NotFound(response);

            return Ok(response);
        }
    }
}



