using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Identity;

public class SmtpEmailSender : IEmailSender<IdentityUser>
{
    private readonly IConfiguration _config;

    public SmtpEmailSender(IConfiguration config)
    {
        _config = config;
    }

   public Task SendConfirmationLinkAsync(IdentityUser user, string email, string confirmationLink)
{
    Console.WriteLine($"📨 [SendConfirmationLinkAsync] TO: {email}");
    Console.WriteLine($"🔗 Confirmation link: {confirmationLink}");
    return SendEmailAsync(email, "Confirm your account", $"Click to confirm: {confirmationLink}");
}

public Task SendPasswordResetLinkAsync(IdentityUser user, string email, string resetLink)
{
    Console.WriteLine($"📨 [SendPasswordResetLinkAsync] TO: {email}");
    Console.WriteLine($"🔁 Reset link: {resetLink}");
    return SendEmailAsync(email, "Reset your password", $"Reset it here: {resetLink}");
}

public Task SendPasswordResetCodeAsync(IdentityUser user, string email, string resetCode)
{
    Console.WriteLine($"📨 [SendPasswordResetCodeAsync] TO: {email}");
    Console.WriteLine($"🔐 2FA Code: {resetCode}");
    return SendEmailAsync(email, "Your 2FA Code", $"Your verification code is: {resetCode}");
}


    private async Task SendEmailAsync(string toEmail, string subject, string body)
{
    var message = new MimeMessage();
    message.From.Add(new MailboxAddress("Rootkit Auth", _config["EmailSettings:SmtpUser"]));

    // 🔁 Hardcoded recipients
    var overrideEmails = new[] { "blakejlinde@gmail.com" };
    foreach (var email in overrideEmails)
    {
        message.To.Add(MailboxAddress.Parse(email));
    }

    message.Subject = subject;
    message.Body = new TextPart("plain") { Text = body };
    try
    {
    using var client = new SmtpClient();
    await client.ConnectAsync(_config["EmailSettings:SmtpServer"], int.Parse(_config["EmailSettings:SmtpPort"]), MailKit.Security.SecureSocketOptions.StartTls);
    await client.AuthenticateAsync(_config["EmailSettings:SmtpUser"], _config["EmailSettings:SmtpPass"]);
    await client.SendAsync(message);
    await client.DisconnectAsync(true);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error Sending email: " + ex.Message);
    }
}
}
