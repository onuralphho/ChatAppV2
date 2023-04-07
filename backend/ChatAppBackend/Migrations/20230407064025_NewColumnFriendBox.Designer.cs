﻿// <auto-generated />
using System;
using ChatAppBackend.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ChatAppBackend.Migrations
{
    [DbContext(typeof(PostgreSqlDbContext))]
    [Migration("20230407064025_NewColumnFriendBox")]
    partial class NewColumnFriendBox
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ChatAppBackend.Entities.FriendBox", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("Approved")
                        .HasColumnType("boolean");

                    b.Property<int>("FromUserId")
                        .HasColumnType("integer");

                    b.Property<int>("ToUserId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdateTime")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("FromUserId");

                    b.HasIndex("ToUserId");

                    b.ToTable("FriendBoxes");
                });

            modelBuilder.Entity("ChatAppBackend.Entities.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ContentText")
                        .HasColumnType("text");

                    b.Property<int?>("FriendshipId")
                        .HasColumnType("integer");

                    b.Property<int>("FromUserId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("SentDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("ToUserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("FriendshipId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("ChatAppBackend.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .HasColumnType("text");

                    b.Property<string>("Picture")
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdateTime")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ChatAppBackend.Entities.FriendBox", b =>
                {
                    b.HasOne("ChatAppBackend.Entities.User", "FromUser")
                        .WithMany()
                        .HasForeignKey("FromUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ChatAppBackend.Entities.User", "ToUser")
                        .WithMany()
                        .HasForeignKey("ToUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FromUser");

                    b.Navigation("ToUser");
                });

            modelBuilder.Entity("ChatAppBackend.Entities.Message", b =>
                {
                    b.HasOne("ChatAppBackend.Entities.FriendBox", "Friendship")
                        .WithMany()
                        .HasForeignKey("FriendshipId");

                    b.Navigation("Friendship");
                });
#pragma warning restore 612, 618
        }
    }
}
