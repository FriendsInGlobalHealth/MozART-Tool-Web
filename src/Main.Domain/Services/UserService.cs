using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Main.Domain.Repositories;
using Main.Domain.Models;
using Main.Domain.Configurations;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Main.Domain.Services
{
    public class UserService: IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly AuthenticationSettings _authenticationSettings;

        public UserService(IUserRepository userRepository, IOptions<AuthenticationSettings> authenticationSettings)
        {
            _userRepository = userRepository;
            _authenticationSettings = authenticationSettings.Value;
        }

        public async Task<TokenResponse> SignInAsync(SignInRequest request, CancellationToken cancellationToken = default)
        {
            if (request.Username == null || request.Password == null) throw new ArgumentNullException();

            bool userResponse = await _userRepository.AuthenticateAsync(request.Username, request.Password);

            return userResponse == false ? null : new TokenResponse
            {
                Token = GenerateSecurityToken(request)
            };
        }

        public async Task<UserResponse> GetAsync(string username)
        {
            if (username == null) throw new ArgumentNullException();

            User user = await _userRepository.GetUserAsync(username);

            return user == null ? null : new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                Role = user.Role,
                Active = user.Active
            };
        }

        public async Task<User> GetUserByNameAsync(string username)
        {
            if (username == null) throw new ArgumentNullException();

            User user = await _userRepository.GetUserAsync(username);

            return user;
        }

        public async Task<User> EditUserAsync(User request)
        {
            if (request?.Id == null) throw new ArgumentNullException();
            User updated = await _userRepository.Update(request);
            await _userRepository.UnitOfWork.SaveEntitiesAsync();
            return updated;
        }

        private string GenerateSecurityToken(SignInRequest request)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_authenticationSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                 new Claim(ClaimTypes.Name, request.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(_authenticationSettings.ExpirationDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                           SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
