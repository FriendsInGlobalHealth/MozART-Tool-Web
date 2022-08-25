using System;
using System.Threading;
using System.Threading.Tasks;
using Main.Domain.Models;

namespace Main.Domain.Repositories
{
    public interface IUserRepository: IRepository
    {
        Task<bool> AuthenticateAsync(string username, string password, CancellationToken cancellationToken = default);
        Task<User> GetUserAsync(string username, CancellationToken cancellationToken = default);
        Task<User> Update(User item);
    }
}
