﻿using Seek.Core.Domain.Entities;
using System.Linq.Expressions;

namespace Seek.Core.Application.Interfaces.Repositories
{
    public partial interface IProfileRepository
    {
        Task<Profile> AddAsync(Profile Profile);
        Task<Profile> GetAsync(int id);
        Task<bool> GetProfileByUserIdAsync(int id);
        Task<int> GetProfileDetailsByUserIdAsync(int id);
        Task<Profile> GetAsync(string email);
        Task<Profile> GetAsync(Expression<Func<Profile, bool>> exp);
        Task<ICollection<Profile>> GetAllAsync();
        void Remove(Profile Profile);
        Profile Update(Profile Profile);
        Task<bool> ExistsAsync(string email, int id);
        Task<bool> ExistsAsync(string email);
    }

}
