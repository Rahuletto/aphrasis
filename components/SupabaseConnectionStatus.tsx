import { useEffect, useState } from "react";
import { checkSupabaseConnection } from "@/utils/supabaseHealth";

export function SupabaseConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<{
    middleware: string;
    direct: string;
    error?: string;
  }>({
    middleware: "checking...",
    direct: "checking...",
  });

  const checkDirectConnection = async () => {
    setConnectionStatus((prev) => ({ ...prev, direct: "checking..." }));
    const status = await checkSupabaseConnection();
    setConnectionStatus((prev) => ({
      ...prev,
      direct: status.ok ? "connected" : "failed",
      error: status.error,
    }));
  };

  useEffect(() => {
    // Check middleware connection status from headers
    const middlewareStatus =
      document.headers?.get("x-supabase-connection-status") || "unknown";
    setConnectionStatus((prev) => ({ ...prev, middleware: middlewareStatus }));

    // Check direct connection
    checkDirectConnection();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "error":
      case "failed":
        return "text-red-600";
      case "checking...":
        return "text-blue-600 animate-pulse";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Supabase Connection Status</h2>

      <div className="space-y-2">
        <div>
          <span className="font-medium">Middleware Status: </span>
          <span className={getStatusColor(connectionStatus.middleware)}>
            {connectionStatus.middleware}
          </span>
        </div>

        <div>
          <span className="font-medium">Direct Connection: </span>
          <span className={getStatusColor(connectionStatus.direct)}>
            {connectionStatus.direct}
          </span>
        </div>

        {connectionStatus.error && (
          <div className="text-red-600 text-sm mt-2">
            Error: {connectionStatus.error}
          </div>
        )}

        <button
          onClick={checkDirectConnection}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Check Connection Again
        </button>
      </div>
    </div>
  );
}
