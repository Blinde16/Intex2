using System.ComponentModel.DataAnnotations;

namespace RootkitAuth.API.Data;

public class Rootbeer
{
    [Key]
    public int RootbeerID { get; set; }
    [Required]
    public string? RootbeerName { get; set; }
    public string? FirstBrewedYear { get; set; }
    public string? BreweryName { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? Description { get; set; }
    public decimal WholesaleCost { get; set; }
    public decimal CurrentRetailPrice { get; set; }
    public string? Container { get; set; }
}