using System.ComponentModel.DataAnnotations;

namespace RootkitAuth.API.Data
{
    public class User
    {
        [Key]
        public int user_id { get; set; } // varchar in DB

        [Required]
        public string name { get; set; }

        [Required]
        public string? phone { get; set; }

        [Required]
        public string email { get; set; }

        public byte age { get; set; }

        public string? gender { get; set; }

        public byte Netflix { get; set; }

        public byte Amazon_Prime { get; set; }

        public byte Disney { get; set; }

        public byte Paramount { get; set; }

        public byte Max { get; set; }

        public byte Hulu { get; set; }

        public byte Apple_TV { get; set; }

        public byte Peacock { get; set; }

        [Required]
        public string? city { get; set; }

        [Required]
        public string? state { get; set; }

        [Required]
        public int? zip { get; set; }
    }
}
