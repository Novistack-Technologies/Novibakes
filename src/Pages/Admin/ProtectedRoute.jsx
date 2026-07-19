import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const [user, setUser]       = useState(undefined); // undefined = still loading

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return () => unsub();
  }, []);

  // Still waiting for Firebase to respond
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <div className="w-8 h-8 rounded-full border-4 border-[#ec4899] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
