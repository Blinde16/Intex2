public class AdminCreateUserDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }

    public string Name { get; set; }
    public string Phone { get; set; }
    public byte Age { get; set; }
    public string Gender { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public int Zip { get; set; }

    public byte Netflix { get; set; }
    public byte Amazon_Prime { get; set; }
    public byte Disney { get; set; }
    public byte Paramount { get; set; }
    public byte Max { get; set; }
    public byte Hulu { get; set; }
    public byte Apple_TV { get; set; }
    public byte Peacock { get; set; }
}
