using Google.Apis.Auth;
using Seek.Core.Application.Interfaces.Repositories;
using Seek.Core.Application.Interfaces.Services;
using Seek.Core.Domain.Entities;
using Seek.Models.Entities;
using Seek.Models.UserModel;
using Seek.Models;
using System.Security.Claims;
using KonsumeGenAi.Core.Application.Interfaces.Repositories;
using KonsumeGenAi.Core.Domain.Entities;
using KonsumeGenAi.Core.Application.Interfaces.Services;

namespace KonsumeGenAi.Core.Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVerificationCodeRepository _verificationCodeRepository;
        private readonly IEmailService _emailService;
        private readonly IRestaurantRepository _restaurantRepository;
        public CompanyService(IUserRepository userRepository, IRoleRepository roleRepository,
        IRestaurantRepository restaurantRepository, IUnitOfWork unitOfWork,
         IVerificationCodeRepository verificationCodeRepository, IEmailService emailService, ICompanyRepository companyRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _unitOfWork = unitOfWork;
            _verificationCodeRepository = verificationCodeRepository;
            _emailService = emailService;
            _restaurantRepository = restaurantRepository;
            _companyRepository = companyRepository;
        }

        public async Task<BaseResponse<CompanyResponse>> CreateCompany(CompanyRequest request)
        {
            int randomCode = new Random().Next(10000, 99999);

            if (await _restaurantRepository.ExistsAsync(request.Email) || await _userRepository.ExistsAsync(request.Email))
            {
                return new BaseResponse<CompanyResponse>
                {
                    Message = "Email already exists!!!",
                    IsSuccessful = false
                };
            }
            else
            {
                if (request.Password != request.ConfirmPassword)
                {
                    return new BaseResponse<CompanyResponse>
                    {
                        Message = "Password does not match",
                        IsSuccessful = false
                    };
                }

                var role = await _roleRepository.GetAsync(r => r.Name.ToLower() == "company");
                if (role == null)
                {
                    return new BaseResponse<CompanyResponse>
                    {
                        Message = "Role does not exist",
                        IsSuccessful = false
                    };
                }

                var user = new User
                {
                    Email = request.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    DateCreated = DateTime.UtcNow,
                    IsDeleted = false,
                    RoleId = role.Id,
                    Role = role,
                    CreatedBy = "ManualRegistration",
                };

                var newUser = await _userRepository.AddAsync(user);
                var compnay = new Company
                {
                     UserId = newUser.Id,
                     IsDeleted = false,
                     PhoneNumber = request.PhoneNumber,
                     Name = request.Name,
                     WebsiteAdress = request.WebsiteAdress,
                     Wallet = request.Wallet,
                     DateCreated = DateTime.UtcNow,
                     User = newUser,
                 };

                role.Users.Add(user);
                _roleRepository.Update(role);

                var newCompany = await _companyRepository.AddAsync(compnay);
                var code = new VerificationCode
                {
                    Code = randomCode,
                    UserId = newUser.Id,
                    DateCreated = DateTime.UtcNow,
                    IsVerified = false,
                    IsDeleted = false,
                    User = newUser,
                    CreatedOn = DateTime.UtcNow,
                };

                await _verificationCodeRepository.Create(code);

                try
                {
                    var mailRequest = new MailRequests
                    {
                        Subject = "Confirmation Code",
                        ToEmail = user.Email,
                        Title = "Your Confirmation Code",
                        HtmlContent = $"<html><body><h1>Hello {user.FirstName}, Welcome to Seek.</h1><h4>Your confirmation code is {code.Code} to continue with the registration</h4></body></html>"
                    };

                    await _emailService.SendEmailAsync(new MailRecieverDto { Name = user.FirstName, Email = user.Email }, mailRequest);
                }
                catch (Exception ex)
                {
                    return new BaseResponse<CompanyResponse>
                    {
                        Message = $"An error occurred while sending email: {ex.Message}",
                        IsSuccessful = false
                    };
                }

                await _unitOfWork.SaveAsync();

                return new BaseResponse<CompanyResponse>
                {
                    Message = "Check your email and complete your registration",
                    IsSuccessful = true,
                    Value = new CompanyResponse
                    {
                        Id = newCompany.Id,
                        Email = user.Email,
                        Name = compnay.Name,
                        PhoneNumber = compnay.PhoneNumber,
                        Wallet = compnay.Wallet,
                        WebsiteAdress = compnay.WebsiteAdress,
                    }
                };
            }
        }



       
        public async Task<BaseResponse<ICollection<CompanyResponse>>> GetAllCompanies()
        {
            var company = await _companyRepository.GetAllAsync();

            return new BaseResponse<ICollection<CompanyResponse>>
            {
                Message = "List of users",
                IsSuccessful = true,
                Value = company.Select(user => new CompanyResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    PhoneNumber = user.PhoneNumber,
                    Wallet = user.Wallet,
                    WebsiteAdress = user.WebsiteAdress,
                }).ToList(),
            };
        }

        public async Task<BaseResponse<CompanyResponse>> GetCompany(int id)
        {
            var user = await _companyRepository.GetAsync(id);
            if (user == null)
            {
                return new BaseResponse<CompanyResponse>
                {
                    Message = "User not found",
                    IsSuccessful = false
                };
            }
            var role = await _roleRepository.GetAsync(r => r.Name.ToLower() == "company");
            return new BaseResponse<CompanyResponse>
            {
                Message = "User successfully found",
                IsSuccessful = true,
                Value = new CompanyResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    PhoneNumber = user.PhoneNumber,
                    Wallet = user.Wallet,
                    WebsiteAdress = user.WebsiteAdress,
                }
            };
        }

        
    }
}
