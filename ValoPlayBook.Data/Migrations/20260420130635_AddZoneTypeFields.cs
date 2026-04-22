using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValoPlayBook.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddZoneTypeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Angle",
                table: "StepAbilities",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Length",
                table: "StepAbilities",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Width",
                table: "StepAbilities",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ZoneType",
                table: "StepAbilities",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Angle",
                table: "StepAbilities");

            migrationBuilder.DropColumn(
                name: "Length",
                table: "StepAbilities");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "StepAbilities");

            migrationBuilder.DropColumn(
                name: "ZoneType",
                table: "StepAbilities");
        }
    }
}
