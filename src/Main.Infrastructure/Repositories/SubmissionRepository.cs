using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Main.Domain.Models;
using Main.Domain.Repositories;
using Main.Infrastructure.Context;
using System.Linq;
using System.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Main.Infrastructure.Repositories
{
    public class SubmissionRepository: ISubmissionRepository
    {
        private readonly IConfiguration _configuration;
        private readonly MainContext _context;
        public IUnitOfWork UnitOfWork => _context;

        public SubmissionRepository(MainContext context, IConfiguration configuration)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _configuration = configuration;
        }

        public Submission Add(Submission item)
        {
            return _context.Submissions.Add(item).Entity;
        }
        public async Task<IEnumerable<Submission>> GetAsync(string createdBy)
        {
            return _context.Submissions
                                 .AsNoTracking()
                                 .Where(x => x.Createdby == createdBy)
                                 .ToList();
        }
        public Submission Update(Submission item)
        {
            _context.Entry(item).State = EntityState.Modified;
            return item;
        }
        public async Task<Submission> GetAsync(int Id)
        {
            var item =  _context.Submissions
                               .AsNoTracking()
                               .Where(x => x.Id == Id)
                               .FirstOrDefault();
            if (item == null) return null;

            _context.Entry(item).State = EntityState.Detached;
            return item;
        }

    }
}
