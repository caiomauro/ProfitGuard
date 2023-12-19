using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Authorization;
using backend.ApplicationUser;
using Microsoft.AspNetCore.Identity;


namespace CategoryDataController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoryDataController : ControllerBase
    {

        private IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public CategoryDataController(IConfiguration configuration, UserManager<ApplicationUser> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }   

        [HttpGet]
        [Route("GetData")]
        public async Task<JsonResult> GetData()
        {

            string currentUserName = User.Identity.Name;
            ApplicationUser currentUser = await _userManager.FindByNameAsync(currentUserName);

            string query = "select * from Categories where Creator_Id = @Id;";
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

        [HttpPost]
        [Route("PostData")]
        public async Task<JsonResult> PostData([FromForm] string Category_Name)
        {
            string currentUserName = User.Identity.Name;
            ApplicationUser currentUser = await _userManager.FindByNameAsync(currentUserName);

            string query = "insert into Categories (Category_Name, Creator_Id) values (@Category_Name, @Creator_Id);";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
            using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
            {
                try 
                {
                myCon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Category_Name", Category_Name);
                    myCommand.Parameters.AddWithValue("@Creator_Id", currentUser.Id);
                    myCommand.ExecuteNonQuery();
                }

                using (MySqlCommand myCommand = new MySqlCommand("SELECT * FROM Categories;", myCon))
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

        [HttpDelete]
        [Route("DeleteData")]
        public async Task<JsonResult> DeleteData([FromForm] string Category_Name, [FromForm] int Id)
        {
            string currentUserName = User.Identity.Name;
            ApplicationUser user = await _userManager.FindByNameAsync(currentUserName);
            
            string query = "delete from Categories where Category_Name = @Category_Name and Creator_Id = @Creator_Id and Id = @Id;";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
            using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
            {
                try
                {
                    myCon.Open();
                    using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@Category_Name", Category_Name);
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myCommand.Parameters.AddWithValue("@Creator_Id", user.Id);
                        myCommand.ExecuteNonQuery();
                    }

                    using (MySqlCommand myCommand = new MySqlCommand("select * from Categories;", myCon))
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
    }
}