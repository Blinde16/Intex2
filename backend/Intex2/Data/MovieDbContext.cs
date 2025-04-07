using RootkitAuth.API.Data;
using Microsoft.EntityFrameworkCore;

namespace RootkitAuth.API.Data;

public class MovieDbContext: DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Movie> Movies { get; set; }
}