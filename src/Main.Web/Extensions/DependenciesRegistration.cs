using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Main.Domain.Repositories;
using Main.Domain.Services;
using Main.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Main.Web.Extensions
{
    public static class DependenciesRegistration
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>()
                    .AddScoped<ISubmissionService, SubmissionService>();
            return services;
        }

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>()
                    .AddScoped<ISubmissionRepository, SubmissionRepository>();

            return services;
        }
    }
}
