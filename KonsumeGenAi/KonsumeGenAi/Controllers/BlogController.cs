﻿using Microsoft.AspNetCore.Mvc;
using OpenAI_API.Chat;
using OpenAI_API;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Seek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly OpenAIAPI _openAIAPI;

        private static readonly (string Title, string Goal, string Category)[] HealthGoals = new[]
        {
            ("Effective Strategies for Healthy Weight Gain", "gain weight", "nutrition"),
            ("Effective Strategies for Healthy Weight Loss", "lose weight", "nutrition"),
            ("Maintaining a Healthy Weight", "maintain weight", "nutrition"),
            ("Nutritional Tips for Building Muscle", "build muscle with diet", "nutrition"),
            ("Nutritional Guidelines for Improved Immunity", "boost immunity with diet", "nutrition"),

            ("Starting a Fitness Journey and Setting Achievable Goals", "start a fitness journey", "fitness"),
            ("Enhancing Athletic Performance Through Diet and Exercise", "enhance athletic performance", "fitness"),
            ("Improving Muscle Tone Through Diet and Exercise", "improve muscle tone", "fitness"),
            ("Building Endurance with Cardio Workouts", "build endurance", "fitness"),
            ("Flexibility Training for Injury Prevention", "improve flexibility", "fitness"),

            ("Benefits of Healthy Eating and Tips for Maintaining a Balanced Diet", "eat healthy", "meals"),
            ("Meal Prep Tips for a Busy Lifestyle", "meal prep for busy lifestyle", "meals"),
            ("Easy and Healthy Breakfast Ideas", "healthy breakfast ideas", "meals"),
            ("Lunch Recipes for Weight Loss", "lunch recipes for weight loss", "meals"),
            ("Dinner Options for Muscle Recovery", "dinner for muscle recovery", "meals"),

            ("Boosting Energy Levels Through Nutrition and Lifestyle Changes", "boost energy level", "nutrition"),
            ("Managing Stress Through Diet, Exercise, and Mindfulness", "manage stress", "others"),
            ("Improving Cardiovascular Strength Through Diet and Exercise", "improve cardiovascular strength", "fitness"),
            ("Sleep and Its Impact on Overall Health", "importance of sleep", "others"),
            ("The Role of Hydration in Physical and Mental Health", "importance of hydration", "others")
        };

        private static DateTime _lastUpdate = DateTime.MinValue;
        private static object _updateLock = new object();
        private static object[] _cachedBlogs;

        public BlogController(IConfiguration configuration)
        {
            _configuration = configuration;
            string apiKey = _configuration["OpenAI:APIKey"];
            _openAIAPI = new OpenAIAPI(apiKey);
        }

        [HttpGet("GenerateAllBlogs")]
        public async Task<IActionResult> GenerateAllBlogs()
        {
            if (DateTime.UtcNow - _lastUpdate < TimeSpan.FromHours(24))
            {
                return Ok(new { content = _cachedBlogs });
            }

            var blogResponses = await GenerateContentForAllGoals();
            lock (_updateLock)
            {
                _cachedBlogs = blogResponses;
                _lastUpdate = DateTime.UtcNow;
            }
            return Ok(new { content = blogResponses });
        }

        private string GeneratePromptForHealthGoal(string healthGoal)
        {
            return healthGoal.ToLower() switch
            {
                "gain weight" => "Write an informative blog post about effective strategies and tips for healthy weight gain.",
                "lose weight" => "Write an informative blog post about effective strategies and tips for healthy weight loss.",
                "maintain weight" => "Write an informative blog post about maintaining a healthy weight.",
                "start a fitness journey" => "Write an informative blog post about starting a fitness journey and setting achievable goals.",
                "enhance athletic performance" => "Write an informative blog post about enhancing athletic performance through diet and exercise.",
                "improve muscle tone" => "Write an informative blog post about improving muscle tone through diet and exercise.",
                "boost energy level" => "Write an informative blog post about boosting energy levels through nutrition and lifestyle changes.",
                "manage stress" => "Write an informative blog post about managing stress through diet, exercise, and mindfulness.",
                "improve cardiovascular strength" => "Write an informative blog post about improving cardiovascular strength through diet and exercise.",
                "eat healthy" => "Write an informative blog post about the benefits of healthy eating and tips for maintaining a balanced diet.",
                "meal prep for busy lifestyle" => "Write a blog post about meal prep tips for a busy lifestyle.",
                "healthy breakfast ideas" => "Write a blog post about easy and healthy breakfast ideas.",
                "lunch recipes for weight loss" => "Write a blog post about lunch recipes for weight loss.",
                "dinner for muscle recovery" => "Write a blog post about dinner options for muscle recovery.",
                "build muscle with diet" => "Write a blog post about nutritional tips for building muscle.",
                "boost immunity with diet" => "Write a blog post about nutritional guidelines for boosting immunity.",
                "build endurance" => "Write a blog post about building endurance with cardio workouts.",
                "improve flexibility" => "Write a blog post about flexibility training for injury prevention.",
                "importance of sleep" => "Write a blog post about the importance of sleep and its impact on overall health.",
                "importance of hydration" => "Write a blog post about the role of hydration in physical and mental health.",
                _ => $"Write an informative blog post about {healthGoal}, with a focus on its impact on nutrition, fitness, or overall body health."
            };
        }

        private async Task<string> GenerateBlogContentForAllGoal(string healthGoal)
        {
            string prompt = GeneratePromptForHealthGoal(healthGoal);

            var chatRequest = new ChatRequest
            {
                Model = "gpt-3.5-turbo",
                Messages = new[] { new ChatMessage(ChatMessageRole.User, $"Write an informative blog post about {prompt}") }
            };

            try
            {
                var result = await _openAIAPI.Chat.CreateChatCompletionAsync(chatRequest);
                var aiResponses = result.Choices.Select(choice => choice.Message.Content).ToArray();
                var responseText = string.Join("\n\n", aiResponses);

                return responseText;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while generating content: {ex.Message}");
                return "An error occurred while generating content.";
            }
        }

        private async Task<string> GenerateBlogContentForGoal(string healthGoal)
        {
            string apiKey = _configuration["OpenAI:APIKey"];
            string prompt = GeneratePromptForHealthGoal(healthGoal);

            var openai = new OpenAIAPI(apiKey);
            var chatRequest = new ChatRequest
            {
                Model = "ft:gpt-3.5-turbo-0613:personal:foodieai:A0W1EPi5",
                Messages = new[]
                {
                        new ChatMessage(ChatMessageRole.System, "FoodieAI is a food and health chatbot."),
                        new ChatMessage(ChatMessageRole.User, prompt)
                    }
            };


            try
            {
                var result = await _openAIAPI.Chat.CreateChatCompletionAsync(chatRequest);
                var aiResponses = result.Choices.Select(choice => choice.Message.Content).ToArray();
                var responseText = string.Join("\n\n", aiResponses);

                return responseText;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while generating content: {ex.Message}");
                return "An error occurred while generating content.";
            }
        }

        [HttpGet("GenerateBlog")]
        public async Task<IActionResult> GenerateBlog([FromQuery] string healthGoal)
        {
            if (string.IsNullOrEmpty(healthGoal))
            {
                return BadRequest(new string[] { "Health goal cannot be empty." });
            }

            var blogResponse = await GenerateBlogContentWithCategory(healthGoal);

            return Ok(blogResponse);
        }
        private async Task<object> GenerateBlogContentWithCategory(string healthGoal)
        {
            string content = await GenerateBlogContentForGoal(healthGoal);

            content = content.Replace("=", ": ")
                             .Replace("$", "\n\n");  
            return new
            {
                Title = CapitalizeWords(healthGoal),
                Text = content,
            };
        }


        private string CapitalizeWords(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            var words = input.Split(' ');
            for (int i = 0; i < words.Length; i++)
            {
                if (words[i].Length > 0)
                {
                    words[i] = char.ToUpper(words[i][0]) + words[i].Substring(1).ToLower();
                }
            }

            return string.Join(" ", words);
        }

        [HttpGet("{id:guid}")]
        public IActionResult GetBlogById(Guid id)
        {
            if (_cachedBlogs == null || !_cachedBlogs.Any())
            {
                return NotFound(new { message = "No blogs available. Please generate blogs first." });
            }

            var blog = _cachedBlogs.FirstOrDefault(b => ((Guid)((dynamic)b).Id) == id);
            if (blog == null)
            {
                return NotFound(new { message = "Blog not found with the given ID." });
            }

            return Ok(blog);
        }

        private async Task<object[]> GenerateContentForAllGoals()
        {
            var tasks = HealthGoals.Select(async (item, index) =>
            {
                var content = await GenerateBlogContentForAllGoal(item.Goal);
                return new
                {
                    Id = Guid.NewGuid(),
                    Title = item.Title,
                    Category = item.Category,
                    Text = content
                };
            });

            var results = await Task.WhenAll(tasks);
            return results;
        }
    }
}

