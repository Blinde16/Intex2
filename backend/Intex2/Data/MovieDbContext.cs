using RootkitAuth.API.Data;
using Microsoft.EntityFrameworkCore;

namespace RootkitAuth.API.Data;

public class MovieDbContext: DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Movie> movies_titles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Movie>().ToTable("movies_titles");
    }
}