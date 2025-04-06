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
    public class CompetitionController : ControllerBase
    {
        private CompetitionDbContext _competitionDbContext;
        public CompetitionController(CompetitionDbContext temp)
        {
            _competitionDbContext = temp;
        }
        [HttpGet("GetRootbeers")]
        public IActionResult GetRootbeers(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? containers = null)
        {
            var query = _competitionDbContext.Rootbeers.AsQueryable();

            if (containers != null && containers.Any())
            {
                query = query.Where(c => containers.Contains(c.Container ?? string.Empty));
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
            var containerTypes = _competitionDbContext.Rootbeers
                .Select(c => c.Container)
                .Distinct()
                .ToList();
            
            return Ok(containerTypes);
        }
    }
}
