
namespace backend.Models
{
    public class RegisterModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        // Add other necessary fields for user registration
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
        // Add other necessary fields for user login
    }

    public class ChangePasswordModel
    {
        public string UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        // Add other necessary fields for changing the password
    }

    public class ChangeUsernameModel
    {
        public string UserId { get; set; }
        public string NewUsername { get; set; }
        // Add other necessary fields for changing the username
    }

}
