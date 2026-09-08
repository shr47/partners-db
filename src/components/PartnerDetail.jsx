const LEVEL_COLORS = {
  Platinum: '#6b7280',
  Gold: '#d97706',
  Silver: '#64748b',
};
const ECO_COLORS = {
  Michal: '#3b82f6',
  Amitai: '#8b5cf6',
  Dan: '#10b981',
  Orly: '#f59e0b',
};

function InfoSection({ title, children }) {
  return (
    <div className="info-section">
      <h4 className="info-section-title">{title}</h4>
      {children}
    </div>
  );
}

function ContactCard({ person }) {
  return (
    <div className="contact-card">
      <span className="contact-name">{person.name}</span>
      {person.phone && (
        <a href={`tel:${person.phone}`} className="contact-detail phone">
          📞 {person.phone}
        </a>
      )}
      {person.email && (
        <a href={`mailto:${person.email}`} className="contact-detail email">
          ✉️ {person.email}
        </a>
      )}
    </div>
  );
}

function ContactSection({ label, people }) {
  if (!people || people.length === 0) return null;
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <div className="contact-cards-list">
        {people.map((p, i) => <ContactCard key={i} person={p} />)}
      </div>
    </div>
  );
}

export default function PartnerDetail({ partner, onClose }) {
  if (!partner) return null;
  const levelColor = LEVEL_COLORS[partner.partnerLevel] || '#9ca3af';
  const ecoColor = ECO_COLORS[partner.eco] || '#6b7280';
  const hasContacts =
    partner.contacts.sell.length > 0 ||
    partner.contacts.presale.length > 0 ||
    partner.contacts.deployment.length > 0 ||
    partner.contacts.clientEngineer.length > 0 ||
    partner.contacts.expertLab;

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-title-row">
          <h2 className="detail-name">{partner.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="detail-badges">
          {partner.partnerLevel && (
            <span className="badge level-badge lg" style={{ backgroundColor: levelColor }}>
              {partner.partnerLevel}
            </span>
          )}
          {partner.eco && (
            <span className="badge eco-badge lg" style={{ backgroundColor: ecoColor }}>
              Eco: {partner.eco}
            </span>
          )}
        </div>
      </div>

      <div className="detail-body">
        {partner.products.length > 0 && (
          <InfoSection title="מוצרים">
            <div className="products-list lg">
              {partner.products.map(p => (
                <span key={p} className="product-tag">{p}</span>
              ))}
            </div>
          </InfoSection>
        )}

        <InfoSection title="אנשי קשר">
          {hasContacts ? (
            <>
              <ContactSection label="Sell" people={partner.contacts.sell} />
              <ContactSection label="Presale" people={partner.contacts.presale} />
              <ContactSection label="Deployment" people={partner.contacts.deployment} />
              <ContactSection label="Client Engineer" people={partner.contacts.clientEngineer} />
              {partner.contacts.expertLab && (
                <div className="detail-row">
                  <span className="detail-label">Expert Lab</span>
                  <span className="detail-value">{partner.contacts.expertLab}</span>
                </div>
              )}
            </>
          ) : (
            <span className="no-data">אין מידע על אנשי קשר עדיין</span>
          )}
        </InfoSection>

        <InfoSection title="קישורים">
          {partner.links.partnerPortal ? (
            <a href={partner.links.partnerPortal} target="_blank" rel="noreferrer" className="link-btn">
              <span>🌐</span> Partner Portal
            </a>
          ) : (
            <span className="no-data">אין קישור ל-Partner Portal עדיין — ניתן להוסיף ב-JSON</span>
          )}
        </InfoSection>

        {partner.notes && (
          <InfoSection title="הערות">
            <p className="notes-text">{partner.notes}</p>
          </InfoSection>
        )}
      </div>
    </div>
  );
}
