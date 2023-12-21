using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Models;
using backend.ApplicationUser;
using Microsoft.AspNetCore.Authorization;
using backend.Entities;
using Microsoft.Extensions.Configuration;
using System.Data;
using MySql.Data.MySqlClient;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;


[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private IConfiguration _configuration;

    public AuthenticationController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost]
    [Route("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (ModelState.IsValid)
        {
            var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false); // Automatically sign in the user after registration
                return Ok(new { Message = "Registration successful", UserId = user.Id });
            }

            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }

        return BadRequest(new { Message = "Invalid model state" });
    }


    [HttpPost]
    [Route("Login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {

        var user = await _userManager.FindByNameAsync(model.Username);

        if (user == null)
        {
            return BadRequest(new { Message = "User does not exist" });
        }

        var normalizedUsername = _userManager.NormalizeName(model.Username);
        var result = await _signInManager.PasswordSignInAsync(normalizedUsername, model.Password, model.RememberMe, lockoutOnFailure: false);

        if (result.Succeeded)
        {

            var expirationTime = model.RememberMe ? DateTime.UtcNow.AddDays(7) : DateTime.UtcNow.AddDays(1);
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("TDgCBkXXWhhDEzK2MI2zcA7vCLLprKLgEI+TMxwAK+4vrlOn5RYwlzpDvYroR2MECTMSGpqpCBCKq91TeMqmzKlUiKxvh0svGDEv8+xhytoFQ4lMLTpc7mR978JtJ2wCdurWP76vwdw7Fx6v4Sn0Kq5kqgqFFScKt2SqCHpIN9YKdcbvmqfRVJb1EpvQ9pQK"); // Use the same key as in ConfigureServices
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                    // Add more claims as needed
                }),
                Expires = expirationTime, // Token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var serializedToken = tokenHandler.WriteToken(token);

            DateTime currentUtcTime = DateTime.UtcNow;

            var userId = user.Id;
            var username = user.UserName;
            var dateCreated = currentUtcTime;

            string CheckUserExistQuery = "select * from Users where Id = @Id;";
            string checkUser;

            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
            using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
            {
                try
                {
                    myCon.Open();
                    using (MySqlCommand checkCommand = new MySqlCommand(CheckUserExistQuery, myCon))
                    {
                        checkCommand.Parameters.AddWithValue("@Id", user.Id);
                        object userFromQuery = checkCommand.ExecuteScalar();

                        if (userFromQuery == null)
                        {
                            string query = "insert into Users (Id, username, created_at) values (@Id,@username,@created_at);";

                            using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
                            {
                                myCommand.Parameters.AddWithValue("@Id", user.Id);
                                myCommand.Parameters.AddWithValue("@username", user.UserName);
                                myCommand.Parameters.AddWithValue("@created_at", currentUtcTime);
                                myCommand.ExecuteNonQuery();
                            }
                        }

                    }

                    using (MySqlCommand myCommand = new MySqlCommand("SELECT * FROM Users;", myCon))
                    {
                        using (MySqlDataReader myReader = myCommand.ExecuteReader())
                        {
                            table.Load(myReader);
                            myReader.Close();
                        }
                    }

                }
                finally
                {
                    myCon.Close();
                }
            }

            return Ok(new
            {
                Message = "Login successful",
                UserId = userId,
                Username = username,
                DateCreated = dateCreated,
                Token = serializedToken,
                TokenTime = expirationTime,
            });
        }
        else if (result.IsLockedOut)
        {
            return BadRequest(new { Message = "User is lockedout" });
        }

        return BadRequest(new { Message = $"Invalid login attempt. Reason: {result}" });
    }

    [HttpPost]
    [Route("Logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { Message = "Logout successful" });

    }

    [HttpPost]
    [Route("ChangePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
    {
        var user = await _userManager.FindByIdAsync(model.UserId);

        if (user == null)
        {
            return BadRequest(new { Message = "Invalid user ID" });
        }

        var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

        if (result.Succeeded)
        {
            return Ok(new { Message = "Password change successful" });
        }

        return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
    }

    [HttpPost]
    [Route("ProfitGoal")]
    public async Task<IActionResult> ProfitGoal([FromForm] int goal)
    {
        string currentUserName = User.Identity.Name;
        ApplicationUser currentUser = await _userManager.FindByNameAsync(currentUserName);

        string query = "insert into Users (profit_goal) values (@profit_goal);";
        DataTable table = new DataTable();
        string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
        using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
        {
            try
            {
                myCon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@profit_goal", goal);
                    myCommand.ExecuteNonQuery();
                }

                using (MySqlCommand myCommand = new MySqlCommand("SELECT * FROM Users;", myCon))
                {
                    using (MySqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        table.Load(myReader);
                        myReader.Close();
                    }
                }

            }
            finally
            {
                myCon.Close();
            }
        }
        return new JsonResult(table);
    }

    [HttpGet]
    [Route("GetProfit")]
    public async Task<JsonResult> GetProfit()
    {

        string currentUserName = User.Identity.Name;
        ApplicationUser currentUser = await _userManager.FindByNameAsync(currentUserName);

        string query = "select * from Users where Id = @Id;";
        DataTable table = new DataTable();
        string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
        using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
        {
            myCon.Open();
            using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
            {
                myCommand.Parameters.AddWithValue("@Id", currentUser.Id);

                using (MySqlDataReader myReader = myCommand.ExecuteReader())
                {
                    table.Load(myReader);
                }
            }
        }
        return new JsonResult(table);
    }
}
