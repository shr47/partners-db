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

function ContactRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="contact-row">
      <span className="contact-label">{label}</span>
      <span className="contact-value">{value}</span>
    </div>
  );
}

export default function PartnerCard({ partner, onClick, isSelected }) {
  const levelColor = LEVEL_COLORS[partner.partnerLevel] || '#9ca3af';
  const ecoColor = ECO_COLORS[partner.eco] || '#6b7280';
  const hasContacts = Object.values(partner.contacts).some(v => v);

  return (
    <div
      className={`partner-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(partner)}
    >
      <div className="card-header">
        <h3 className="partner-name">{partner.name}</h3>
        <div className="card-badges">
          {partner.partnerLevel && (
            <span className="badge level-badge" style={{ backgroundColor: levelColor }}>
              {partner.partnerLevel}
            </span>
          )}
          {partner.eco && (
            <span className="badge eco-badge" style={{ backgroundColor: ecoColor }}>
              {partner.eco}
            </span>
          )}
        </div>
      </div>

      {partner.products.length > 0 && (
        <div className="products-list">
          {partner.products.map(p => (
            <span key={p} className="product-tag">{p}</span>
          ))}
        </div>
      )}

      {hasContacts && (
        <div className="contacts-preview">
          <ContactRow label="Sell" value={partner.contacts.sell} />
          <ContactRow label="Presale" value={partner.contacts.presale} />
        </div>
      )}

      {partner.notes && (
        <div className="card-notes">{partner.notes}</div>
      )}
    </div>
  );
}
