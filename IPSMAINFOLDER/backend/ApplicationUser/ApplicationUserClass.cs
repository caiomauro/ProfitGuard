using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace backend.ApplicationUser 
{
    [Table("Users")]
    public class ApplicationUser : IdentityUser
    {
        public DateTime CreatedAt { get; set; }
    }

}