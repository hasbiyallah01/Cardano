using Seek.Core.Application.Services;
using Seek.Models;

namespace Seek.Core.Application.Interfaces.Services
{
    public interface IMealRecommendationService
    {
        Task SaveDailyRecommendationsAsync(int profileId, string dateSeed, string meals);
        Task<string> GetDailyRecommendationsAsync(int profileId, string dateSeed);
        Task<BaseResponse<MealDetails>> GenerateMealDetailsAsync(string mealName, int profileId);
    }

}
