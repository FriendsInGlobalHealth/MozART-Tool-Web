using System;
using System.Collections.Generic;

#nullable disable

namespace Main.Domain.Models
{
    public class Submission
    {
        public int Id { get; set; }
        public int? Year { get; set; }
        public string Quarter { get; set; }
        public string Partner { get; set; }
        public string Password { get; set; }
        public string Filename { get; set; } 
        public string Createdby { get; set; }
    }
}
