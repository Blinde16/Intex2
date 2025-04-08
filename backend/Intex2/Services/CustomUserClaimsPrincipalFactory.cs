using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace RootkitAuth.API.Services;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<IdentityUser>
{
    private readonly ILogger<CustomUserClaimsPrincipalFactory> _logger;

    public CustomUserClaimsPrincipalFactory(
        UserManager<IdentityUser> userManager,
        IOptions<IdentityOptions> optionsAccessor,
        ILogger<CustomUserClaimsPrincipalFactory> logger)
        : base(userManager, optionsAccessor)
    {
        _logger = logger;
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(IdentityUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? ""));

        var roles = await UserManager.GetRolesAsync(user);
        _logger.LogInformation("User {Email} has roles: {Roles}", user.Email, string.Join(", ", roles));

        foreach (var role in roles)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }

        return identity;
    }
}
