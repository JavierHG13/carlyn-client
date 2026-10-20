
import { useEffect, useState } from "react";

const getPwaDisplayMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.matchMedia("(display-mode: fullscreen)").matches ||
  window.navigator.standalone === true;

export default function NetworkStatus() {
  const [isPWA, setIsPWA] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const standalone = getPwaDisplayMode();
    setIsPWA(standalone);

    if (!standalone) return undefined;

    const updateStatus = (online) => {
      setIsOnline(online);
      setNotice(online ? "online" : "offline");
    };
    const handleOffline = () => updateStatus(false);
    const handleOnline = () => updateStatus(true);
    const syncStatus = () => {
      const online = navigator.onLine;
      setIsOnline((currentStatus) => {
        if (currentStatus !== online) setNotice(online ? "online" : "offline");
        return online;
      });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncStatus();
    };

    // También informa si la PWA se abrió ya sin conexión.
    if (!navigator.onLine) setNotice("offline");

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("pageshow", syncStatus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("pageshow", syncStatus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // La reconexión se confirma durante unos segundos; el aviso offline sigue
  // visible hasta que la red vuelva.
  useEffect(() => {
    if (notice !== "online") return undefined;

    const timeout = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  if (!isPWA || !notice) return null;

  const offline = notice === "offline";

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

        background: offline ? "rgba(146, 64, 14, 0.92)" : "rgba(21, 128, 61, 0.92)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.18)",

        color: "#FFFFFF",
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "inherit",
        textAlign: "center",
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      {isOnline
        ? "Conexión a internet restablecida"
        : "Sin conexión a internet. Estás usando la versión guardada."}
    </div>
  );
}
