﻿using Seek.Core.Application.Interfaces.Repositories;
using Seek.Core.Domain.Entities;
using Seek.Infrastructure.Context;
using Google;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Seek.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly SeekContext _context;
        public UserRepository(SeekContext context)
        {
            _context = context;
        }

        public async Task<User> AddAsync(User user)
        {
            await _context.Set<User>()
                .AddAsync(user);
            _context.SaveChanges();
            return user;
        }

        public async Task<bool> ExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email);
        }

        public async Task<bool> ExistsAsync(string email, int id)
        {
            return await _context.Users.AnyAsync(x => x.Email == email && x.Id != id);
        }

        public User Update(User entity)
        {
            _context.Users.Update(entity);
            return entity;
        }

        public async Task<ICollection<User>> GetAllAsync()
        {
            var answer = await _context.Set<User>()
                            .ToListAsync();
            return answer;
        }

        public async Task<User> GetAsync(string email)
        {
            var answer = await _context.Set<User>()
                        .Where(a => !a.IsDeleted && a.Email == email)
                        .SingleOrDefaultAsync();
            return answer;
        }

        public async Task<User> GetAsync(int id)
        {
            var answer = await _context.Set<User>()
                        .Where(a => !a.IsDeleted && a.Id == id)
                        .SingleOrDefaultAsync();
            return answer;
        }

        public async Task<User> GetAsync(Expression<Func<User, bool>> exp)
        {
            var answer = await _context.Set<User>()
                        .Where(a => !a.IsDeleted)
                        .SingleOrDefaultAsync(exp);
            return answer;
        }

        public void Remove(User answer)
        {
            answer.IsDeleted = true;
            _context.Set<User>()
                .Update(answer);
            _context.SaveChanges();
        }
        public async Task<bool> UserHasProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user?.Profile != null;
        }

    }

}
