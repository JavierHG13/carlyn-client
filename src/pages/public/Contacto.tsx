import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../../styles/colors";

export const Contacto = () => (
  <section style={pageStyle}>
    <div style={contentStyle}>
      <p style={eyebrowStyle}>ESTAMOS PARA ATENDERTE</p>
      <h1 style={titleStyle}>Contacto</h1>
      <p style={introStyle}>Reserva tu cita o escríbenos para resolver cualquier duda sobre nuestros servicios.</p>

      <div style={gridStyle}>
        <article style={cardStyle}>
          <FontAwesomeIcon icon={faPhone} style={iconStyle} />
          <h2 style={cardTitleStyle}>Teléfono</h2>
          <a href="tel:+527712613445" style={linkStyle}>+52 771 261 3445</a>
        </article>
        <article style={cardStyle}>
          <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
          <h2 style={cardTitleStyle}>Correo</h2>
          <a href="mailto:agustinsebas1986@gmail.com" style={linkStyle}>agustinsebas1986@gmail.com</a>
        </article>
        <article style={cardStyle}>
          <FontAwesomeIcon icon={faLocationDot} style={iconStyle} />
          <h2 style={cardTitleStyle}>Ubicación</h2>
          <p style={textStyle}>Boulevard Adolfo López Mateos, 43000 Huejutla, Hgo., México</p>
        </article>
        <article style={cardStyle}>
          <FontAwesomeIcon icon={faClock} style={iconStyle} />
          <h2 style={cardTitleStyle}>Horario</h2>
          <p style={textStyle}>Lunes a sábado: 8:00 AM - 8:00 PM</p>
          <p style={textStyle}>Domingos: cerrado</p>
        </article>
      </div>
    </div>
  </section>
);

const pageStyle = { background: "#F8F6F1", minHeight: "70vh", padding: "64px 24px" };
const contentStyle = { margin: "0 auto", maxWidth: "1040px" };
const eyebrowStyle = { color: colors.doradoClasico, fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 12px" };
const titleStyle = { color: colors.grafito, fontSize: "clamp(32px, 5vw, 46px)", margin: "0 0 14px" };
const introStyle = { color: colors.azulAcero, fontSize: "18px", lineHeight: 1.7, margin: "0 0 34px", maxWidth: "680px" };
const gridStyle = { display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" };
const cardStyle = { background: "#FFFFFF", borderRadius: "14px", boxShadow: "0 10px 28px rgba(10, 31, 68, 0.08)", padding: "28px" };
const iconStyle = { color: colors.doradoClasico, fontSize: "24px" };
const cardTitleStyle = { color: colors.grafito, fontSize: "19px", margin: "16px 0 10px" };
const textStyle = { color: "#475467", lineHeight: 1.6, margin: "4px 0" };
const linkStyle = { color: colors.azulAcero, lineHeight: 1.6, overflowWrap: "anywhere" as const, textDecoration: "none" };
