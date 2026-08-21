// export default function ProfilePage() {
//   return (
//     <main className="min-h-screen bg-[#F2EFE7] p-8 md:pl-72">
//       <h1 className="text-2xl font-bold text-[#302824]">Profile</h1>
//     </main>
//   );
// }


"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useSession } from "next-auth/react";
import AmbientSky from "@/components/AmbientSky";

// --- Types ---
interface ProfileData {
  name: string;
  age: number | "";
  gender: string;
  course: string;
  year: number | "";
  email: string;
  degreeLevel: string;
  customDegree: string;
  photo: string | null;
}

interface ResponsePrefs {
  length: "short" | "medium" | "long";
  tone: "formal" | "casual" | "empathetic" | "encouraging";
  customInstructions: string;
}

interface Option {
  value: string;
  label: string;
}

// --- CustomSelect with Portal (no clipping) ---
interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  const openDropdown = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 200;
    const top = spaceBelow > dropdownHeight ? rect.bottom + 4 : rect.top - dropdownHeight - 4;
    setDropdownStyle({
      position: "fixed",
      top: top,
      left: rect.left,
      width: rect.width,
      maxHeight: dropdownHeight,
      overflowY: "auto",
      zIndex: 9999,
    });
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !document.querySelector(".dropdown-portal")?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={openDropdown}
        className="w-full rounded-xl border border-[#DED0C8] bg-white/70 px-4 py-3 text-[#302824] text-left focus:outline-none focus:ring-2 focus:ring-[#B87C64] shadow-sm transition flex items-center justify-between"
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-5 h-5 text-[#665B55] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <ul
            className="dropdown-portal bg-white/95 backdrop-blur-sm border border-[#DED0C8] rounded-xl shadow-xl py-1"
            style={dropdownStyle}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 cursor-pointer hover:bg-[#E8DCD5] transition-colors ${
                  opt.value === value ? "bg-[#DED0C8] text-[#302824] font-medium" : "text-[#665B55]"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

// --- Main Profile Page Component ---
export default function ProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    age: "",
    gender: "",
    course: "",
    year: "",
    email: "",
    degreeLevel: "",
    customDegree: "",
    photo: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);
  const [prefs, setPrefs] = useState<ResponsePrefs>({
    length: "medium",
    tone: "empathetic",
    customInstructions: "Speak to me like a wise mentor, warm and reassuring.",
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setTempProfile(data);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrefSelectChange = (name: string, value: string) => {
    setPrefs((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTempProfile((prev) => ({ ...prev, photo: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveProfile = async () => {
    try {
      setSaveLoading(true);
      setError("");
      setSuccessMsg("");
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempProfile),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(tempProfile);
      setIsEditing(false);
      setSuccessMsg("Profile saved successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile changes.");
    } finally {
      setSaveLoading(false);
    }
  };

  const displayValue = (value: string | number, placeholder: string) => {
    if (value || value === 0) return value;
    return <span className="text-[#8A7A72]">{placeholder}</span>;
  };

  const inputStyle =
    "w-full rounded-xl border border-[#DED0C8] bg-white/70 px-4 py-3 text-[#302824] focus:outline-none focus:ring-2 focus:ring-[#B87C64] shadow-sm transition placeholder:text-[#B5A69B]";

  return (
    <div className="relative flex min-h-screen">
      <AmbientSky expression="neutral" />

      <main className="relative z-10 flex-1 p-8 overflow-y-auto md:ml-64">
        <div className="w-full bg-[#F7F2EE] rounded-3xl shadow-2xl p-8 md:p-10 border border-[#DED0C8] backdrop-blur-sm bg-opacity-80 transition-all">
          
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm animate-pulse">
              {successMsg}
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center py-10 text-[#665B55]">
              <div className="w-6 h-6 border-2 border-[#B87C64]/20 border-t-[#B87C64] rounded-full animate-spin mr-2"></div>
              <span className="text-sm font-medium">Retrieving profile log...</span>
            </div>
          )}

          <div className={`flex flex-col md:flex-row gap-10 ${loading ? "opacity-30 pointer-events-none" : ""}`}>
            {/* Left: Photo and Name */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-[#DED0C8] shadow-lg bg-[#E8DCD5]">
                {tempProfile.photo ? (
                  <Image
                    src={tempProfile.photo}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-6xl text-[#665B55]">
                    👤
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="mt-4 px-6 py-2 bg-[#DED0C8] rounded-full text-sm font-medium text-[#302824] cursor-pointer hover:bg-[#D2C4BC] transition shadow-sm">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}

              <h2 className="mt-5 text-3xl font-semibold text-[#302824] tracking-tight">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={tempProfile.name}
                    onChange={handleInputChange}
                    className={`${inputStyle} text-center text-3xl bg-transparent border-b-2 border-[#D2C4BC] focus:border-[#B87C64]`}
                    placeholder="Your Name"
                  />
                ) : (
                  displayValue(profile.name, "Your Name")
                )}
              </h2>
            </div>

            {/* Right: All fields */}
            <div className="md:w-2/3 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#665B55]">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={tempProfile.email}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="abc@example.com"
                    />
                  ) : (
                    <p className="text-[#302824] text-lg font-medium">
                      {displayValue(profile.email, "abc@example.com")}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-[#665B55]">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={tempProfile.age}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="22"
                    />
                  ) : (
                    <p className="text-[#302824] text-lg font-medium">
                      {displayValue(profile.age, "22")}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-[#665B55]">Gender</label>
                  {isEditing ? (
                    <CustomSelect
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
                      value={tempProfile.gender}
                      onChange={(val) => handleSelectChange("gender", val)}
                      placeholder="Select gender"
                    />
                  ) : (
                    <p className="text-[#302824] text-lg font-medium">
                      {displayValue(profile.gender, "Male / Female / Other")}
                    </p>
                  )}
                </div>

                {/* Degree Level */}
                <div>
                  <label className="block text-sm font-medium text-[#665B55]">Degree Level</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <CustomSelect
                        options={[
                          { value: "Undergraduate", label: "Undergraduate" },
                          { value: "Postgraduate", label: "Postgraduate" },
                          { value: "Other", label: "Other" },
                        ]}
                        value={tempProfile.degreeLevel}
                        onChange={(val) => handleSelectChange("degreeLevel", val)}
                        placeholder="Select degree level"
                      />
                      {tempProfile.degreeLevel === "Other" && (
                        <input
                          type="text"
                          name="customDegree"
                          value={tempProfile.customDegree}
                          onChange={handleInputChange}
                          className={inputStyle}
                          placeholder="e.g., High School, Diploma, etc."
                        />
                      )}
                    </div>
                  ) : (
                    <p className="text-[#302824] text-lg font-medium">
                      {profile.degreeLevel === "Other"
                        ? profile.customDegree || "Other"
                        : displayValue(profile.degreeLevel, "Undergraduate / Postgraduate")}
                    </p>
                  )}
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-[#665B55]">Course</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="course"
                      value={tempProfile.course}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="e.g., B.Sc. in AI"
                    />
                  ) : (
                    <p className="text-[#302824] text-lg font-medium">
                      {displayValue(profile.course, "e.g., B.Sc. in AI")}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-[#665B55]">Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="year"
                      value={tempProfile.year}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="3"
                    />
                  ) : (
                    <p className="text-[#302824] text-lg font-medium">
                      {displayValue(profile.year, "3")}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-[#E8DCD5]">
                {!isEditing ? (
                  <button
                    onClick={startEditing}
                    className="px-8 py-3 bg-[#B87C64] text-white rounded-full hover:bg-[#A06751] transition shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={saveProfile}
                      disabled={saveLoading}
                      className="px-8 py-3 bg-[#B87C64] text-white rounded-full hover:bg-[#A06751] transition shadow-md hover:shadow-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-8 py-3 bg-[#DED0C8] text-[#302824] rounded-full hover:bg-[#D2C4BC] transition shadow-sm text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Companion Response Style */}
        <div className="w-full mt-10 bg-gradient-to-br from-[#F7F2EE] to-[#EDE5DE] rounded-3xl shadow-2xl p-8 md:p-10 border border-[#DED0C8] backdrop-blur-sm">
          <h3 className="text-2xl font-semibold text-[#302824] mb-6 tracking-tight">
            Companion Response Style
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#DED0C8]">
              <label className="block text-sm font-medium text-[#665B55] mb-1">Response Length</label>
              <CustomSelect
                options={[
                  { value: "short", label: "Short & concise" },
                  { value: "medium", label: "Balanced (medium)" },
                  { value: "long", label: "Detailed & elaborate" },
                ]}
                value={prefs.length}
                onChange={(val) => handlePrefSelectChange("length", val)}
              />
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#DED0C8]">
              <label className="block text-sm font-medium text-[#665B55] mb-1">Communication Tone</label>
              <CustomSelect
                options={[
                  { value: "formal", label: "Formal & professional" },
                  { value: "casual", label: "Casual & friendly" },
                  { value: "empathetic", label: "Empathetic & supportive" },
                  { value: "encouraging", label: "Encouraging & motivational" },
                ]}
                value={prefs.tone}
                onChange={(val) => handlePrefSelectChange("tone", val)}
              />
            </div>
          </div>

          <div className="mt-6 bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#DED0C8]">
            <label className="block text-sm font-medium text-[#665B55] mb-1">
              Custom Instructions
            </label>
            <textarea
              name="customInstructions"
              value={prefs.customInstructions}
              onChange={(e) => setPrefs({ ...prefs, customInstructions: e.target.value })}
              rows={3}
              className={`${inputStyle} resize-none`}
              placeholder="Tell the Companion how you'd like it to respond to you..."
            />
          </div>
          <div className="mt-4 text-sm text-[#8A7A72]">
            These preferences will be applied across all your interactions with the Companion.
          </div>
        </div>
      </main>
    </div>
  );
}