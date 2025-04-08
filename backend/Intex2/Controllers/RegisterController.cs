using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RootkitAuth.API.Data; // if RegisterDto is placed in Models folder

namespace RootkitAuth.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RegisterController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new IdentityUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            //  Ensure the role exists
            var roleExists = await _roleManager.RoleExistsAsync("AuthenticatedCustomer");
            if (!roleExists)
                await _roleManager.CreateAsync(new IdentityRole("AuthenticatedCustomer"));

            //  Assign role to the new user
            await _userManager.AddToRoleAsync(user, "AuthenticatedCustomer");

            return Ok(new { message = "User registered successfully." });
        }
    }
}
