using RootkitAuth.API.Data;
using Microsoft.EntityFrameworkCore;

namespace RootkitAuth.API.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
        {
        }

        public DbSet<Movie> movies_titles { get; set; }
        public DbSet<User> movies_users { get; set; }
        public DbSet<UserReq> user_recommendations { get; set; }
        public DbSet<MovieReq> movie_recommendations { get; set; }
        public DbSet<MoviesRating> movies_ratings { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Movie>().ToTable("movies_titles");

            modelBuilder.Entity<MoviesRating>()
                .HasKey(mr => new { mr.user_id, mr.show_id });
        }
    }
}
