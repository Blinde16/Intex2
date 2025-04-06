using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Intex2.Migrations.CompetitionDb
{
    /// <inheritdoc />
    public partial class AddrootbeersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rootbeers",
                columns: table => new
                {
                    RootbeerID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RootbeerName = table.Column<string>(type: "TEXT", nullable: false),
                    FirstBrewedYear = table.Column<string>(type: "TEXT", nullable: true),
                    BreweryName = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    State = table.Column<string>(type: "TEXT", nullable: true),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    WholesaleCost = table.Column<decimal>(type: "TEXT", nullable: false),
                    CurrentRetailPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    Container = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rootbeers", x => x.RootbeerID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rootbeers");
        }
    }
}
