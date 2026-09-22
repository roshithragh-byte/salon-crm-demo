"use client";

import { ProfileForm } from "@/components/ProfileForm";

export default function AdminProfilePage() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-800 mb-8">My Profile</h1>
        <ProfileForm />
      </div>
    </div>
  );
}
