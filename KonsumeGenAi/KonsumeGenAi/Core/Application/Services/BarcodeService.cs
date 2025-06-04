using System.Text.Json;
using OpenAI_API.Chat;
using Seek.Core.Application.Interfaces.Repositories;
using Seek.Core.Domain.Entities;
using SeekGenAi.Core.Application.Interfaces.Services;
using OpenAI_API;
using System.Text.RegularExpressions;
using SeekGenAi.Core.Domain.Entities;
using SeekGenAi.Core.Application.Interfaces.Repositories;
using Seek.Models;

public class BarcodeService : IBarcodeService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly IProfileRepository _profileRepository;
    private readonly IConfiguration _configuration;
    private readonly IProductRepository _productRepository;

    public BarcodeService(IConfiguration configuration, HttpClient httpClient, IProfileRepository profileRepository, IProductRepository productRepository)
    {
        _httpClient = httpClient;
        _apiKey = configuration["UPCService:ApiKey"];
        _baseUrl = configuration["UPCService:BaseUrl"];
        _profileRepository = profileRepository;
        _configuration = configuration;
        _productRepository = productRepository;

        if (string.IsNullOrWhiteSpace(_apiKey) || string.IsNullOrWhiteSpace(_baseUrl))
        {
            throw new ArgumentException("UPC API Key or BaseUrl is missing in appsettings.json.");
        }
    }
    public async Task<Product> DecodeBarcodeAsync(string barcode, int ProfileId)
    {
        var product = await LookupBarcodeAsync(barcode);
        var parsedProducts = ParseProductData(product);
        if (parsedProducts != null)
        {
            var profile = await _profileRepository.GetAsync(ProfileId);
            if (profile == null)
            {
                throw new Exception("Profile doesnt exist.");
            }
            var productsDetails = await GenerateProductDetails(parsedProducts.Product.Name, profile);
            var parsedProduct = await ParseProduct(productsDetails);
            var recommendation = await GetProductRecommendation(parsedProduct.Name);
            var scannedProduct = new Product
            {
                ProfileId = ProfileId,
                Name = parsedProduct.Name,
                Category = parsedProduct.Category,
                Price = parsedProduct.Price,
                Usage = parsedProduct.Usage,
                Ingredients = parsedProduct.Ingredients,
                Alternatives = recommendation.Alternatives,
                HealthCompatibility = recommendation.HealthAnalysis.HealthCompatibility,
                HealthImpactAndRisk = recommendation.HealthAnalysis.HealthImpactAndRisk,

            };
            await _productRepository.GenerateProductAsync(scannedProduct);
            return scannedProduct;
        }
        else
        {
            throw new Exception("No barcode detected.");
        }
    }
    public async Task<Product> Search(string productname, int ProfileId)
    {
        if (productname != null)
        {
            var profile = await _profileRepository.GetAsync(ProfileId);
            var productsDetails = await GenerateProductDetails(productname, profile);
            var parsedProduct =  await ParseProduct(productsDetails);
            var recommendation = await GetProductRecommendation(productname);
            var scannedProduct = new Product
            {
                ProfileId = ProfileId,
                Name = productname,
                Category = parsedProduct.Category,
                Price = parsedProduct.Price,
                Usage = parsedProduct.Usage,
                Ingredients = parsedProduct.Ingredients,
                Alternatives = recommendation.Alternatives,
                HealthCompatibility = recommendation.HealthAnalysis.HealthCompatibility,
                HealthImpactAndRisk = recommendation.HealthAnalysis.HealthImpactAndRisk,
            };
            await _productRepository.GenerateProductAsync(scannedProduct);
            return scannedProduct;
        }
        else
        {
            throw new Exception("No barcode detected.");
        }
    }
    private async Task<string> LookupBarcodeAsync(string barcode)
    {
        if (string.IsNullOrWhiteSpace(barcode))
        {
            return "Error: Barcode cannot be null or empty.";
        }

        string requestUrl = $"{_baseUrl}{barcode}";
        using var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
        request.Headers.Add("Authorization", $"Bearer {_apiKey}");

        using HttpResponseMessage response = await _httpClient.SendAsync(request);
        string responseBody = await response.Content.ReadAsStringAsync();

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return "Error: Product not found.";
        }

        if (!response.IsSuccessStatusCode)
        {
            return $"Error: API request failed with status {response.StatusCode}. Response: {responseBody}";
        }

        return responseBody;
    }
    private string GeneratePrompt(Profile userProfile, string productDetail)
    {
        var age = CalculateAge(userProfile.DateOfBirth);
        var skinType = userProfile.SkinType ?? "unspecified";
        var goals = userProfile.UserGoals;

        var goalsDescription = (goals != null && goals.Any()) ? string.Join(", ", goals) : "maintain healthy skin";
        var ageDescription = (age != 0) ? age.ToString() : "of unspecified age";

        return $"Analyze the ingredients of {productDetail}, provide a safety score for" +
            $" the product, and give a risk breakdown based on my skin profile. I am a " +
            $"{ageDescription}-year-old {userProfile.Gender} with {skinType} skin " +
            $"aiming to {goalsDescription}. Highlight any potential risks (e.g.," +
            $" allergens, pollutants, endocrine disruptors, and others), side effects," +
            $" and regulatory concerns.";
    }
    static async Task<Product> ParseProduct(string input)
    {
        string[] parts = input.Split('$');
        if (parts.Length < 4) throw new Exception("Invalid product format");

        var product = new Product
        {
            Name = parts[0].Trim(),
            Price = parts[1].Trim(),
            Category = parts[2].Trim(),
            Usage = parts[3].Trim()
        };

        product.Ingredients = await ParseIngredients(input);
        return product;
    }
    static async Task<List<Ingredient>> ParseIngredients(string input)
    {
        return await Task.Run(() =>
        {
            var ingredients = new List<Ingredient>();
            string pattern = @"= (.*?) \? (.*?) \? (.*?) \? (.*?) \? (.*?) \?";

            foreach (Match match in Regex.Matches(input, pattern))
            {
                ingredients.Add(CreateIngredient(match));
            }

            return ingredients;
        });
    }
    static Ingredient CreateIngredient(Match match)
    {
        return new Ingredient
        {
            Name = match.Groups[1].Value.Trim(),
            Category = match.Groups[2].Value.Trim(),
            Concerns = ExtractConcerns(match.Groups[3].Value),
            Usage = match.Groups[4].Value.Trim(),
            RiskLevel = match.Groups[5].Value.Trim()
        };
    }
    static List<string> ExtractConcerns(string concerns)
    {
        return concerns.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                       .Select(c => c.Trim()).ToList();
    }
    private int CalculateAge(DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth.Date > today.AddYears(-age)) age--;
        return age;
    }
    private async Task<string> GetAIResponse(string apiKey, string prompt)
    {
        var openai = new OpenAIAPI(apiKey);
        var chatRequest = new ChatRequest
        {
            Model = "ft:gpt-4o-mini-2024-07-18:personal:seekai:B3jXPVIQ",
            Messages = new[]
            {
                new ChatMessage(ChatMessageRole.System, "\"You are an AI assistant that" +
                " provides detailed ingredient analysis and safety assessments for " +
                "skincare products. You classify ingredients based on their risk levels" +
                " (high, medium, low) and provide explanations, including potential " +
                "side effects, chemical functions, and regulatory concerns. You also" +
                " generate an overall safety score based on the user's skin type, age," +
                " and gender.\""),
                new ChatMessage(ChatMessageRole.User, prompt)
            }
        };

        var result = await openai.Chat.CreateChatCompletionAsync(chatRequest);
        return result.Choices.Count > 0 ? result.Choices[0].Message.Content : "No response from AI.";
    }
    private async Task<ProductRecommendationResponse> GetProductRecommendation(string productName)
    {
        if (string.IsNullOrWhiteSpace(productName))
        {
            throw new ArgumentException("Product name cannot be empty", nameof(productName));
        }
        string apiKey = _configuration["OpenAI:APIKey"];
        var openai = new OpenAIAPI(apiKey);
        var chatRequest = new ChatRequest
        {
            Model = "gpt-4",
            Messages = new[]
            {
            new ChatMessage(ChatMessageRole.System, GetSystemPrompt()),
            new ChatMessage(ChatMessageRole.User, $"Analyze {productName} and suggest two better alternatives.")
        }
        };

        try
        {
            var chatResult = await openai.Chat.CreateChatCompletionAsync(chatRequest);
            return ParseResponse(chatResult.Choices[0].Message.Content);
        }
        catch (Exception ex)
        {
            throw new ApplicationException("Failed to get product recommendation", ex);
        }
    }
    private static string GetSystemPrompt() => @"You are an AI expert in product recommendations and health analysis. Given a product name, you must strictly return:

                                                1️⃣ **Two Better Alternatives** (with ratings out of 100)
                                                2️⃣ **Health Analysis** in two paragraphs:
                                                    - **Health Compatibility:** (One paragraph)
                                                    - **Health Impact & Risk Analysis:** (One paragraph)

                                                STRICT FORMAT:
                                                - **Alternative 1**
                                                    - **Rating:** (value/100)
                                                    - **Product:** (name)
                                                - **Alternative 2**
                                                    - **Rating:** (value/100)
                                                    - **Product:** (name)

                                                **Health Analysis:**
                                                    - **Health Compatibility:** (One paragraph)
                                                    - **Health Impact & Risk Analysis:** (One paragraph)

                                                DO NOT include extra text, introductions, conclusions, or explanations.";
    private static ProductRecommendationResponse ParseResponse(string response)
    {
        var recommendation = new ProductRecommendationResponse();

        var alternativePattern = @"- \*\*Alternative (\d+)\*\*\s*\n\s*- \*\*Rating:\*\* (\d+)/100\s*\n\s*- \*\*Product:\*\* (.*?)(?=\n|$)";
        var matches = Regex.Matches(response, alternativePattern, RegexOptions.Singleline);

        foreach (Match match in matches)
        {
            if (match.Groups.Count == 4)
            {
                recommendation.Alternatives.Add(new ProductAlternative
                {
                    ProductName = match.Groups[3].Value.Trim(),
                    Rating = int.Parse(match.Groups[2].Value.Trim())
                });
            }
        }

        var healthPattern = @"\*\*Health Analysis:\*\*\s*\n\s*- \*\*Health Compatibility:\*\* (.*?)\n\s*- \*\*Health Impact & Risk Analysis:\*\* (.*)";
        var healthMatches = Regex.Match(response, healthPattern, RegexOptions.Singleline);

        if (healthMatches.Success)
        {
            recommendation.HealthAnalysis = new ProductHealthAnalysis
            {
                HealthCompatibility = healthMatches.Groups[1].Value.Trim(),
                HealthImpactAndRisk = healthMatches.Groups[2].Value.Trim()
            };
        }

        if (!recommendation.Alternatives.Any() || recommendation.HealthAnalysis == null)
        {
            throw new ApplicationException("Failed to parse complete product recommendation data");
        }

        return recommendation;
    }
    public async Task<string> GenerateProductDetails(string product, Profile profile)
    {

        var apiKey = _configuration["OpenAI:ApiKey"];
        var prompt = GeneratePrompt(profile, product);
        var aiResponse = await GetAIResponse(apiKey, prompt);

        return aiResponse;
    }
    public static ProductData ParseProductData(string jsonString)
    {
        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<ProductData>(jsonString, options);
        }
        catch (JsonException ex)
        {
            throw new Exception($"Error parsing JSON: {ex.Message}");
        }
    }

    public async Task<BaseResponse<ICollection<Product>>> GetRecentScans(int profileId)
    {
        var response = await _productRepository.GetProductByProfileIdAsync(profileId);
        if (response == null)
        {
            return new BaseResponse<ICollection<Product>>
            {
                 IsSuccessful = false,
                 Message = "User Hasnot searched for any product",
                 Value = null
            };
        }
        return new BaseResponse<ICollection<Product>>
        {
            IsSuccessful = true,
            Message = "List of searched Products",
            Value = response
        };
    }
}
