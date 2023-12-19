using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Authorization;
using backend.ApplicationUser;
using Microsoft.AspNetCore.Identity;


namespace ItemDataController
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class ItemDataController : ControllerBase
    {
        private IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public ItemDataController(IConfiguration configuration, UserManager<ApplicationUser> userManager)
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

            string query = "select * from Items where Creator_Id = @Creator_Id;";
            DataTable table = new DataTable();
            
            string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
            using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("Creator_Id", currentUser.Id);

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
        public async Task<JsonResult> PostData([FromForm] string Name, [FromForm] double Price_Per_Cs, [FromForm] double Amt_Sold_Per_cs, [FromForm] double Order_Sell_Price, [FromForm] string Category, [FromForm] string Vendor)
        {
            string currentUserName = User.Identity.Name;
            ApplicationUser user = await _userManager.FindByNameAsync(currentUserName);

            double Profit = (Order_Sell_Price * Amt_Sold_Per_cs) - Price_Per_Cs;
            string query = "insert into items (Creator_Id, Name, Price_Per_Cs, Amt_Sold_Per_Cs, Order_Sell_Price, Profit_Per_Cs, Category, Vendor) values (@Creator_Id, @Name, @Price_Per_Cs, @Amt_Sold_Per_Cs, @Order_Sell_Price, @Profit_Per_Cs, @Category, @Vendor)";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
            using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
            {
                try
                {
                    myCon.Open();
                    using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@Creator_Id", user.Id);
                        myCommand.Parameters.AddWithValue("@Name", Name);
                        myCommand.Parameters.AddWithValue("@Price_Per_Cs", Price_Per_Cs);
                        myCommand.Parameters.AddWithValue("@Amt_Sold_Per_Cs", Amt_Sold_Per_cs);
                        myCommand.Parameters.AddWithValue("@Order_Sell_Price", Order_Sell_Price);
                        myCommand.Parameters.AddWithValue("@Profit_Per_Cs", Profit);
                        myCommand.Parameters.AddWithValue("@Category", Category);
                        myCommand.Parameters.AddWithValue("@Vendor", Vendor);
                        myCommand.ExecuteNonQuery();
                    }

                    using (MySqlCommand myCommand = new MySqlCommand("SELECT * FROM Items;", myCon))
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
        public async Task<JsonResult> DeleteData([FromForm] string Name, [FromForm] int Id)
        {
            string currentUserName = User.Identity.Name;
            ApplicationUser user = await _userManager.FindByNameAsync(currentUserName);

            string query = "delete from Items where Name = @Name and Id = @Id and Creator_Id = @Creator_Id;";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("IPSDbCon");
            using (MySqlConnection myCon = new MySqlConnection(sqlDatasource))
            {
                try
                {
                    myCon.Open();
                    using (MySqlCommand myCommand = new MySqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@Name", Name);
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myCommand.Parameters.AddWithValue("@Creator_Id", user.Id);
                        myCommand.ExecuteNonQuery();
                    }

                    using (MySqlCommand myCommand = new MySqlCommand("select * from Items;", myCon))
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