using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Intex2.API.Data;

public class ApplicationDbContext: IdentityDbContext<IdentityUser>
{
    ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
    {

    }
};