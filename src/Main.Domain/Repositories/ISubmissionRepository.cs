using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Main.Domain.Models;

namespace Main.Domain.Repositories
{
    public interface ISubmissionRepository: IRepository
    {
        public Task<IEnumerable<Submission>> GetAsync(string createdBy);
        public Task<Submission> GetAsync(int Id);
        public Submission Add(Submission item);
        public Submission Update(Submission item);
    }
}
