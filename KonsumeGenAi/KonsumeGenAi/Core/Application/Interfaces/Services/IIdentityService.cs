using Seek.Models.UserModel;

namespace Seek.Core.Application.Interfaces.Services
{
    public interface IIdentityService
    {
        string GenerateToken(string key, string issuer, LoginResponse user);
        bool IsTokenValid(string key, string issuer, string token);
    }
}
