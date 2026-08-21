import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

// GET handler to retrieve the user's profile details
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const res = await pool.query(
      "SELECT full_name, email, age, gender, degree_level, custom_degree, academic_program, year_of_study, photo FROM users WHERE id = $1",
      [userId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = res.rows[0];

    return NextResponse.json({
      name: user.full_name || "",
      email: user.email || "",
      age: user.age !== null ? user.age : "",
      gender: user.gender || "",
      degreeLevel: user.degree_level || "",
      customDegree: user.custom_degree || "",
      course: user.academic_program || "",
      year: user.year_of_study !== null ? user.year_of_study : "",
      photo: user.photo || null,
    }, { status: 200 });

  } catch (error) {
    console.error("Error retrieving profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT handler to update the user's profile details
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      name,
      email,
      age,
      gender,
      degreeLevel,
      customDegree,
      course,
      year,
      photo
    } = body;

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    // Check if the new email is already taken by another user
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id <> $2",
      [email, userId]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ message: "Email is already in use by another account" }, { status: 409 });
    }

    // Update the database
    await pool.query(
      `UPDATE users SET 
        full_name = $1,
        email = $2,
        age = $3,
        gender = $4,
        degree_level = $5,
        custom_degree = $6,
        academic_program = $7,
        year_of_study = $8,
        photo = $9
      WHERE id = $10`,
      [
        name,
        email,
        age !== "" && age !== null ? parseInt(age, 10) : null,
        gender || null,
        degreeLevel || null,
        customDegree || null,
        course || null,
        year !== "" && year !== null ? parseInt(year, 10) : null,
        photo || null,
        userId
      ]
    );

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
