﻿using Seek.Core.Application.Interfaces.Repositories;
using Seek.Core.Application.Interfaces.Services;
using Seek.Models.UserModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Seek.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepository;


        public AuthenticationController(IUserService userService, IIdentityService identityService, IConfiguration config,  IUserRepository userRepository)
        {
            _userService = userService;
            _identityService = identityService;
            _config = config;
            _userRepository = userRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LoginRequestModel model)
        {
            var user = await _userService.Login(model);

            if (user.IsSuccessful == true)
            {
                var token = _identityService.GenerateToken(_config["Jwt:Key"], _config["Jwt:Issuer"], user.Value);
                return Ok(new { token, user.Value, user.Message });
            }
            else
            {
                return StatusCode(400, user.Message);
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromForm] string tokenId)
        {
            var user = await _userService.GoogleLogin(tokenId);

            if (user.IsSuccessful == true && user.Message == "User logged in successfully")
            {
                var token = _identityService.GenerateToken(_config["Jwt:Key"], _config["Jwt:Issuer"], user.Value);
                return Ok(new { token, user.Value, user.Message });
            }
            if (user.IsSuccessful == true && user.Message == "Google user created successfully")
            {
                return Ok(new {user.Value, user.Message });
            }
            else
            {
                return StatusCode(400, user.Message);
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserRequest request)
        {
            var user = await _userService.CreateUser(request);

            if (user.IsSuccessful == true)
            {
                return Ok(new { user.Value, user.Message });
            }
            else
            {
                return StatusCode(400, user.Message);
            }
        }


        

    }
}



