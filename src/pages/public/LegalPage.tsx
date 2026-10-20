import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors";

type LegalSection = {
  title: string;
  content: ReactNode;
};

const privacySections: LegalSection[] = [
  {
    title: "1. Información que recopilamos",
    content: "Al crear una cuenta o solicitar una cita podemos recopilar tu nombre, correo electrónico, teléfono, datos de la cita y preferencias de servicio. También usamos datos técnicos mínimos para mantener tu sesión y el funcionamiento de la aplicación.",
  },
  {
    title: "2. Para qué usamos tus datos",
    content: "Usamos esta información para gestionar citas, comunicarnos contigo, brindar los servicios solicitados, atender incidencias y mejorar la experiencia en Barbería Carlyn.",
  },
  {
    title: "3. Protección y conservación",
    content: "Aplicamos medidas razonables para proteger tu información. Conservamos los datos únicamente durante el tiempo necesario para prestar el servicio, cumplir obligaciones aplicables o resolver controversias.",
  },
  {
    title: "4. Compartición de información",
    content: "No vendemos tus datos personales. Solo podemos compartirlos con proveedores que nos ayudan a operar la plataforma o cuando sea requerido por una autoridad competente, siempre bajo las salvaguardas correspondientes.",
  },
  {
    title: "5. Tus derechos",
    content: "Puedes solicitar acceso, corrección, actualización o eliminación de tus datos personales, sujeto a las obligaciones legales aplicables. Para hacerlo, contáctanos por los medios indicados abajo.",
  },
  {
    title: "6. Contacto y cambios",
    content: "Para dudas sobre privacidad, escribe a agustinsebas1986@gmail.com. Podemos actualizar esta política; publicaremos la fecha de la última actualización en esta página.",
  },
];

const termsSections: LegalSection[] = [
  {
    title: "1. Aceptación",
    content: "Al usar el sitio o la aplicación de Barbería Carlyn aceptas estos términos y la Política de Privacidad. Si no estás de acuerdo, por favor no utilices la plataforma.",
  },
  {
    title: "2. Citas y disponibilidad",
    content: "Las citas están sujetas a disponibilidad, confirmación y a las condiciones que se muestren durante el proceso de reserva. Te pedimos proporcionar información correcta y presentarte puntualmente.",
  },
  {
    title: "3. Cuenta y uso adecuado",
    content: "Eres responsable de mantener la confidencialidad de tu acceso y de la información que proporciones. No debes usar la plataforma con fines ilícitos, para interferir con su operación ni para afectar a otros usuarios.",
  },
  {
    title: "4. Precios y pagos",
    content: "Los precios y la disponibilidad pueden actualizarse. El importe aplicable será el mostrado o confirmado al momento de solicitar el servicio, salvo que exista un error evidente que deba corregirse.",
  },
  {
    title: "5. Contenido y propiedad intelectual",
    content: "El contenido, diseño, marcas e imágenes de esta plataforma pertenecen a Barbería Carlyn o a sus respectivos titulares. No pueden reproducirse o utilizarse sin autorización previa.",
  },
  {
    title: "6. Modificaciones y contacto",
    content: "Podemos modificar estos términos cuando sea necesario. El uso continuado de la plataforma después de publicar los cambios implica su aceptación. Para aclaraciones, contáctanos en agustinsebas1986@gmail.com.",
  },
];

interface LegalPageProps {
  type: "privacy" | "terms";
}

export const LegalPage = ({ type }: LegalPageProps) => {
  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "Política de Privacidad" : "Términos y Condiciones";
  const intro = isPrivacy
    ? "En Barbería Carlyn respetamos tu privacidad y protegemos la información que nos compartes."
    : "Estas condiciones regulan el uso del sitio web y la aplicación de Barbería Carlyn.";
  const sections = isPrivacy ? privacySections : termsSections;

  return (
    <section style={pageStyle}>
      <article style={cardStyle}>
        <p style={eyebrowStyle}>BARBERÍA CARLYN</p>
        <h1 style={titleStyle}>{title}</h1>
        <p style={introStyle}>{intro}</p>
        <p style={updatedStyle}>Última actualización: 20 de octubre de 2026</p>

        {sections.map((section) => (
          <section key={section.title} style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{section.title}</h2>
            <p style={textStyle}>{section.content}</p>
          </section>
        ))}

        <nav aria-label="Documentos legales" style={linksStyle}>
          <Link to={isPrivacy ? "/terminos-y-condiciones" : "/politica-de-privacidad"} style={linkStyle}>
            {isPrivacy ? "Ver Términos y Condiciones" : "Ver Política de Privacidad"}
          </Link>
        </nav>
      </article>
    </section>
  );
};

const pageStyle = { background: "#F8F6F1", minHeight: "70vh", padding: "64px 24px" };
const cardStyle = { background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 12px 36px rgba(10, 31, 68, 0.10)", margin: "0 auto", maxWidth: "900px", padding: "clamp(28px, 5vw, 64px)" };
const eyebrowStyle = { color: colors.doradoClasico, fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 12px" };
const titleStyle = { color: colors.grafito, fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.15, margin: "0 0 16px" };
const introStyle = { color: colors.azulAcero, fontSize: "18px", lineHeight: 1.7, margin: "0 0 8px" };
const updatedStyle = { color: "#667085", fontSize: "14px", margin: "0 0 38px" };
const sectionStyle = { borderTop: "1px solid #E8E4DA", padding: "24px 0" };
const sectionTitleStyle = { color: colors.grafito, fontSize: "20px", margin: "0 0 10px" };
const textStyle = { color: "#475467", lineHeight: 1.75, margin: 0 };
const linksStyle = { borderTop: "1px solid #E8E4DA", paddingTop: "24px" };
const linkStyle = { color: colors.doradoClasico, fontWeight: 700, textDecoration: "none" };
