﻿using Seek.Models;
using Seek.Models.ProfileModel;

namespace Seek.Core.Application.Interfaces.Services
{
    public interface IRestaurantService
    {
        Task<BaseResponse<RestaurantResponse>> GetRestaurant(int id);
        Task<BaseResponse<ICollection<RestaurantResponse>>> GetAllRestaurant();
        Task<BaseResponse> RemoveRestaurant(int id);
        Task<BaseResponse<bool>> GetRestaurantByUserId(int id);
        Task<BaseResponse<RestaurantResponse>> CreateRestaurant(RestaurantRequest request);
        Task<BaseResponse<RestaurantResponse>> UpdateRestaurant(int id, RestaurantRequest request);
    }
}
