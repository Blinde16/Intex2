using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RootkitAuth.API.Data;
using RootkitAuth.API.Services;


var builder = WebApplication.CreateBuilder(args);

// Optionally test connection here
var connStr = builder.Configuration.GetConnectionString("AzureSqlDb");
using (SqlConnection conn = new SqlConnection(connStr))
{
    conn.Open();
    // Do stuff
}
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AzureSqlDb")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AzureSqlDb")));

builder.Services.AddAuthorization();

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddTransient<IEmailSender<IdentityUser>, DummyEmailSender>(); 

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings
    options.Password.RequiredLength = 12;
    options.Password.RequiredUniqueChars = 1;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false; // set true if you want symbols

    // Claims settings
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
});


builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; // change after adding https for production
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/Login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // Replace with your frontend URL
                .AllowCredentials() // Required to allow cookies
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseRouting(); 
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>();

app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    // Ensure authentication cookie is removed
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();


app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    var roles = user.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

    return Results.Json(new
    {
        email,
        roles
    });
}).RequireAuthorization();

//  SEED ROLES & ASSIGN USERS 
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await CreateRolesAndAssignUsers(services);
    //await PromoteMovieUsersToIdentity(services); // 👈 Add this line
}


app.Run();

// ------------------ Role/User Seeding Function ------------------

static async Task CreateRolesAndAssignUsers(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

    string[] roles = { "Admin", "AuthenticatedCustomer" };

    foreach (var roleName in roles)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    // Seed admin user
    var adminEmail = "admin@rootkit.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        adminUser = new IdentityUser { UserName = adminEmail, Email = adminEmail };
        var result = await userManager.CreateAsync(adminUser, "Admin123!");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }

    // Seed customer user
    var customerEmail = "user@rootkit.com";
    var customerUser = await userManager.FindByEmailAsync(customerEmail);
    if (customerUser == null)
    {
        customerUser = new IdentityUser { UserName = customerEmail, Email = customerEmail };
        var result = await userManager.CreateAsync(customerUser, "Superpurplefresh!");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(customerUser, "AuthenticatedCustomer");
        }
    }
}
// static async Task PromoteMovieUsersToIdentity(IServiceProvider serviceProvider)
// {
//     using var scope = serviceProvider.CreateScope();
//     var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
//     var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
//     var dbContext = scope.ServiceProvider.GetRequiredService<MovieDbContext>();

//     // Ensure the AuthenticatedCustomer role exists
//     var roleExists = await roleManager.RoleExistsAsync("AuthenticatedCustomer");
//     if (!roleExists)
//     {
//         await roleManager.CreateAsync(new IdentityRole("AuthenticatedCustomer"));
//     }

//     // Get all unique emails from movies_users table
//     var movieUserEmails = dbContext.movies_users
//         .Select(mu => mu.email)
//         .Distinct()
//         .ToList();

//     foreach (var email in movieUserEmails)
//     {
//         if (string.IsNullOrWhiteSpace(email)) continue;

//         var user = await userManager.FindByEmailAsync(email);
//         if (user == null)
//         {
//             user = new IdentityUser
//             {
//                 UserName = email,
//                 Email = email
//             };

//             var result = await userManager.CreateAsync(user, "SuperPurpleFresh7"); // You can change this default password

//             if (!result.Succeeded)
//             {
//                 Console.WriteLine($"❌ Failed to create user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
//                 continue;
//             }
//         }

//         // Add to role if not already in it
//         var inRole = await userManager.IsInRoleAsync(user, "AuthenticatedCustomer");
//         if (!inRole)
//         {
//             await userManager.AddToRoleAsync(user, "AuthenticatedCustomer");
//         }

//         Console.WriteLine($"✅ {email} is now an AuthenticatedCustomer");
//     }
// }
