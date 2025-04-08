using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace RootkitAuth.API.Data
{
    public class UserReq
    {
        [Key]
        public string Title { get; set; } // varchar in DB

        public string Genre {get; set;}

        public byte User_Id {get; set;}
    }}