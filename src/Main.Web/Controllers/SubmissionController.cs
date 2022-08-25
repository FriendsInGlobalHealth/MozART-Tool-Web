using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Main.Domain.Models;
using Main.Domain.Services;
using System.Security.Claims;

namespace Main.Web.Controllers
{
    [Route("api/submissions")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;
        private readonly IUserService _userService;

        public SubmissionController(ISubmissionService submissionService, IUserService userService)
        {
            _submissionService = submissionService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _submissionService.GetSubmissionsAsync(User.FindFirst(ClaimTypes.Name)?.Value);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubmission(int Id)
        {
            var result = await _submissionService.GetSubmissionAsync(Id); 
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(Submission request)
        {
            if (request == null) return NotFound();

            request.Createdby = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _submissionService.AddSubmission(request);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Put(Submission request)
        {
            if (request == null) return NotFound();

            request.Createdby = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _submissionService.UpdateSubmission(request); 
            return Ok(result);
        }
    }
}
