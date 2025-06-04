/*using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class VoiceConversationController : ControllerBase
{
    private readonly VoiceConversationService _voiceService;

    public VoiceConversationController()
    {
        _voiceService = new VoiceConversationService();
    }

    [HttpPost("start")]
    [SwaggerOperation(Summary = "Start a voice conversation", Description = "Initializes WebSocket and starts recording audio.")]
    [ProducesResponseType(200)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> StartConversation()
    {
        try
        {
            Console.WriteLine("Initializing voice conversation...");
            await _voiceService.InitializeWebSocket(); 
            _voiceService.StartRecording(); 
            return Ok("Voice conversation started. Audio is being recorded.");
        }
        catch (PlatformNotSupportedException ex)
        {
            Console.WriteLine($"Platform-specific error: {ex.Message}");
            return StatusCode(500, $"Platform-specific error: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error starting conversation: {ex.Message}");
            return StatusCode(500, $"Error starting conversation: {ex.Message}");
        }
    }

    [HttpPost("stop")]
    [SwaggerOperation(Summary = "Stop a voice conversation", Description = "Stops recording and closes the WebSocket connection.")]
    [ProducesResponseType(200)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> StopConversation()
    {
        try
        {
            Console.WriteLine("Stopping voice conversation...");
            _voiceService.StopRecording(); 
            await _voiceService.DisconnectWebSocket(); 

            byte[] audioResponse = _voiceService.GetLastAudioResponse();
            if (audioResponse != null && audioResponse.Length > 0)
            {
                return Ok("Voice conversation stopped and audio response received.");
            }
            else
            {
                return Ok("Voice conversation stopped, but no audio response was received.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error stopping conversation: {ex.Message}");
            return StatusCode(500, $"Error stopping conversation: {ex.Message}");
        }
    }
}



*//*using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

[ApiController]
[Route("api/[controller]")]
public class VoiceConversationController : ControllerBase
{
    private readonly VoiceConversationService _voiceService;

    public VoiceConversationController()
    {
        _voiceService = new VoiceConversationService();
    }

    [HttpPost("start")]
    [SwaggerOperation(Summary = "Start a voice conversation", Description = "Initializes WebSocket and starts recording audio.")]
    [ProducesResponseType(200)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> StartConversation()
    {
        try
        {
            Console.WriteLine("Initializing voice conversation...");
            await _voiceService.InitializeWebSocket();
            _voiceService.StartRecording();
            return Ok("Voice conversation started.");
        }
        catch (PlatformNotSupportedException ex)
        {
            Console.WriteLine($"Platform-specific error: {ex.Message}");
            return StatusCode(500, $"Platform-specific error: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error starting conversation: {ex.Message}");
            return StatusCode(500, $"Error starting conversation: {ex.Message}");
        }
    }

    [HttpPost("stop")]
    [SwaggerOperation(Summary = "Stop a voice conversation", Description = "Stops recording and closes the WebSocket connection.")]
    [ProducesResponseType(200)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> StopConversation()
    {
        try
        {
            Console.WriteLine("Stopping voice conversation...");
            _voiceService.StopRecording();
            await _voiceService.DisconnectWebSocket();
            return Ok("Voice conversation stopped.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error stopping conversation: {ex.Message}");
            return StatusCode(500, $"Error stopping conversation: {ex.Message}");
        }
    }
}*/






/*using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Seek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoiceChatController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<VoiceChatController> _logger;
        private readonly IConfiguration _configuration;
        private const string HumeApiUrl = "https://api.hume.ai/v1/empathic-voice";

        public VoiceChatController(
            HttpClient httpClient,
            ILogger<VoiceChatController> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

            // Configure HttpClient
            _httpClient.DefaultRequestHeaders.Add("Authorization",
                $"Bearer {_configuration["HumeAI:ApiKey"]}");
        }

        /// <summary>
        /// Analyzes voice audio file using Hume AI API
        /// </summary>
        /// <param name="audioFile">Audio file in WAV format</param>
        /// <returns>Voice analysis results</returns>
        /// 

        [HttpPost("analyze")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AnalyzeVoice(IFormFile audioFile)
        {
            try
            {
                if (audioFile == null || audioFile.Length == 0)
                {
                    _logger.LogWarning("No file uploaded or empty file received");
                    return BadRequest("Please upload a valid audio file.");
                }

                if (!audioFile.ContentType.Equals("audio/wav", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning($"Invalid file type received: {audioFile.ContentType}");
                    return BadRequest("Only WAV audio files are supported.");
                }

                using var memoryStream = new MemoryStream();
                await audioFile.CopyToAsync(memoryStream);
                var audioData = memoryStream.ToArray();

                using var content = new MultipartFormDataContent();
                using var fileContent = new ByteArrayContent(audioData);
                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("audio/wav");
                content.Add(fileContent, "file", audioFile.FileName);

                _logger.LogInformation($"Sending request to Hume AI API for file: {audioFile.FileName}");
                var response = await _httpClient.PostAsync(HumeApiUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Hume AI API returned error: {response.StatusCode}, Content: {errorContent}");
                    return StatusCode((int)response.StatusCode,
                        $"Voice analysis failed: {response.ReasonPhrase}");
                }

                var responseData = await response.Content.ReadAsStringAsync();
                var analysisResult = JsonConvert.DeserializeObject<object>(responseData);

                _logger.LogInformation("Voice analysis completed successfully");
                return Ok(analysisResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing voice analysis request");
                return StatusCode(500, "An error occurred while processing the voice analysis.");
            }
        }

    }
}*/
