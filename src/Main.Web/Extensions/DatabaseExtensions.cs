using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Main.Infrastructure.Context;

namespace Main.Web.Extensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddMainContext(this IServiceCollection services, string connectionString)
        {
            return services.AddEntityFrameworkMySql()
                            .AddDbContext<MainContext>(contextOptions => {
                                contextOptions.UseMySql(connectionString, Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.24-mysql"));
                            });
        }
    }
}
