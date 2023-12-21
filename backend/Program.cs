using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json.Serialization;
using Pomelo.EntityFrameworkCore.MySql;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using System.IO;
using System.Reflection;
using Microsoft.OpenApi.Models;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<backend.Context.IPSDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("IPSDbCon"),
    new MySqlServerVersion(new Version(8, 2, 0))));

builder.Services.AddDefaultIdentity<backend.ApplicationUser.ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<backend.Context.IPSDbContext>()
    .AddDefaultTokenProviders();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

    // Define the Bearer token security scheme
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter 'Bearer your_token' for JWT",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer", // Note: case-sensitive
        BearerFormat = "JWT",
    };

    // Apply the security scheme globally to all operations
    c.AddSecurityDefinition("Bearer", securityScheme);

    // Add a security requirement to each operation, indicating that Bearer token is required
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            securityScheme,
            new string[] {}
        }
    });

});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TDgCBkXXWhhDEzK2MI2zcA7vCLLprKLgEI+TMxwAK+4vrlOn5RYwlzpDvYroR2MECTMSGpqpCBCKq91TeMqmzKlUiKxvh0svGDEv8+xhytoFQ4lMLTpc7mR978JtJ2wCdurWP76vwdw7Fx6v4Sn0Kq5kqgqFFScKt2SqCHpIN9YKdcbvmqfRVJb1EpvQ9pQK")) // Change this
        };
    });

//JSON Serializer
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
});

var app = builder.Build();

// Enable CORS
app.UseCors(c => c.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
