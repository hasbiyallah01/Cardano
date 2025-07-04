﻿using Seek.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Seek.Core.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User> AddAsync(User user);
        Task<User> GetAsync(int id);

        Task<User> GetAsync(string email);
        Task<User> GetAsync(Expression<Func<User, bool>> exp);
        Task<ICollection<User>> GetAllAsync();
        void Remove(User user);
        User Update(User user);
        Task<bool> ExistsAsync(string email, int id);
        Task<bool> ExistsAsync(string email);
        Task<bool> UserHasProfileAsync(int userId);
    }
}
