using System.Text.Json.Serialization;

namespace Seek.Models
{
    public class BlogResponse
    {
        [JsonPropertyName("content")]
        public string Content { get; set; }
    }
}

