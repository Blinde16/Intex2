using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RootkitAuth.API.Data;

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

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            if (!await _roleManager.RoleExistsAsync("AuthenticatedCustomer"))
            {
                await _roleManager.CreateAsync(new IdentityRole("AuthenticatedCustomer"));
            }

            await _userManager.AddToRoleAsync(user, "AuthenticatedCustomer");

            return Ok(new { message = "User registered successfully." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("users/create")]
        public async Task<IActionResult> CreateUserByAdmin([FromBody] AdminCreateUserDto model)
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

            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole(model.Role));
            }

            await _userManager.AddToRoleAsync(user, model.Role);

            var nextUserId = _movieContext.movies_users.Any()
                ? _movieContext.movies_users.Max(u => u.user_id) + 1
                : 1;

            var profile = new User
            {
                user_id = nextUserId,
                name = model.Name,
                phone = model.Phone,
                email = model.Email,
                age = model.Age,
                gender = model.Gender,
                city = model.City,
                state = model.State,
                zip = model.Zip,
                Netflix = model.Netflix,
                Amazon_Prime = model.Amazon_Prime,
                Disney = model.Disney,
                Paramount = model.Paramount,
                Max = model.Max,
                Hulu = model.Hulu,
                Apple_TV = model.Apple_TV,
                Peacock = model.Peacock
            };

            _movieContext.movies_users.Add(profile);
            await _movieContext.SaveChangesAsync();

            return Ok(new { message = "User created successfully in both tables." });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(int page = 1, int pageSize = 10, string? search = null)
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

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                users = users.Where(u =>
                    (!string.IsNullOrEmpty(u.Email) && u.Email.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(u.Name) && u.Name.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(u.Phone) && u.Phone.ToLower().Contains(search))
                ).ToList();
            }

            var totalCount = users.Count;
            var pagedUsers = users
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { users = pagedUsers, totalCount });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var identityUser = await _userManager.FindByIdAsync(id);
            if (identityUser == null) return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(identityUser);
            var movieUser = _movieContext.movies_users.FirstOrDefault(mu => mu.email.ToLower() == identityUser.Email.ToLower());

            if (movieUser == null) return NotFound("Movie user not found");

            var userViewModel = new AdminUserViewModel
            {
                Id = identityUser.Id,
                Email = identityUser.Email,
                Roles = roles,
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
            };

            return Ok(userViewModel);
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
