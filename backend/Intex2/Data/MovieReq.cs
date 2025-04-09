using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace RootkitAuth.API.Data
{
    public class MovieReq
    {
        [Key]
        public string Show_Id { get; set; } // varchar in DB

        public string Title {get; set;}

    
    }}