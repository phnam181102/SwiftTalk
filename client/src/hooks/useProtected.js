import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuth from "./useAuth";

export default function Protected({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect on server-side
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
}
