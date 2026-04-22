using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValoPlayBook.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIsAttackerToStepPosition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAttacker",
                table: "StepPositions",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAttacker",
                table: "StepPositions");
        }
    }
}
