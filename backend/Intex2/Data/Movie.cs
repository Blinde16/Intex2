using System.ComponentModel.DataAnnotations;

namespace RootkitAuth.API.Data
{
    public class Movie
    {
        [Key]
        public string show_id { get; set; } // varchar in DB

        [Required]
        public string type { get; set; }

        public string title { get; set; }
        public string? director { get; set; }
        public string? cast { get; set; }
        public string? country { get; set; }
        public short release_year { get; set; }  // ? matches SQL smallint
        public string? rating { get; set; }
        public string? duration { get; set; }
        public string? description { get; set; }

        public byte? Action { get; set; }
        public byte? Adventure { get; set; }
        public byte? Anime_Series_International_TV_Shows { get; set; }
        public byte? British_TV_Shows_Docuseries_International_TV_Shows { get; set; }
        public byte? Children { get; set; }
        public byte? Comedies { get; set; }
        public byte? Comedies_Dramas_International_Movies { get; set; }
        public byte? Comedies_International_Movies { get; set; }
        public byte? Comedies_Romantic_Movies { get; set; }
        public byte? Crime_TV_Shows_Docuseries { get; set; }
        public byte? Documentaries { get; set; }
        public byte? Documentaries_International_Movies { get; set; }
        public byte? Docuseries { get; set; }
        public byte? Dramas { get; set; }
        public byte? Dramas_International_Movies { get; set; }
        public byte? Dramas_Romantic_Movies { get; set; }
        public byte? Family_Movies { get; set; }
        public byte? Fantasy { get; set; }
        public byte? Horror_Movies { get; set; }
        public byte? International_Movies_Thrillers { get; set; }
        public byte? International_TV_Shows_Romantic_TV_Shows_TV_Dramas { get; set; }
        public byte? Kids_TV { get; set; }
        public byte? Language_TV_Shows { get; set; }
        public byte? Musicals { get; set; }
        public byte? Nature_TV { get; set; }
        public byte? Reality_TV { get; set; }
        public byte? Spirituality { get; set; }
        public byte? TV_Action { get; set; }
        public byte? TV_Comedies { get; set; }
        public byte? TV_Dramas { get; set; }
        public byte? Talk_Shows_TV_Comedies { get; set; }
        public byte? Thrillers { get; set; }
    }
}
