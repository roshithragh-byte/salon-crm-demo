import { redirect } from "next/navigation";

/** Canonical entry point for the admin area. Authentication is handled at login. */
export default function AdminIndexPage() {
  redirect("/admin/login");
}
