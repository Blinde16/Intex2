public class AdminUserViewModel
{
    public string Id { get; set; } // Identity User ID
    public string Email { get; set; }
    public IList<string> Roles { get; set; }

    // From movies_users table
    public string Name { get; set; }
    public string Phone { get; set; }
    public byte Age { get; set; }
    public string Gender { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public int? Zip { get; set; }

    // Streaming subscriptions
    public byte Netflix { get; set; }
    public byte Amazon_Prime { get; set; }
    public byte Disney { get; set; }
    public byte Paramount { get; set; }
    public byte Max { get; set; }
    public byte Hulu { get; set; }
    public byte Apple_TV { get; set; }
    public byte Peacock { get; set; }
}
