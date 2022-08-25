using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Main.Domain.Services;
using Main.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Main.Web.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(SignInRequest signInRequest)
        {

            var result = await _userService.SignInAsync(signInRequest);
            if (result != null)
            {
                return Ok(result);
            }
            return Unauthorized();
        }

        [HttpGet("current")]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            var response = _userService.GetAsync(User.FindFirst(ClaimTypes.Name)?.Value);
            if (response != null)
            {
                return Ok(response.Result);
            }
            return NotFound();
        }

        [HttpPost("changepass")]
        [Authorize]
        public async Task<IActionResult> ChangePass(UpdatePassRequest request)
        {
            User user = await _userService.GetUserByNameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
            if (user != null)
            {
                user.Password = request.Password;
                User updated = await _userService.EditUserAsync(user);

                return Ok(new UserResponse { 
                    Id = updated.Id,
                    Username = updated.Username,
                    Name = updated.Name,
                    Active = updated.Active,
                    Role = updated.Role
                });
            }
            return NotFound();
        }
    }
}
