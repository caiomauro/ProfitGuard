using backend.Entities;
using backend.ApplicationUser;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;



namespace backend.Context // Replace with your actual namespace
{
    public class IPSDbContext : IdentityDbContext<ApplicationUser.ApplicationUser>
    {
        public IPSDbContext(DbContextOptions<IPSDbContext> options) : base(options)
        {
            
        }

        public DbSet<Entities.Item> Items { get; set; }
        public DbSet<Entities.Category> Categories { get; set; }
        public DbSet<Entities.User> Users { get; set; }
        public DbSet<ApplicationUser.ApplicationUser> ApplicationUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Item>()
                 .HasOne(i => i.Creator)
                 .WithMany(u => u.Items)
                 .HasForeignKey(i => i.Creator_Id)
                 .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Category>()
                 .HasOne(c => c.Creator)
                 .WithMany(u => u.Categories)
                 .HasForeignKey(c => c.Creator_Id)
                 .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
