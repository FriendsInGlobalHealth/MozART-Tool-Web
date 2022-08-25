using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using Main.Domain.Models;
using Main.Domain.Repositories;

namespace Main.Domain.Services
{
    public class SubmissionService: ISubmissionService
    {
        private readonly ISubmissionRepository _submissionRepository;
        public SubmissionService(ISubmissionRepository submissionRepository)
        {
            _submissionRepository = submissionRepository;
        }

        public async Task<IEnumerable<Submission>> GetSubmissionsAsync(string createdBy)
        {
            var result = await _submissionRepository.GetAsync(createdBy);

            return result;
        }

        public async Task<Submission> GetSubmissionAsync(int Id)
        {
            var result = await _submissionRepository.GetAsync(Id);

            return result;
        }

        public async Task<Submission> AddSubmission(Submission item)
        {
            if (item?.Filename == null) throw new ArgumentNullException();

            var result = _submissionRepository.Add(item);
            await _submissionRepository.UnitOfWork.SaveChangesAsync();

            return result;
        }

        public async Task<Submission> UpdateSubmission(Submission item)
        {
            if (item?.Id == null) throw new ArgumentNullException();
            var record = await _submissionRepository.GetAsync(item.Id);
            if (record == null)
            {
                throw new ArgumentException($"Entity with {item.Id} is not present");
            }

            var result = _submissionRepository.Update(item);
            await _submissionRepository.UnitOfWork.SaveChangesAsync();
            return result;
        }
    }
}
