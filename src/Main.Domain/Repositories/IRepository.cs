using System;
using System.Collections.Generic;
using System.Text;

namespace Main.Domain.Repositories
{
    public interface IRepository
    {
        public IUnitOfWork UnitOfWork { get; }
    }
}
