using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Main.Domain.Models;

namespace Main.Domain.Services
{
    public interface ISubmissionService
    {
        public Task<IEnumerable<Submission>> GetSubmissionsAsync(string createdBy);
        public Task<Submission> GetSubmissionAsync(int Id);
        public Task<Submission> AddSubmission(Submission item);
        public Task<Submission> UpdateSubmission(Submission item); 
    }
}
