using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ValoPlayBook.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStepAbilitiesAndMaxCharges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxCharges",
                table: "Abilities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StepAbilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ActivationStepId = table.Column<int>(type: "integer", nullable: false),
                    AbilityId = table.Column<int>(type: "integer", nullable: false),
                    AgentId = table.Column<int>(type: "integer", nullable: false),
                    X = table.Column<double>(type: "double precision", nullable: true),
                    Y = table.Column<double>(type: "double precision", nullable: true),
                    Rotation = table.Column<double>(type: "double precision", nullable: true),
                    Radius = table.Column<double>(type: "double precision", nullable: true),
                    DurationSteps = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StepAbilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StepAbilities_Abilities_AbilityId",
                        column: x => x.AbilityId,
                        principalTable: "Abilities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StepAbilities_DefaultSteps_ActivationStepId",
                        column: x => x.ActivationStepId,
                        principalTable: "DefaultSteps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StepAbilities_AbilityId",
                table: "StepAbilities",
                column: "AbilityId");

            migrationBuilder.CreateIndex(
                name: "IX_StepAbilities_ActivationStepId",
                table: "StepAbilities",
                column: "ActivationStepId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StepAbilities");

            migrationBuilder.DropColumn(
                name: "MaxCharges",
                table: "Abilities");
        }
    }
}
