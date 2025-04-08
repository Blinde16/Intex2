using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using RootkitAuth.API.Data;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace RootkitAuth.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]

    
    public class MovieController : ControllerBase
    {
        private MovieDbContext _movieContext;
        public MovieController(MovieDbContext temp)
        {
            _movieContext = temp;
        }
        [Authorize(Roles = "AuthenticatedCustomer,Admin")]
        [Authorize(Roles = "AuthenticatedCustomer,Admin")]
[HttpGet("GetMovies")]
public IActionResult GetMovies(
    [FromQuery] string? afterId,
    [FromQuery] string[]? containers,
    [FromQuery] string[]? genres,
    [FromQuery] string? title // ✅ NEW
)
{
    int pageSize = 10;

    IQueryable<Movie> query = _movieContext.movies_titles.OrderBy(m => m.show_id);

    if (!string.IsNullOrEmpty(afterId))
    {
        query = query.Where(m => string.Compare(m.show_id, afterId) > 0);
    }

    if (containers != null && containers.Length > 0)
    {
        query = query.Where(m => containers.Contains(m.type));
    }

    if (genres != null && genres.Length > 0)
    {
        var parameter = System.Linq.Expressions.Expression.Parameter(typeof(Movie), "m");
        System.Linq.Expressions.Expression? genrePredicate = null;

        foreach (var genre in genres)
        {
            var propertyName = genre
                .Replace(" ", "_")
                .Replace("-", "_")
                .Replace("'", "")
                .Replace(",", "")
                .Replace(".", "")
                .Replace("?", "")
                .Replace("!", "")
                .Replace(":", "")
                .Replace("&", "")
                .Replace("#", "")
                .Replace("/", "_");

            var property = System.Linq.Expressions.Expression.Property(parameter, propertyName);
            var one = System.Linq.Expressions.Expression.Constant((byte?)1, typeof(byte?));
            var equals = System.Linq.Expressions.Expression.Equal(property, one);

            genrePredicate = genrePredicate == null
                ? equals
                : System.Linq.Expressions.Expression.OrElse(genrePredicate, equals);
        }

        if (genrePredicate != null)
        {
            var lambda = System.Linq.Expressions.Expression.Lambda<Func<Movie, bool>>(genrePredicate, parameter);
            query = query.Where(lambda);
        }
    }

        if (!string.IsNullOrWhiteSpace(title))
        {
            query = query.Where(m => m.title != null && EF.Functions.Like(m.title.ToLower(), $"%{title.ToLower()}%"));
        }

        var movies = query
            .AsEnumerable()
            .GroupBy(m => m.show_id)
            .Select(g => g.First())
            .Take(pageSize)
            .ToList();

        return Ok(new { brews = movies });
    }

        [Authorize(Roles = "Admin")]
        [HttpGet("GetAdminMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? types = null)
        {
            var query = _movieContext.movies_titles.AsQueryable();

            if (types != null && types.Any())
            {
                query = query.Where(c => types.Contains(c.type ?? string.Empty));
            }

            var totalNumMovies = query.Count();
            var brews = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var returnMovies = new
            {
                movies = brews,
                totalNumberMovies = totalNumMovies
            };
            
            return Ok(returnMovies);
        }
        [Authorize(Roles = "AuthenticatedCustomer, Admin")]
        [HttpGet("GetCategoryTypes")]
        public IActionResult GetCategoryTypes()
        {
            var categoryTypes = _movieContext.movies_titles
                .Select(c => c.type)
                .Distinct()
                .ToList();
            
            return Ok(categoryTypes);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] Movie newMovie)
        {
            _movieContext.movies_titles.Add(newMovie);
            _movieContext.SaveChanges();
            return Ok(newMovie);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(string showId, [FromBody] Movie updatedMovie)
        {
            var existingMovie = _movieContext.movies_titles.Find(showId);

            if (existingMovie == null)
                return NotFound(new { message = "Movie not found" });

            existingMovie.type = updatedMovie.type;
            existingMovie.title = updatedMovie.title;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;
            existingMovie.Action = updatedMovie.Action;
            existingMovie.Adventure = updatedMovie.Adventure;
            existingMovie.Anime_Series_International_TV_Shows = updatedMovie.Anime_Series_International_TV_Shows;
            existingMovie.British_TV_Shows_Docuseries_International_TV_Shows = updatedMovie.British_TV_Shows_Docuseries_International_TV_Shows;
            existingMovie.Children = updatedMovie.Children;
            existingMovie.Comedies = updatedMovie.Comedies;
            existingMovie.Comedies_Dramas_International_Movies = updatedMovie.Comedies_Dramas_International_Movies;
            existingMovie.Comedies_International_Movies = updatedMovie.Comedies_International_Movies;
            existingMovie.Comedies_Romantic_Movies = updatedMovie.Comedies_Romantic_Movies;
            existingMovie.Crime_TV_Shows_Docuseries = updatedMovie.Crime_TV_Shows_Docuseries;
            existingMovie.Documentaries = updatedMovie.Documentaries;
            existingMovie.Documentaries_International_Movies = updatedMovie.Documentaries_International_Movies;
            existingMovie.Docuseries = updatedMovie.Docuseries;
            existingMovie.Dramas = updatedMovie.Dramas;
            existingMovie.Dramas_International_Movies = updatedMovie.Dramas_International_Movies;
            existingMovie.Dramas_Romantic_Movies = updatedMovie.Dramas_Romantic_Movies;
            existingMovie.Family_Movies = updatedMovie.Family_Movies;
            existingMovie.Fantasy = updatedMovie.Fantasy;
            existingMovie.Horror_Movies = updatedMovie.Horror_Movies;
            existingMovie.International_Movies_Thrillers = updatedMovie.International_Movies_Thrillers;
            existingMovie.International_TV_Shows_Romantic_TV_Shows_TV_Dramas = updatedMovie.International_TV_Shows_Romantic_TV_Shows_TV_Dramas;
            existingMovie.Kids_TV = updatedMovie.Kids_TV;
            existingMovie.Language_TV_Shows = updatedMovie.Language_TV_Shows;
            existingMovie.Musicals = updatedMovie.Musicals;
            existingMovie.Nature_TV = updatedMovie.Nature_TV;
            existingMovie.Reality_TV = updatedMovie.Reality_TV;
            existingMovie.Spirituality = updatedMovie.Spirituality;
            existingMovie.TV_Action = updatedMovie.TV_Action;
            existingMovie.TV_Comedies = updatedMovie.TV_Comedies;
            existingMovie.TV_Dramas = updatedMovie.TV_Dramas;
            existingMovie.Talk_Shows_TV_Comedies = updatedMovie.Talk_Shows_TV_Comedies;
            existingMovie.Thrillers = updatedMovie.Thrillers;
            
            _movieContext.movies_titles.Update(existingMovie);
            _movieContext.SaveChanges();

            return Ok(existingMovie);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(string showId)
        {
            var movie = _movieContext.movies_titles.Find(showId);

            if (movie == null)
                return NotFound(new { message = "Movie not found" });

            _movieContext.movies_titles.Remove(movie);
            _movieContext.SaveChanges();

            return NoContent();
        }
        [Authorize(Roles = "AuthenticatedCustomer, Admin")]
        [HttpGet("GetMovieById/{show_id}")]
        public IActionResult GetMovieById(string show_id)
        {
            var movie = _movieContext.movies_titles.FirstOrDefault(m => m.show_id == show_id);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            return Ok(movie);
        }
		
        [HttpGet("GetGenreTypes")]
        public IActionResult GetGenreTypes()
        {
            // List of genres based on your database headers
            var genres = new List<string>
            {
                "Action",
                "Adventure",
                "Anime Series International TV Shows",
                "British TV Shows Docuseries International TV Shows",
                "Children",
                "Comedies",
                "Comedies Dramas International Movies",
                "Comedies International Movies",
                "Comedies Romantic Movies",
                "Crime TV Shows Docuseries",
                "Documentaries",
                "Documentaries International Movies",
                "Docuseries",
                "Dramas",
                "Dramas International Movies",
                "Dramas Romantic Movies",
                "Family Movies",
                "Fantasy",
                "Horror Movies",
                "International Movies Thrillers",
                "International TV Shows Romantic TV Shows TV Dramas",
                "Kids' TV",
                "Language TV Shows",
                "Musicals",
                "Nature TV",
                "Reality TV",
                "Spirituality",
                "TV Action",
                "TV Comedies",
                "TV Dramas",
                "Talk Shows TV Comedies",
                "Thrillers"
            };

            return Ok(genres);
        }


    }
}
