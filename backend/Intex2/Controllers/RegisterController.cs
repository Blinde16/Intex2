using Microsoft.AspNetCore.Authorization;
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

        private readonly MovieDbContext _movieContext;

        public RegisterController(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            MovieDbContext movieDbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _movieContext = movieDbContext;
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

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "AuthenticatedCustomer");

                // You can also sign them in or return a success response
                return Ok(new { message = "User registered and assigned role." });
            }

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
        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var identityUsers = _userManager.Users.ToList();
            var movieUsers = _movieContext.movies_users.ToList();

            var users = new List<AdminUserViewModel>();

            foreach (var identityUser in identityUsers)
            {
                var roles = await _userManager.GetRolesAsync(identityUser);
                var movieUser = movieUsers.FirstOrDefault(mu => mu.email.ToLower() == identityUser.Email.ToLower());

                if (movieUser != null)
                {
                    users.Add(new AdminUserViewModel
                    {
                        Id = identityUser.Id,
                        Email = identityUser.Email,
                        Roles = roles,

                        // Extended data
                        Name = movieUser.name,
                        Phone = movieUser.phone,
                        Age = movieUser.age,
                        Gender = movieUser.gender,
                        City = movieUser.city,
                        State = movieUser.state,
                        Zip = movieUser.zip,

                        Netflix = movieUser.Netflix,
                        Amazon_Prime = movieUser.Amazon_Prime,
                        Disney = movieUser.Disney,
                        Paramount = movieUser.Paramount,
                        Max = movieUser.Max,
                        Hulu = movieUser.Hulu,
                        Apple_TV = movieUser.Apple_TV,
                        Peacock = movieUser.Peacock
                    });
                }
            }

            return Ok(users);
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPut("users/update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
                return NotFound();

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, dto.Role);

            await _userManager.SetTwoFactorEnabledAsync(user, dto.Enable2FA);

            return Ok(new { message = "User updated." });
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("users/delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User deleted." });
        }


    }
}
