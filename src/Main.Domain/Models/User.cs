using System;
using System.Collections.Generic;

#nullable disable

namespace Main.Domain.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public sbyte? Active { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; }
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public sbyte? Active { get; set; }
    }


}
