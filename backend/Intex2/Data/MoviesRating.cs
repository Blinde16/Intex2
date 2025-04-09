using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RootkitAuth.API.Data
{
    [Table("movies_ratings")] // explicit table mapping (optional but good practice)
    public class MoviesRating
    {
        [Required]
        public int user_id { get; set; }

        [Required]
        public string show_id { get; set; }

        [Required]
        public int rating { get; set; }
    }
}
