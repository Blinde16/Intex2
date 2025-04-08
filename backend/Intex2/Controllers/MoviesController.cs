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
        [HttpGet("GetMovies")]
public IActionResult GetMovies([FromQuery] string? afterId, [FromQuery] string[]? containers)
{
    int pageSize = 10; // or tweak as needed

    IQueryable<Movie> query = _movieContext.movies_titles
        .OrderBy(m => m.show_id); // or by created time or something stable

    if (!string.IsNullOrEmpty(afterId))
    {
        query = query.Where(m => String.Compare(m.show_id, afterId) > 0);
    }

    if (containers != null && containers.Length > 0)
    {
        query = query.Where(m => containers.Contains(m.type));
    }

    var movies = query.Take(pageSize).ToList();

    return Ok(new
    {
        brews = movies
    });
}


        [HttpGet("GetCategoryTypes")]
        public IActionResult GetCategoryTypes()
        {
            var categoryTypes = _movieContext.movies_titles
                .Select(c => c.type)
                .Distinct()
                .ToList();
            
            return Ok(categoryTypes);
        }
        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] Movie newMovie)
        {
            _movieContext.movies_titles.Add(newMovie);
            _movieContext.SaveChanges();
            return Ok(newMovie);
        }

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
		
        [HttpGet("adventure")]
    public async Task<IActionResult> GetAdventureRecommendations()
    {
        var userEmail = User.Identity.Name;

        var user = await _movieContext.movies_users
            .FirstOrDefaultAsync(u => u.email == userEmail);

        if (user == null)
            return NotFound("User not found");

        var recommendations = await (from r in _movieContext.user_recommendations
                                     join m in _movieContext.movies_titles on r.Title equals m.title
                                     where r.User_Id == user.user_id && r.Genre == "Adventure"
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
Thrillers = m.Thrillers,




                                     })
                                     .Take(5)
                                     .ToListAsync();

        return Ok(recommendations);
    }
}

    }

