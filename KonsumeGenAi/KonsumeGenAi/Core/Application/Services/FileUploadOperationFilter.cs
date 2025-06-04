using NativeWebSocket;
using NAudio.Wave;
using System.Text;

public class VoiceConversationService
{
    private WaveInEvent _waveIn;
    private MemoryStream _audioStream;
    private bool _isRecording = false;
    private IWebSocket _webSocket;
    private const string HumeApiUrl = "wss://api.hume.ai/v0/stream/models";
    private byte[] _lastAudioResponse;

    public async Task InitializeWebSocket()
    {
        _webSocket = WebSocket.Create(HumeApiUrl);

        _webSocket.OnOpen += () => Console.WriteLine("WebSocket connected.");
        _webSocket.OnMessage += (data) => HandleWebSocketMessage(data);
        _webSocket.OnError += (error) => Console.WriteLine("WebSocket error: " + error);
        _webSocket.OnClose += (e) => Console.WriteLine("WebSocket connection closed.");

        await _webSocket.Connect();
    }

    public void StartRecording()
    {
        _waveIn = new WaveInEvent
        {
            WaveFormat = new WaveFormat(16000, 16, 1) // Setting for mono audio at 16kHz sample rate
        };

        _waveIn.DataAvailable += OnDataAvailable;
        _waveIn.RecordingStopped += OnRecordingStopped;

        _audioStream = new MemoryStream();
        _waveIn.StartRecording();
        _isRecording = true;
    }

    public void StopRecording()
    {
        if (_waveIn != null)
        {
            _waveIn.StopRecording();
        }
        _isRecording = false;
    }

    public async Task DisconnectWebSocket()
    {
        if (_webSocket != null && _webSocket.State == WebSocketState.Open)
        {
            await _webSocket.Close();
        }
    }

    private void OnDataAvailable(object sender, WaveInEventArgs e)
    {
        if (_isRecording)
        {
            _audioStream.Write(e.Buffer, 0, e.BytesRecorded);
            SendAudioToHumeAI(e.Buffer);
        }
    }

    private async void SendAudioToHumeAI(byte[] audioData)
    {
        if (_webSocket.State == WebSocketState.Open)
        {
            string base64Audio = Convert.ToBase64String(audioData);
            string jsonPayload = $"{{\"type\":\"audio_input\",\"data\":\"{base64Audio}\"}}";

            await _webSocket.SendText(jsonPayload);
            Console.WriteLine("Sent audio to Hume AI...");
        }
        else
        {
            Console.WriteLine("WebSocket not open. Audio not sent.");
        }
    }

    private void HandleWebSocketMessage(byte[] data)
    {
        string responseData = Encoding.UTF8.GetString(data);
        Console.WriteLine("Received from Hume AI: " + responseData);

        try
        {
            // Assuming the response contains base64 audio data
            _lastAudioResponse = Convert.FromBase64String(responseData);
            PlayResponseAudio(_lastAudioResponse);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error processing response: " + ex.Message);
        }
    }

    private void PlayResponseAudio(byte[] audioData)
    {
        using (var ms = new MemoryStream(audioData))
        using (var rdr = new WaveFileReader(ms))
        using (var wo = new WaveOutEvent())
        {
            wo.Init(rdr);
            wo.Play();
            while (wo.PlaybackState == PlaybackState.Playing)
            {
                Thread.Sleep(100);
            }
        }

        Console.WriteLine("Playing response audio...");
    }

    private void OnRecordingStopped(object sender, StoppedEventArgs e)
    {
        _waveIn.Dispose();
        Console.WriteLine("Recording stopped.");
    }

    public byte[] GetLastAudioResponse()
    {
        return _lastAudioResponse;
    }
}



