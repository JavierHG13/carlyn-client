import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

export const Nosotros: React.FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>

      {/* HERO */}
      <section style={{
        height: '60vh',
        backgroundImage: "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>Nuestra Barbería</h1>
          <p>Tradición, estilo y experiencia en cada corte</p>
        </motion.div>
      </section>

      {/* HISTORIA */}
      <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Nuestra Historia</h2>
        <p style={{ lineHeight: 1.7 }}>
          Somos una barbería con más de 10 años de experiencia ofreciendo servicios de alta calidad.
          Nos especializamos en cortes modernos y clásicos, siempre cuidando cada detalle para
          que cada cliente salga satisfecho.
        </p>
      </section>



      {/* DIRECCIÓN Y CONTACTO */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Visítanos</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Dirección: Calle Ejemplo 123, Ciudad</p>
              <p><FontAwesomeIcon icon={faPhone} /> Teléfono: 55 1234 5678</p>
              <p><FontAwesomeIcon icon={faClock} /> Horario: Lun - Sáb / 10:00 AM - 8:00 PM</p>
            </div>

            <iframe
              src="https://www.google.com/maps?q=Ciudad+de+Mexico&output=embed"
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: '10px' }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

    

    </div>
  );
};
