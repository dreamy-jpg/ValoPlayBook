using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ValoPlayBook.Core.Models;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Хеширование пароля с помощью BCrypt
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Проверка пароля
        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        // Генерация JWT access-токена
        public string GenerateAccessToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("username", user.Username),
                new Claim("role", user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["AccessTokenExpirationMinutes"] ?? "30")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Генерация криптостойкого refresh-токена
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        // Сохранение refresh-токена в БД
        public async Task<RefreshToken> SaveRefreshTokenAsync(int userId, string token, int expirationDays)
        {
            var refreshToken = new RefreshToken
            {
                Token = token,
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(expirationDays),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            return refreshToken;
        }

        // Проверка валидности refresh-токена
        public async Task<RefreshToken?> GetValidRefreshTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow);
        }

        // Отзыв refresh-токена
        public async Task RevokeRefreshTokenAsync(string token)
        {
            var rt = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token);
            if (rt != null)
            {
                rt.IsRevoked = true;
                await _context.SaveChangesAsync();
            }
        }

        // Отзыв всех refresh-токенов пользователя (для принудительного выхода)
        public async Task RevokeAllUserTokensAsync(int userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();
            foreach (var token in tokens)
            {
                token.IsRevoked = true;
            }
            await _context.SaveChangesAsync();
        }
    }
}