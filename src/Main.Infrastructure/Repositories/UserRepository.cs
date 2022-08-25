using System;
using System.Threading;
using System.Threading.Tasks;
using Main.Domain.Models;
using Main.Domain.Repositories;
using Main.Infrastructure.Context;
using System.Linq;
using System.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Main.Infrastructure.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly IConfiguration _configuration;
        private readonly MainContext _context;
        public IUnitOfWork UnitOfWork => _context;

        public UserRepository(MainContext context, IConfiguration configuration)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _configuration = configuration;
        }

        public async Task<bool> AuthenticateAsync(string username, string password, CancellationToken cancellationToken)
        {
            var item = _context.Users
                                     .AsNoTracking()
                                     .Where(x => x.Username == username)
                                     .Where(x => x.Password == password)
                                     .FirstOrDefault();
            if (item == null) return false;
            _context.Entry(item).State = (Microsoft.EntityFrameworkCore.EntityState)EntityState.Detached;
            return true;
        }

        public async Task<User> GetUserAsync(string username, CancellationToken cancellationToken)
        {
            var item = _context.Users
                                     .AsNoTracking()
                                     .Where(x => x.Username == username)
                                     .FirstOrDefault();
            if (item == null) return null;
            _context.Entry(item).State = EntityState.Detached;
            return item;
        }

        public async Task<User> Update(User item)
        {
            _context.Entry(item).State = EntityState.Modified;
            return item;
        }
    }
}
