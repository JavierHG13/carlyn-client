import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faKey, faLink, faMicrophone, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { alexaService } from "../../services/alexaService";
import { colors } from "../../styles/colors";

export const AlexaVincular: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  const initialCode = useMemo(() => new URLSearchParams(location.search).get("code") || "", [location.search]);
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { state: { redirectTo: `/alexa/vincular${location.search}` } });
    }
  }, [isAuthenticated, loading, location.search, navigate]);

  const normalizeCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    setMessage("");

    if (code.length < 6) {
      setStatus("error");
      setMessage("Ingresa el código completo que te dio Alexa.");
      return;
    }

    setSubmitting(true);
    try {
      await alexaService.confirmLink(code);
      setStatus("success");
      setMessage("Tu cuenta quedó vinculada con Alexa. Ya puedes volver a la skill y pedir tus citas.");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "No se pudo vincular el código. Genera uno nuevo desde Alexa.");
    } finally {
      setSubmitting(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: colors.blancoHueso,
    color: colors.negroSuave,
    padding: "42px 20px",
  };

  const shellStyle: React.CSSProperties = {
    maxWidth: 920,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 22,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #EDF2F7",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  };

  const eyebrowStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    color: colors.doradoClasico,
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: "16px",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "Playfair Display, serif",
    fontSize: "32px",
    lineHeight: 1.12,
    margin: "0 0 10px",
    color: colors.negroSuave,
  };

  const textStyle: React.CSSProperties = {
    color: "#718096",
    lineHeight: 1.65,
    fontSize: "16px",
    maxWidth: "620px",
  };

  const stepsStyle: React.CSSProperties = {
    display: "grid",
    gap: 12,
    marginTop: 22,
  };

  const stepStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    padding: 14,
    backgroundColor: "#FAF4E8",
    border: "1px solid rgba(201,151,0,0.2)",
    borderRadius: 8,
  };

  const stepNumberStyle: React.CSSProperties = {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: colors.doradoClasico,
    color: "#111827",
    fontSize: "13px",
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #E2E8F0",
    backgroundColor: "#ffffff",
    color: colors.negroSuave,
    borderRadius: 8,
    padding: "14px",
    fontSize: "26px",
    fontWeight: 800,
    textAlign: "center",
    letterSpacing: "6px",
    outline: "none",
    textTransform: "uppercase",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "none",
    borderRadius: 8,
    backgroundColor: colors.doradoClasico,
    color: "white",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: submitting ? "not-allowed" : "pointer",
    opacity: submitting ? 0.72 : 1,
  };

  const alertStyle = (type: "success" | "error"): React.CSSProperties => ({
    borderRadius: "10px",
    padding: "13px 14px",
    backgroundColor: type === "success" ? "#ecfdf5" : "#fef2f2",
    border: `1px solid ${type === "success" ? "#a7f3d0" : "#fecaca"}`,
    color: type === "success" ? "#047857" : "#b91c1c",
    fontSize: "14px",
    lineHeight: 1.5,
  });

  if (loading || !isAuthenticated) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: "720px", margin: "0 auto", color: colors.azulAcero }}>Preparando vinculación...</div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <aside style={cardStyle}>
        
          <h1 style={{ margin: 0, color: colors.negroSuave, fontSize: 24 }}>Alexa</h1>
          <p style={{ color: "#718096", marginTop: 6 }}>Vinculación de cuenta</p>
          <div style={{ display: "grid", gap: 10, marginTop: 20, color: "#475569", fontSize: 14 }}>
            <span><FontAwesomeIcon icon={faShieldHalved} style={{ marginRight: 8, color: colors.doradoClasico }} />Código temporal</span>
            <span><FontAwesomeIcon icon={faKey} style={{ marginRight: 8, color: colors.doradoClasico }} />Conectado como {user?.nombre}</span>
          </div>

          <div style={stepsStyle}>
            <div style={stepStyle}>
              <span style={stepNumberStyle}>1</span>
              <div>
                <strong>Abre la skill</strong>
                <p style={{ ...textStyle, margin: "4px 0 0", fontSize: 13 }}>Di: Alexa, abre Barbería Carlyn.</p>
              </div>
            </div>
            <div style={stepStyle}>
              <span style={stepNumberStyle}>2</span>
              <div>
                <strong>Pide un código</strong>
                <p style={{ ...textStyle, margin: "4px 0 0", fontSize: 13 }}>Alexa lo dictará si aún no detecta tu cuenta.</p>
              </div>
            </div>
            <div style={stepStyle}>
              <span style={stepNumberStyle}>3</span>
              <div>
                <strong>Vincula una vez</strong>
                <p style={{ ...textStyle, margin: "4px 0 0", fontSize: 13 }}>La conexión queda guardada para tus próximas consultas.</p>
              </div>
            </div>
          </div>
        </aside>

        <section style={cardStyle}>
        
          <h2 style={titleStyle}>Vincular Alexa</h2>
          <p style={{ ...textStyle, marginBottom: 24 }}>
            Escribe el código que te dio Alexa para enlazar esta cuenta con la skill. Después podrás consultar tus citas y comenzar reservas usando tu voz.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={{ display: "block", color: colors.azulAcero, fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
                Código de vinculación
              </label>
            <input
              value={code}
              onChange={(event) => setCode(normalizeCode(event.target.value))}
              placeholder="ABC123"
              style={inputStyle}
              autoComplete="one-time-code"
              aria-label="Código de vinculación Alexa"
            />
            </div>

            {status !== "idle" && message && <div style={alertStyle(status)}>{message}</div>}

            <button type="submit" style={buttonStyle} disabled={submitting || status === "success"}>
              <FontAwesomeIcon icon={status === "success" ? faCheckCircle : faLink} />
              {status === "success" ? "Cuenta vinculada" : submitting ? "Vinculando..." : "Vincular con Alexa"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};
