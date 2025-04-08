using Microsoft.AspNetCore.Identity;

public class DummyEmailSender : IEmailSender<IdentityUser>
{
    public Task SendConfirmationLinkAsync(IdentityUser user, string email, string confirmationLink)
    {
        Console.WriteLine($"Confirmation link for {email}: {confirmationLink}");
        return Task.CompletedTask;
    }

    public Task SendPasswordResetLinkAsync(IdentityUser user, string email, string resetLink)
    {
        Console.WriteLine($"Password reset link for {email}: {resetLink}");
        return Task.CompletedTask;
    }

    public Task SendPasswordResetCodeAsync(IdentityUser user, string email, string resetCode)
    {
        Console.WriteLine($"2FA code for {email}: {resetCode}"); // 👈 THIS LINE logs the 2FA token
        return Task.CompletedTask;
    }
}
