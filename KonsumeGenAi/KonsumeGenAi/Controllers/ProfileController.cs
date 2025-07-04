﻿using Seek.Core.Application.Interfaces.Services;
using Seek.Models;
using Seek.Models.ProfileModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Seek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }
        [Authorize]

        [HttpPost("create")]
        public async Task<IActionResult> CreateProfile(int userId, [FromBody] ProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _profileService.CreateProfile(userId, request);
            if (!response.IsSuccessful)
            {
                return BadRequest(response.Message);
            }

            return Ok(response);
        }

        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetAllProfiles()
        {
            var response = await _profileService.GetAllProfiles();
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetProfile(int id)
        {
            var response = await _profileService.GetProfile(id);
            if (!response.IsSuccessful || response == null)
            {
                return NotFound(response.Message);
            }

            return Ok(response);
        }

        [HttpGet("profileByIdUserId")]
        public async Task<IActionResult> GetProfileIdByUserId(int Userid)
        {
            var response = await _profileService.GetProfileDetailsByUserId(Userid); // Assuming _profileService is where your method is

            if (response.IsSuccessful)
            {
                return Ok(response); // 200 OK with the successful response data
            }

            return NotFound(response); // 404 Not Found with the error response data
        }


        [HttpGet("profileByUserId")]
        public async Task<IActionResult> GetProfileByUserId(int Userid)
        {
            var response = await _profileService.GetProfileByUserId(Userid);
            if (!response.IsSuccessful || response == null)
            {
                return NotFound(response.Message);
            }

            return Ok(response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] ProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _profileService.UpdateProfile(id, request);
            if (!response.IsSuccessful)
            {
                return BadRequest(response.Message);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> RemoveProfile(int id)
        {
            var response = await _profileService.RemoveProfile(id);
            if (!response.IsSuccessful)
            {
                return NotFound(response.Message);
            }

            return Ok(response);
        }
    }
}

