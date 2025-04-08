using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RootkitAuth.API.Data;

namespace RootkitAuth.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IEmailSender<IdentityUser> _emailSender;
        private readonly SignInManager<IdentityUser> _signInManager;

        public RegisterController(UserManager<IdentityUser> userManager,
                                  RoleManager<IdentityRole> roleManager,
                                  IEmailSender<IdentityUser> emailSender,
                                  SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _emailSender = emailSender;
            _signInManager = signInManager;
        }

        [AllowAnonymous]
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

            // Ensure role exists
            if (!await _roleManager.RoleExistsAsync("AuthenticatedCustomer"))
                await _roleManager.CreateAsync(new IdentityRole("AuthenticatedCustomer"));

            await _userManager.AddToRoleAsync(user, "AuthenticatedCustomer");

            // Enable 2FA via email
            await _userManager.SetTwoFactorEnabledAsync(user, true);

            // Send 2FA token via email
            var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
            await _emailSender.SendPasswordResetCodeAsync(user, user.Email, token);

            return Ok(new
            {
                message = "User registered successfully. 2FA email code sent.",
                email = user.Email
            });
        }

        [AllowAnonymous]
        [HttpPost("verify-2fa")]
        public async Task<IActionResult> VerifyTwoFactorCode([FromBody] TwoFactorVerifyDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Invalid email.");

            if (!await _userManager.GetTwoFactorEnabledAsync(user))
                return BadRequest("2FA is not enabled for this user.");

            var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, "Email", dto.Code);
            if (!isValid)
                return Unauthorized("Invalid 2FA code.");

            // Optionally sign in the user after verification
            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(new { message = "2FA verification successful." });
        }
    }

    // DTOs
    public class TwoFactorVerifyDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }

    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
