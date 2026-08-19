import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password, academic_program, year_of_study } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Check if user already exists
      const existingUserRes = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingUserRes.rows.length > 0) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 409 }
        );
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = crypto.randomUUID();

      await pool.query(
        "INSERT INTO users (id, full_name, email, password, academic_program, year_of_study) VALUES ($1, $2, $3, $4, $5, $6)",
        [userId, name, email, hashedPassword, academic_program || null, year_of_study || null]
      );

      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
