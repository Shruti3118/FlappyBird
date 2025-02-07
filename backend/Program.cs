using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Entity Framework with SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=game.db")
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();


app.UseCors("AllowAll");

// Seed the database with some initial data
DatabaseSeeder.SeedData(app.Services.GetRequiredService<ApplicationDbContext>());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Endpoint to initialize sample data (for testing purposes)
app.MapGet("/init", async (ApplicationDbContext db) =>
{
    var sampleData = new List<UserProfile>
    {
        new UserProfile { PlayerName = "Player1", HighScore = 100 },
        new UserProfile { PlayerName = "Player2", HighScore = 200 },
    };

    db.UserProfiles.AddRange(sampleData);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Database initialized with sample data!" });
});

// Add this endpoint to handle the root path
app.MapGet("/", () => "Welcome to the Car Game API!");

// Register player's name
app.MapPost("/players", async (ApplicationDbContext db, PlayerNameRequest request) =>
{
    if (string.IsNullOrEmpty(request.PlayerName))
    {
        return Results.BadRequest("Player name is required");
    }

    var existingUser = await db.UserProfiles.FirstOrDefaultAsync(u => u.PlayerName == request.PlayerName);

    // If player exists, return the existing high score
    if (existingUser != null)
    {
        return Results.Ok(new { message = "Player exists", highScore = existingUser.HighScore });
    }

    // If player doesn't exist, create a new one with a score of 0
    var newUser = new UserProfile
    {
        PlayerName = request.PlayerName,
        HighScore = 0
    };

    db.UserProfiles.Add(newUser);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "New player registered successfully" });
});


// Endpoint to submit a player's score
app.MapPost("/submit-score", async (ApplicationDbContext db, PlayerScore score) =>
{
    if (string.IsNullOrEmpty(score.PlayerName) || score.Score < 0)
    {
        return Results.BadRequest("Invalid score data.");
    }

    var userProfile = await db.UserProfiles
        .FirstOrDefaultAsync(u => u.PlayerName == score.PlayerName);

    // If the user doesn't exist, create a new profile
    if (userProfile == null)
    {
        userProfile = new UserProfile
        {
            PlayerName = score.PlayerName,
            HighScore = score.Score
        };
        db.UserProfiles.Add(userProfile);
    }
    else
    {
        // If the score is higher than the user's previous high score, update it
        if (score.Score > userProfile.HighScore)
        {
            userProfile.HighScore = score.Score;
        }
    }

    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Score submitted successfully!" });
});

// Endpoint to get the leaderboard (top 10 scores)
app.MapGet("/leaderboard", async (ApplicationDbContext db) =>
{
    var leaderboard = await db.UserProfiles
        .OrderByDescending(u => u.HighScore)
        .Take(10)  // Get top 10 scores
        .ToListAsync();

    return Results.Ok(leaderboard);
});

app.Run();

// Define the GameSession model (this represents a "row" in the database)
public record PlayerScore
{
    public string PlayerName { get; set; }
    public int Score { get; set; }
}

public record PlayerNameRequest
{
    public string PlayerName { get; set; }
}

// Define the UserProfile model (this represents user data in the database)
public class UserProfile
{
    public int Id { get; set; }
    public string PlayerName { get; set; }
    public int HighScore { get; set; }
}

// Define the ApplicationDbContext (this represents the database context)
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    { }

    public DbSet<UserProfile> UserProfiles { get; set; }
}

// Define a static class to hold the SeedData method
public static class DatabaseSeeder
{
    // Seed the database with initial data
    public static void SeedData(ApplicationDbContext db)
    {
        // Check if the UserProfiles table is empty
        if (!db.UserProfiles.Any())
        {
            db.UserProfiles.AddRange(
                new UserProfile { PlayerName = "TestPlayer1", HighScore = 50 },
                new UserProfile { PlayerName = "TestPlayer2", HighScore = 150 }
            );
            db.SaveChanges();
        }
    }
}



