using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
                Brews = brews,
                TotalNumProjects = totalNumMovies
            };
            
            return Ok(returnMovies);
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
    }
}
