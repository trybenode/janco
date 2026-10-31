"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { LoadingState } from "@/components/LoadingState";
export function Protected({
  children,
  allowUnregistered = false,
}: {
  children: React.ReactNode;
  allowUnregistered?: boolean;
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const unregistered = profile?.is_registered === false;
  useEffect(() => {
    if (!loading && !profile) router.replace("/login");
    else if (
      !loading &&
      profile &&
      unregistered &&
      !allowUnregistered &&
      pathname !== "/registration"
    )
      router.replace("/registration");
  }, [allowUnregistered, loading, pathname, profile, router, unregistered]);
  if (
    loading ||
    !profile ||
    (unregistered && !allowUnregistered && pathname !== "/registration")
  )
    return (
      <main className="container portal-main">
        <LoadingState label="Checking your profile…" />
      </main>
    );
  return <>{children}</>;
}

export function RoleProtected({
  role,
  children,
}: {
  role: "customer" | "janitor";
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const unregistered = profile?.is_registered === false;
  const allowed =
    !unregistered &&
    (role === "janitor"
      ? profile?.role === "janitor"
      : profile?.role !== "janitor");
  useEffect(() => {
    if (!loading && !profile) router.replace("/login");
    else if (!loading && profile && unregistered)
      router.replace("/registration");
    else if (!loading && profile && !allowed)
      router.replace(role === "janitor" ? "/portal" : "/janitor");
  }, [allowed, loading, profile, role, router, unregistered]);
  if (loading || !profile || !allowed)
    return (
      <main className="container portal-main">
        <LoadingState label="Loading your dashboard…" />
      </main>
    );
  return <>{children}</>;
}
