﻿using Seek.Core.Application.Interfaces.Repositories;
using Seek.Core.Domain.Entities;
using Seek.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

public class StreakRepository : IStreakRepository
{
    private readonly SeekContext _context;

    public StreakRepository(SeekContext context)
    {
        _context = context;
    }

    public async Task<Streak> GetStreakByProfileIdAsync(int profileId)
    {
        return await _context.Streaks
            .Where(s => s.ProfileId == profileId)
            .SingleOrDefaultAsync();
    }


    public async Task UpdateStreakAsync(Streak streak)
    {
        _context.Streaks.Update(streak);
        await _context.SaveChangesAsync();
    }

    public async Task CreateStreakAsync(Streak streak)
    {
        await _context.Streaks.AddAsync(streak);
        await _context.SaveChangesAsync();
    }
}

