using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Main.Domain.Models;
using Main.Domain.Repositories;


namespace Main.Infrastructure.Context
{
    public partial class MainContext : DbContext, IUnitOfWork
    {
        public MainContext()
        {
        }

        public MainContext(DbContextOptions<MainContext> options)
            : base(options)
        {
        }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasCharSet("utf8mb4")
                .UseCollation("utf8mb4_0900_ai_ci");

            modelBuilder.Entity<Submission>(entity =>
            {
                entity.ToTable("submission");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Createdby)
                    .HasMaxLength(45)
                    .HasColumnName("createdby");

                entity.Property(e => e.Filename)
                    .HasMaxLength(150)
                    .HasColumnName("filename");

                entity.Property(e => e.Partner)
                    .HasMaxLength(45)
                    .HasColumnName("partner");

                entity.Property(e => e.Password)
                    .HasMaxLength(150)
                    .HasColumnName("password");

                entity.Property(e => e.Quarter)
                    .HasMaxLength(45)
                    .HasColumnName("quarter");

                entity.Property(e => e.Year).HasColumnName("year");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Active).HasColumnName("active");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.Password)
                    .HasMaxLength(150)
                    .HasColumnName("password");

                entity.Property(e => e.Role)
                    .HasMaxLength(45)
                    .HasColumnName("role");

                entity.Property(e => e.Username)
                    .HasMaxLength(45)
                    .HasColumnName("username");
            });

        }

        public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            await SaveChangesAsync(cancellationToken);
            return true;
        }

    }
}
