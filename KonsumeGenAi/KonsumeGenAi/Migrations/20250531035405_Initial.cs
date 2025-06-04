using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KonsumeGenAi.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Hash",
                table: "CompanyProducts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Profiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 54, 3, 663, DateTimeKind.Utc).AddTicks(4527));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 54, 3, 517, DateTimeKind.Utc).AddTicks(5324));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 54, 3, 517, DateTimeKind.Utc).AddTicks(5348));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 54, 3, 517, DateTimeKind.Utc).AddTicks(5352));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 54, 3, 517, DateTimeKind.Utc).AddTicks(5355));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateCreated", "Password" },
                values: new object[] { new DateTime(2025, 5, 31, 3, 54, 3, 517, DateTimeKind.Utc).AddTicks(5795), "$2a$10$SeKQNLaaShNFxCzKHPc9L.Fe4W16j5uNFX5TZwFU/65Ul4JhKxQ76" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hash",
                table: "CompanyProducts");

            migrationBuilder.UpdateData(
                table: "Profiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 5, 0, 558, DateTimeKind.Utc).AddTicks(8066));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 5, 0, 414, DateTimeKind.Utc).AddTicks(5025));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 5, 0, 414, DateTimeKind.Utc).AddTicks(5041));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 5, 0, 414, DateTimeKind.Utc).AddTicks(5045));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                column: "DateCreated",
                value: new DateTime(2025, 5, 31, 3, 5, 0, 414, DateTimeKind.Utc).AddTicks(5049));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateCreated", "Password" },
                values: new object[] { new DateTime(2025, 5, 31, 3, 5, 0, 414, DateTimeKind.Utc).AddTicks(5347), "$2a$10$4cl/ikTM0mpLRCHmGcqkZOb8kJ5XLTrkLs1HENtYkLozLfcbHrirO" });
        }
    }
}
