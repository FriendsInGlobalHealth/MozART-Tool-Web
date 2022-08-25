using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Main.Domain.Models
{
    public class SignInRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UpdatePassRequest
    {
        public string Password { get; set; }
    }
}
