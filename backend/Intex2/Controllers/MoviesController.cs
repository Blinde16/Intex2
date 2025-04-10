using System.Text.RegularExpressions;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
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
        private readonly IConfiguration _config;
        public MovieController(MovieDbContext temp,IConfiguration config)
        {
            _movieContext = temp;
            _config = config;
        }
       [Authorize(Roles = "AuthenticatedCustomer,Admin")]
[HttpGet("GetMovies")]
public IActionResult GetMovies(
    [FromQuery] string? afterId,
    [FromQuery] string[]? containers,
    [FromQuery] string? type,
    [FromQuery] string[]? genres,
    [FromQuery] string? title,
    [FromQuery] int pageSize = 25
)
{
    // 1. Start with the full set of movies.
    var query = _movieContext.movies_titles.AsQueryable();

    // 2. Filter by type (if provided), otherwise by containers.
    if (!string.IsNullOrEmpty(type))
    {
        query = query.Where(m => m.type == type);
    }
    else if (containers != null && containers.Length > 0)
    {
        query = query.Where(m => containers.Contains(m.type));
    }

    // 3. Filter by genres.
    if (genres != null && genres.Length > 0)
    {
        var parameter = System.Linq.Expressions.Expression.Parameter(typeof(Movie), "m");
        System.Linq.Expressions.Expression? genrePredicate = null;

        foreach (var genre in genres)
        {
            // Transform genre value to match your Movie model's property naming.
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

    // 4. Filter by title (case-insensitive).
    if (!string.IsNullOrWhiteSpace(title))
    {
        query = query.Where(m => m.title != null && EF.Functions.Like(m.title.ToLower(), $"%{title.ToLower()}%"));
    }

    // 5. Order the filtered results by average rating descending,
    // then by rating count descending, and finally by show_id for a stable sort.
    var orderedQuery = query.GroupJoin(
            _movieContext.movies_ratings,
            m => m.show_id,
            r => r.show_id,
            (movie, ratings) => new
            {
                Movie = movie,
                AverageRating = ratings.Any() ? ratings.Average(r => (double)r.rating) : 0,
                RatingCount = ratings.Count()
            }
        )
        .OrderByDescending(x => x.AverageRating)
        .ThenByDescending(x => x.RatingCount)
        .ThenBy(x => x.Movie.show_id);

    // 6. Load the entire filtered & ordered set into memory.
    var allResults = orderedQuery.ToList();

    // 7. Determine the starting index based on afterId (cursor).
    int startIndex = 0;
    if (!string.IsNullOrEmpty(afterId))
    {
        int idx = allResults.FindIndex(x => x.Movie.show_id == afterId);
        if (idx >= 0)
        {
            startIndex = idx + 1;
        }
    }

    // 8. Take the next pageSize items.
    var pageResults = allResults
        .Skip(startIndex)
        .Take(pageSize)
        .Select(x => x.Movie)
        .GroupBy(m => m.show_id)
        .Select(g => g.First())
        .ToList();

    return Ok(new { brews = pageResults });
}


        [Authorize(Roles = "Admin")]
        [HttpGet("GetAdminMovies")]
        public IActionResult GetMovies(
            int pageSize = 10,
            int pageNum = 1,
            [FromQuery] List<string>? types = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] int? releaseYear = null,
            [FromQuery] List<string>? genres = null)
        {
            var query = _movieContext.movies_titles.AsQueryable();

            if (types != null && types.Any())
                query = query.Where(c => types.Contains(c.type ?? ""));

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowered = searchTerm.ToLower();
                query = query.Where(c =>
                    (c.title ?? "").ToLower().Contains(lowered) ||
                    (c.director ?? "").ToLower().Contains(lowered) ||
                    (c.cast ?? "").ToLower().Contains(lowered));
            }

            if (releaseYear.HasValue)
                query = query.Where(c => c.release_year == releaseYear.Value);

            if (genres != null && genres.Any())
            {
                var param = System.Linq.Expressions.Expression.Parameter(typeof(Movie), "m");
                System.Linq.Expressions.Expression? combined = null;

                foreach (var genre in genres)
                {
                    var safeGenre = genre.Replace(" ", "_").Replace("-", "_").Replace("'", "");
                    var prop = System.Linq.Expressions.Expression.Property(param, safeGenre);
                    var val = System.Linq.Expressions.Expression.Constant((byte?)1, typeof(byte?));
                    var equals = System.Linq.Expressions.Expression.Equal(prop, val);

                    combined = combined == null ? equals : System.Linq.Expressions.Expression.OrElse(combined, equals);
                }

                if (combined != null)
                {
                    var lambda = System.Linq.Expressions.Expression.Lambda<Func<Movie, bool>>(combined, param);
                    query = query.Where(lambda);
                }
            }

            var totalNumMovies = query.Count();
            var brews = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { movies = brews, totalNumberMovies = totalNumMovies });
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
            // Only generate if not provided
            if (string.IsNullOrWhiteSpace(newMovie.show_id))
                {
                    var maxIdNum = _movieContext.movies_titles
                        .Where(m => m.show_id.StartsWith("s"))
                        .AsEnumerable() // 👈 Forces evaluation in memory (switches from SQL to LINQ-to-Objects)
                        .Select(m =>
                        {
                            var numPart = m.show_id.Substring(1);
                            return int.TryParse(numPart, out var n) ? n : 0;
                        })
                        .DefaultIfEmpty(0)
                        .Max();

                    newMovie.show_id = $"s{maxIdNum + 1}";
                }
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
		[Authorize(Roles = "AuthenticatedCustomer, Admin")]
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


    

        [Authorize(Roles = "AuthenticatedCustomer, Admin")]
        [HttpGet("adventure")]
            public async Task<IActionResult> GetAdventureRecommendations()
{
    var userEmail = User.Identity.Name;

    var user = await _movieContext.movies_users
        .FirstOrDefaultAsync(u => u.email == userEmail);

    // If the user is not found, query the movies_ratings instead.
    if (user == null)
    {
        var fallbackRecommendations = await 
            (from r in _movieContext.movies_ratings
             join m in _movieContext.movies_titles on r.show_id equals m.show_id
             where r.rating == 5
             select new Movie
             {
                 show_id = m.show_id,
                 type = m.type,
                 title = m.title,
                 director = m.director,
                 cast = m.cast,
                 country = m.country,
                 release_year = m.release_year,
                 rating = m.rating,
                 duration = m.duration,
                 description = m.description,
                 Action = m.Action,
                 Adventure = m.Adventure,
                 Anime_Series_International_TV_Shows = m.Anime_Series_International_TV_Shows,
                 British_TV_Shows_Docuseries_International_TV_Shows = m.British_TV_Shows_Docuseries_International_TV_Shows,
                 Children = m.Children,
                 Comedies = m.Comedies,
                 Comedies_Dramas_International_Movies = m.Comedies_Dramas_International_Movies,
                 Comedies_International_Movies = m.Comedies_International_Movies,
                 Comedies_Romantic_Movies = m.Comedies_Romantic_Movies,
                 Crime_TV_Shows_Docuseries = m.Crime_TV_Shows_Docuseries,
                 Documentaries = m.Documentaries,
                 Documentaries_International_Movies = m.Documentaries_International_Movies,
                 Docuseries = m.Docuseries,
                 Dramas = m.Dramas,
                 Dramas_International_Movies = m.Dramas_International_Movies,
                 Dramas_Romantic_Movies = m.Dramas_Romantic_Movies,
                 Family_Movies = m.Family_Movies,
                 Fantasy = m.Fantasy,
                 Horror_Movies = m.Horror_Movies,
                 International_Movies_Thrillers = m.International_Movies_Thrillers,
                 International_TV_Shows_Romantic_TV_Shows_TV_Dramas = m.International_TV_Shows_Romantic_TV_Shows_TV_Dramas,
                 Kids_TV = m.Kids_TV,
                 Language_TV_Shows = m.Language_TV_Shows,
                 Musicals = m.Musicals,
                 Nature_TV = m.Nature_TV,
                 Reality_TV = m.Reality_TV,
                 Spirituality = m.Spirituality,
                 TV_Action = m.TV_Action,
                 TV_Comedies = m.TV_Comedies,
                 TV_Dramas = m.TV_Dramas,
                 Talk_Shows_TV_Comedies = m.Talk_Shows_TV_Comedies,
                 Thrillers = m.Thrillers
             })
            .Take(50)
            .ToListAsync();

        return Ok(fallbackRecommendations);
    }

    // If the user is found, continue with the original recommendations query.
    var recommendations = await 
        (from r in _movieContext.user_recommendations
         join m in _movieContext.movies_titles on r.Title equals m.title
         where r.User_Id == user.user_id
         select new Movie
         {
             show_id = m.show_id,
             type = m.type,
             title = m.title,
             director = m.director,
             cast = m.cast,
             country = m.country,
             release_year = m.release_year,
             rating = m.rating,
             duration = m.duration,
             description = m.description,
             Action = m.Action,
             Adventure = m.Adventure,
             Anime_Series_International_TV_Shows = m.Anime_Series_International_TV_Shows,
             British_TV_Shows_Docuseries_International_TV_Shows = m.British_TV_Shows_Docuseries_International_TV_Shows,
             Children = m.Children,
             Comedies = m.Comedies,
             Comedies_Dramas_International_Movies = m.Comedies_Dramas_International_Movies,
             Comedies_International_Movies = m.Comedies_International_Movies,
             Comedies_Romantic_Movies = m.Comedies_Romantic_Movies,
             Crime_TV_Shows_Docuseries = m.Crime_TV_Shows_Docuseries,
             Documentaries = m.Documentaries,
             Documentaries_International_Movies = m.Documentaries_International_Movies,
             Docuseries = m.Docuseries,
             Dramas = m.Dramas,
             Dramas_International_Movies = m.Dramas_International_Movies,
             Dramas_Romantic_Movies = m.Dramas_Romantic_Movies,
             Family_Movies = m.Family_Movies,
             Fantasy = m.Fantasy,
             Horror_Movies = m.Horror_Movies,
             International_Movies_Thrillers = m.International_Movies_Thrillers,
             International_TV_Shows_Romantic_TV_Shows_TV_Dramas = m.International_TV_Shows_Romantic_TV_Shows_TV_Dramas,
             Kids_TV = m.Kids_TV,
             Language_TV_Shows = m.Language_TV_Shows,
             Musicals = m.Musicals,
             Nature_TV = m.Nature_TV,
             Reality_TV = m.Reality_TV,
             Spirituality = m.Spirituality,
             TV_Action = m.TV_Action,
             TV_Comedies = m.TV_Comedies,
             TV_Dramas = m.TV_Dramas,
             Talk_Shows_TV_Comedies = m.Talk_Shows_TV_Comedies,
             Thrillers = m.Thrillers
         })
        .ToListAsync();

    return Ok(recommendations);
}

    [Authorize(Roles = "AuthenticatedCustomer, Admin")]
    [HttpGet("GetAverageRating/{showId}")]
    public async Task<IActionResult> GetAverageRating(string showId)
    {
        var averageRating = await _movieContext.movies_ratings
            .Where(r => r.show_id == showId)
            .AverageAsync(r => (double?)r.rating) ?? 0;

        return Ok(new { showId, averageRating = Math.Round(averageRating, 1) }); // rounding for UI friendliness
    }

    [Authorize(Roles = "AuthenticatedCustomer, Admin")]
    [HttpPost("RateMovie")]
    public async Task<IActionResult> RateMovie([FromBody] RateMovieRequest request)
    {
        // Get the logged-in user's email from claims
        var userEmail = User.Identity?.Name;

        // Find the user in the movies_users table
        var user = await _movieContext.movies_users
            .FirstOrDefaultAsync(u => u.email.ToLower() == userEmail.ToLower());

        if (user == null)
            return Unauthorized(new { message = "User not found." });

        var userId = user.user_id;

        // Check if the user already has a rating for this movie
        var existingRating = await _movieContext.movies_ratings
            .FirstOrDefaultAsync(r =>
                r.user_id == userId &&
                r.show_id.ToLower() == request.show_id.ToLower()
            );

        if (existingRating != null)
        {
            // ✅ Update existing rating
            existingRating.rating = (byte)request.rating; // Ensure byte type
            _movieContext.movies_ratings.Update(existingRating);
        }
        else
        {
            // ✅ Insert new rating
            var newRating = new MoviesRating
            {
                user_id = userId,
                show_id = request.show_id,
                rating = (byte)request.rating
            };

            _movieContext.movies_ratings.Add(newRating);
        }

        await _movieContext.SaveChangesAsync();

        return Ok(new { message = "Rating submitted successfully." });
    }

    [Authorize(Roles = "AuthenticatedCustomer, Admin")]
    [HttpGet("GetUserRating/{showId}")]
    public async Task<IActionResult> GetUserRating(string showId)
    {
        var userEmail = User.Identity?.Name;

        // Find the user in movies_users table
        var user = await _movieContext.movies_users
            .FirstOrDefaultAsync(u => u.email.ToLower() == userEmail.ToLower());

        if (user == null)
            return Unauthorized(new { message = "User not found." });

        var userId = user.user_id;

        var existingRating = await _movieContext.movies_ratings
            .FirstOrDefaultAsync(r =>
                r.user_id == userId &&
                r.show_id.ToLower() == showId.ToLower()
            );

        if (existingRating != null)
        {
            return Ok(new { userRating = existingRating.rating });
        }
        else
        {
            return Ok(new { userRating = (int?)null });
        }
    }

    [HttpGet("recommendations/{show_id}")]
    public async Task<IActionResult> GetSimilarMovies(string show_id)
    {
        // Get all recommendation titles based on the given show_id
        var recommendedTitles = await _movieContext.movie_recommendations
            .Where(r => r.Show_Id == show_id)
            .Select(r => r.Title)
            .ToListAsync();

        if (recommendedTitles == null || !recommendedTitles.Any())
            return NotFound("No recommendations found for this show_id");

        // Join with movie_titles to get full movie details
        var similarMovies = await _movieContext.movies_titles
            .Where(m => recommendedTitles.Contains(m.title))
            .Select(m => new Movie
            {
                show_id = m.show_id,
                type = m.type,
                title = m.title,
                director = m.director,
                cast = m.cast,
                country = m.country,
                release_year = m.release_year,
                rating = m.rating,
                duration = m.duration,
                description = m.description,
                Action = m.Action,
                Adventure = m.Adventure,
                Anime_Series_International_TV_Shows = m.Anime_Series_International_TV_Shows,
                British_TV_Shows_Docuseries_International_TV_Shows = m.British_TV_Shows_Docuseries_International_TV_Shows,
                Children = m.Children,
                Comedies = m.Comedies,
                Comedies_Dramas_International_Movies = m.Comedies_Dramas_International_Movies,
                Comedies_International_Movies = m.Comedies_International_Movies,
                Comedies_Romantic_Movies = m.Comedies_Romantic_Movies,
                Crime_TV_Shows_Docuseries = m.Crime_TV_Shows_Docuseries,
                Documentaries = m.Documentaries,
                Documentaries_International_Movies = m.Documentaries_International_Movies,
                Docuseries = m.Docuseries,
                Dramas = m.Dramas,
                Dramas_International_Movies = m.Dramas_International_Movies,
                Dramas_Romantic_Movies = m.Dramas_Romantic_Movies,
                Family_Movies = m.Family_Movies,
                Fantasy = m.Fantasy,
                Horror_Movies = m.Horror_Movies,
                International_Movies_Thrillers = m.International_Movies_Thrillers,
                International_TV_Shows_Romantic_TV_Shows_TV_Dramas = m.International_TV_Shows_Romantic_TV_Shows_TV_Dramas,
                Kids_TV = m.Kids_TV,
                Language_TV_Shows = m.Language_TV_Shows,
                Musicals = m.Musicals,
                Nature_TV = m.Nature_TV,
                Reality_TV = m.Reality_TV,
                Spirituality = m.Spirituality,
                TV_Action = m.TV_Action,
                TV_Comedies = m.TV_Comedies,
                TV_Dramas = m.TV_Dramas,
                Talk_Shows_TV_Comedies = m.Talk_Shows_TV_Comedies,
                Thrillers = m.Thrillers
            })
            .ToListAsync();

        return Ok(similarMovies);
    }
    
    [HttpPost("UploadPoster")]
    public async Task<IActionResult> UploadPoster([FromForm] IFormFile image, [FromForm] string filename) // Changed parameter name to 'filename'
    {
        if (image == null || string.IsNullOrWhiteSpace(filename)) // Using 'filename'
        {
            return BadRequest("Missing image or filename");
        }

        // Sanitize the filename on the backend for extra security
        var cleanFilename = Regex.Replace(filename, @"[^a-zA-Z0-9\s-]", "").Trim();
        cleanFilename = Regex.Replace(cleanFilename, @"\s+", "-"); // Replace spaces with hyphens for filename safety

        var blobServiceClient = new BlobServiceClient(_config.GetConnectionString("AzureBlobStorage"));
        var containerClient = blobServiceClient.GetBlobContainerClient("movieposter");
        await containerClient.CreateIfNotExistsAsync();
        await containerClient.SetAccessPolicyAsync(PublicAccessType.Blob);

        var blobName = $"Movie Posters/{cleanFilename}.jpg"; // Use the sanitized filename
        var blobClient = containerClient.GetBlobClient(blobName);

        using var stream = image.OpenReadStream();
        await blobClient.UploadAsync(stream, overwrite: true);

        return Ok(new { message = "Image uploaded successfully" });
    }

    [Authorize(Roles = "AuthenticatedCustomer, Admin")]
    [HttpGet("TopRatedMovies")]
    public IActionResult GetTopRatedMovies()
    {
        var topRated = _movieContext.movies_ratings
            .GroupBy(r => r.show_id)
            .Select(g => new
            {
                ShowId = g.Key,
                RatingCount = g.Count(),
                AverageRating = g.Average(r => r.rating)
            })
            .OrderByDescending(g => g.RatingCount)
            .Take(5)
            .ToList();

        var movies = _movieContext.movies_titles
            .Where(m => topRated.Select(r => r.ShowId).Contains(m.show_id))
            .ToList();

        return Ok(movies);
    }

    [Authorize(Roles = "AuthenticatedCustomer, Admin")]
    [HttpGet("GetMovieRatingsCount/{showId}")]
    public IActionResult GetMovieRatingsCount(string showId)
    {
        var ratings = _movieContext.movies_ratings
            .Where(r => r.show_id == showId);

        var count = ratings.Count();
        var avg = ratings.Any() ? ratings.Average(r => r.rating) : 0;

        return Ok(new { ratingCount = count, averageRating = Math.Round(avg, 1) });
    }

    }
    
}
        