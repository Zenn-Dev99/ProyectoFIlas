"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al dashboard de administración
    router.push("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Redirigiendo al dashboard...</div>
    </div>
  );
}
