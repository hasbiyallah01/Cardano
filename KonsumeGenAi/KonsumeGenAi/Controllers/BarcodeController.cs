using Microsoft.AspNetCore.Mvc;
using static BarcodeService;
using SeekGenAi.Core.Application.Interfaces.Services;
using OpenAI_API.Chat;
using OpenAI_API;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/barcode")]
public class BarcodeController : ControllerBase
{
    private readonly IBarcodeService _barcodeService;
    public BarcodeController(IBarcodeService barcodeService)
    {
        _barcodeService = barcodeService;
    }

    [HttpPost("barcodedetails")]
    public async Task<IActionResult> GetBarcodeDetails(string barcode, int ProfileId)
    {
        try
        {
            var barcodeResult = await _barcodeService.DecodeBarcodeAsync(barcode, ProfileId);
            return Ok(new { barcodeResult });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchProduct([FromQuery] string productName, [FromQuery] int ProfileId)
    {
        if (string.IsNullOrWhiteSpace(productName))
        {
            return BadRequest("Product name is required.");
        }

        try
        {
            var productDetails = await _barcodeService.Search(productName, ProfileId);
            return Ok(new { message = "Product details retrieved successfully", data = productDetails });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpGet("searchedproducts")]
    public async Task<IActionResult> RecentlySearchedProducts( [FromQuery] int ProfileId)
    {

        try
        {
            var productDetails = await _barcodeService.GetRecentScans(ProfileId);
            return Ok(new { message = "Products retrieved successfully", data = productDetails });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
}



