using Seek.Core.Domain.Entities;

namespace Seek.Core.Application.Interfaces.Repositories
{
    public interface IStreakRepository
    {
        Task CreateStreakAsync(Streak streak);
        Task<Streak> GetStreakByProfileIdAsync(int profileId);
        Task UpdateStreakAsync(Streak streak);
    }


}
