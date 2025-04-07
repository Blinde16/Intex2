using System.ComponentModel.DataAnnotations;

namespace RootkitAuth.API.Data;

public class Movie
{
    [Key]
    public int show_id { get; set; }
    [Required]
    public string type { get; set; }
    public string title { get; set; }
    public string? director { get; set; }
    public string? cast { get; set; }
    public string? country { get; set; }
    public string release_year { get; set; }
    public string? rating { get; set; }
    public string? duration { get; set; }
    public string? description { get; set; }
    public string? genre { get; set; }
}