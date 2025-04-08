using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RootkitAuth.API.Services
{
    public class NumericTwoFactorTokenProvider : IUserTwoFactorTokenProvider<IdentityUser>
    {
        public async Task<string> GenerateAsync(string purpose, UserManager<IdentityUser> manager, IdentityUser user)
        {
            // Generate a random 6-digit number
            var randomNumber = new Random().Next(100000, 999999);
            return randomNumber.ToString();
        }

        public async Task<bool> ValidateAsync(string purpose, string token, UserManager<IdentityUser> manager, IdentityUser user)
        {
            // In a real application, you might want to store and verify the token
            // against a stored value with a timestamp to prevent replay attacks.
            // For simplicity, we'll just check if the token is a 6-digit number.
            return token != null && token.Length == 6 && token.All(char.IsDigit);
        }

        public async Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<IdentityUser> manager, IdentityUser user)
        {
            return true; // We can always generate a token
        }
    }
}