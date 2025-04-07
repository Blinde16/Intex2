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
        [HttpGet("GetRootbeers")]
        public IActionResult GetRootbeers(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? types = null)
        {
            var query = _movieContext.Movies.AsQueryable();

            if (types != null && types.Any())
            {
                query = query.Where(c => types.Contains(c.type ?? string.Empty));
            }

            var totalNumBrews = query.Count();
            var brews = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var returnBrews = new
            {
                Brews = brews,
                TotalNumProjects = totalNumBrews
            };
            
            return Ok(returnBrews);
        }

        [HttpGet("GetContainerTypes")]
        public IActionResult GetContainerTypes()
        {
            var categoryTypes = _movieContext.Movies
                .Select(c => c.type)
                .Distinct()
                .ToList();
            
            return Ok(categoryTypes);
        }
    }
}
