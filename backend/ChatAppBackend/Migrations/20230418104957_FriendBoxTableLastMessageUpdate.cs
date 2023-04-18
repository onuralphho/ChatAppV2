using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatAppBackend.Migrations
{
    public partial class FriendBoxTableLastMessageUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           

           

            

            migrationBuilder.AddColumn<string>(
                name: "LastMessage",
                table: "FriendBoxes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastMessageFrom",
                table: "FriendBoxes",
                type: "text",
                nullable: true);

            

            
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            

            migrationBuilder.DropColumn(
                name: "LastMessage",
                table: "FriendBoxes");

            migrationBuilder.DropColumn(
                name: "LastMessageFrom",
                table: "FriendBoxes");

            ;
        }
    }
}
