
import { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [isPWA, setIsPWA] = useState(false);
  const [isOnline, setIsOnline] = useState(
    navigator.onLine
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.navigator.standalone === true;

    setIsPWA(standalone);

    if (!standalone) return;

    const handleOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setVisible(true);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Desaparece después de 4 segundos,
  // tanto si se pierde como si vuelve internet.
  useEffect(() => {
    if (!visible) return;

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [visible, isOnline]);

  if (!isPWA || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "42px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: "390px",
        boxSizing: "border-box",
        padding: "14px 20px",
        borderRadius: "14px",

        // Negro transparente tipo vidrio
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.18)",

        color: "#FFFFFF",
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "inherit",
        textAlign: "center",
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      {isOnline
        ? "Conexión a internet restablecida"
        : "Sin conexión a internet"}
    </div>
  );
}
