using System;
using System.Threading;
using System.Threading.Tasks;
using Main.Domain.Models;

namespace Main.Domain.Services
{
    public interface IUserService
    {
        Task<TokenResponse> SignInAsync(SignInRequest request, CancellationToken cancellationToken = default);
        Task<UserResponse> GetAsync(string username);
        Task<User> GetUserByNameAsync(string username);
        Task<User> EditUserAsync(User request);
    }
}
