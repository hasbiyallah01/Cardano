using Seek.Core.Domain.Entities;
using Seek.Models;

namespace Seek.Core.Application.Interfaces.Services
{
    public interface IUserInteractionService
    {
        Task<UserInteraction> SaveUserInteractionAsync(int id,string question, string response);
        Task<List<UserInteraction>> GetUserInteractionsAsync(int id);
    }

}

