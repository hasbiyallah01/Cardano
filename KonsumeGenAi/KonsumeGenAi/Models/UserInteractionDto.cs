using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Seek.Models
{
    public class UserInteractionDto
    {
        public string Question { get; set; }
        public string Response { get; set; }
    }
}