/*public class VoiceConversationService
{
    private WaveInEvent _waveIn;
    private MemoryStream _audioStream;
    private bool _isRecording = false;
    private IWebSocket _webSocket;
    private const string HumeApiUrl = "wss://api.hume.ai/v0/stream/models";
    private byte[] _lastAudioResponse;

    public async Task InitializeWebSocket()
    {
        _webSocket = WebSocket.Create(HumeApiUrl);

        _webSocket.OnOpen += () => Console.WriteLine("WebSocket connected.");
        _webSocket.OnMessage += (data) => HandleWebSocketMessage(data);
        _webSocket.OnError += (error) => Console.WriteLine("WebSocket error: " + error);
        _webSocket.OnClose += (e) => Console.WriteLine("WebSocket connection closed.");

        await _webSocket.Connect();
    }

    public void StartRecording()
    {
        _waveIn = new WaveInEvent
        {
            WaveFormat = new WaveFormat(16000, 16, 1)
        };

        _waveIn.DataAvailable += OnDataAvailable;
        _waveIn.RecordingStopped += OnRecordingStopped;

        _audioStream = new MemoryStream();
        _waveIn.StartRecording();
        _isRecording = true;
    }

    public void StopRecording()
    {
        if (_waveIn != null)
        {
            _waveIn.StopRecording();
        }
        _isRecording = false;
    }

    public async Task DisconnectWebSocket()
    {
        if (_webSocket != null && _webSocket.State == WebSocketState.Open)
        {
            await _webSocket.Close();
        }
    }

    private void OnDataAvailable(object sender, WaveInEventArgs e)
    {
        if (_isRecording)
        {
            _audioStream.Write(e.Buffer, 0, e.BytesRecorded);
            SendAudioToHumeAI(e.Buffer);
        }
    }

    private async void SendAudioToHumeAI(byte[] audioData)
    {
        if (_webSocket.State == WebSocketState.Open)
        {
            string base64Audio = Convert.ToBase64String(audioData);
            string jsonPayload = $"{{\"type\":\"audio_input\",\"data\":\"{base64Audio}\"}}";

            await _webSocket.SendText(jsonPayload);
            Console.WriteLine("Sent audio to Hume AI...");
        }
        else
        {
            Console.WriteLine("WebSocket not open. Audio not sent.");
        }
    }

    private void HandleWebSocketMessage(byte[] data)
    {
        string responseData = Encoding.UTF8.GetString(data);
        Console.WriteLine("Received from Hume AI: " + responseData);

        try
        {
            PlayResponseAudio(responseData);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error processing response: " + ex.Message);
        }
    }

    private void PlayResponseAudio(string responseData)
    {
        byte[] audioBytes = Convert.FromBase64String(responseData);

        using (var ms = new MemoryStream(audioBytes))
        using (var rdr = new WaveFileReader(ms))
        using (var wo = new WaveOutEvent())
        {
            wo.Init(rdr);
            wo.Play();
            while (wo.PlaybackState == PlaybackState.Playing)
            {
                Thread.Sleep(100);
            }
        }

        Console.WriteLine("Playing response audio...");
    }

    private void OnRecordingStopped(object sender, StoppedEventArgs e)
    {
        _waveIn.Dispose();
        Console.WriteLine("Recording stopped.");
    }

    private void HandleWebSocketMessage(byte[] data)
    {
        string responseData = Encoding.UTF8.GetString(data);
        Console.WriteLine("Received from Hume AI: " + responseData);

        try
        {
            // Store the audio response
            _lastAudioResponse = Convert.FromBase64String(responseData);
            PlayResponseAudio(responseData); 
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error processing response: " + ex.Message);
        }
    }
    public byte[] GetLastAudioResponse()
    {
        return _lastAudioResponse;
    }
}
class VoiceConversation
{
    private static WaveInEvent waveIn;
    private static MemoryStream audioStream;
    private static bool isRecording = false;
    private static IWebSocket webSocket;
    private static string humeApiUrl = "wss://api.hume.ai/v0/stream/models"; // Replace with actual WebSocket URL

    static async Task Main(string[] args)
    {
        // Set up WebSocket connection
        await SetupWebSocket();

        // Start capturing audio from the microphone
        StartRecording();

        Console.WriteLine("Voice conversation started. Speak to interact...");

        // Keep the console running
        Console.ReadLine();

        // Stop recording and close WebSocket
        StopRecording();
        await webSocket.Close();
    }

    // Set up WebSocket communication
    static async Task SetupWebSocket()
    {
        webSocket = WebSocket.Create(humeApiUrl);

        // Attach WebSocket event handlers
        webSocket.OnOpen += () =>
        {
            Console.WriteLine("WebSocket connected.");
        };

        webSocket.OnMessage += (data) =>
        {
            string responseData = Encoding.UTF8.GetString(data);
            Console.WriteLine("Received from Hume AI: " + responseData);

            // Process and play response audio (if applicable)
            PlayResponseAudio(responseData);
        };

        webSocket.OnError += (error) =>
        {
            Console.WriteLine("WebSocket error: " + error);
        };

        webSocket.OnClose += (e) =>
        {
            Console.WriteLine("WebSocket connection closed.");
        };

        // Connect to WebSocket server
        await webSocket.Connect();
    }

    // Start capturing audio input
    static void StartRecording()
    {
        waveIn = new WaveInEvent
        {
            WaveFormat = new WaveFormat(16000, 16, 1) // Set 16kHz, mono format
        };
        waveIn.DataAvailable += OnDataAvailable;
        waveIn.RecordingStopped += OnRecordingStopped;

        audioStream = new MemoryStream();
        waveIn.StartRecording();
        isRecording = true;
    }

    // Called when audio data is available from the microphone
    static void OnDataAvailable(object sender, WaveInEventArgs e)
    {
        if (isRecording)
        {
            // Append the captured audio data to the memory stream
            audioStream.Write(e.Buffer, 0, e.BytesRecorded);

            // Send captured audio data to Hume AI
            SendAudioToHumeAI(e.Buffer);
        }
    }

    // Send audio data to Hume AI via WebSocket
    static async void SendAudioToHumeAI(byte[] audioData)
    {
        if (webSocket.State == WebSocketState.Open)
        {
            // Convert the audio data to base64 (or other format required by Hume)
            string base64Audio = Convert.ToBase64String(audioData);

            // Construct the payload (simplified)
            string jsonPayload = $"{{\"type\":\"audio_input\",\"data\":\"{base64Audio}\"}}";

            // Send the audio data to Hume AI
            await webSocket.SendText(jsonPayload);
            Console.WriteLine("Sent audio to Hume AI...");
        }
        else
        {
            Console.WriteLine("WebSocket not open. Audio not sent.");
        }
    }

    // Placeholder method to simulate audio response playback
    static void PlayResponseAudio(string responseData)
    {
        // In practice, the response from Hume AI might be audio data or emotional analysis.
        // If it is audio data, decode and play it.

        try
        {
            byte[] audioBytes = Convert.FromBase64String(responseData); // Assume response is base64 audio data

            using (var ms = new MemoryStream(audioBytes))
            using (var rdr = new WaveFileReader(ms))
            using (var wo = new WaveOutEvent())
            {
                wo.Init(rdr);
                wo.Play();
                while (wo.PlaybackState == PlaybackState.Playing)
                {
                    Thread.Sleep(100);
                }
            }

            Console.WriteLine("Playing response audio...");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Failed to play response audio: " + ex.Message);
        }
    }

    // Stop recording
    static void StopRecording()
    {
        if (waveIn != null)
        {
            waveIn.StopRecording();
        }
        isRecording = false;
    }

    // Called when recording stops
    static void OnRecordingStopped(object sender, StoppedEventArgs e)
    {
        waveIn.Dispose();
        Console.WriteLine("Recording stopped.");
    }
}

*/



/*public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileUploadMethods = context.MethodInfo.GetCustomAttributes(true)
            .OfType<ConsumesAttribute>()
            .SelectMany(attr => attr.ContentTypes)
            .Any(ct => ct.Equals("multipart/form-data", StringComparison.OrdinalIgnoreCase));

        if (fileUploadMethods)
        {
            operation.RequestBody = new OpenApiRequestBody
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    {
                        "multipart/form-data", new OpenApiMediaType
                        {
                            Schema = new OpenApiSchema
                            {
                                Type = "object",
                                Properties = new Dictionary<string, OpenApiSchema>
                                {
                                    {
                                        "audioFile", new OpenApiSchema
                                        {
                                            Type = "string",
                                            Format = "binary"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
        }
    }
}*/