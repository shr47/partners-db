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

export default function PartnerRow({ partner, onClick, isSelected }) {
  const levelColor = LEVEL_COLORS[partner.partnerLevel] || null;
  const ecoColor = ECO_COLORS[partner.eco] || '#9ca3af';
  const sellNames = partner.contacts.sell.map(c => c.name).join(', ');
  const presaleNames = partner.contacts.presale.map(c => c.name).join(', ');

  return (
    <div
      className={`partner-row ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {/* שם השותף */}
      <div className="row-name-col">
        <span className="partner-name-highlight">{partner.name}</span>
        <div className="row-badges">
          {partner.eco && (
            <span className="badge eco-badge" style={{ backgroundColor: ecoColor }}>
              {partner.eco}
            </span>
          )}
          {partner.partnerLevel && (
            <span className="badge level-badge" style={{ backgroundColor: levelColor }}>
              {partner.partnerLevel}
            </span>
          )}
        </div>
      </div>

      {/* מוצרים */}
      <div className="row-products-col">
        {partner.products.length > 0 ? (
          <div className="products-list">
            {partner.products.map(p => (
              <span key={p} className="product-tag">{p}</span>
            ))}
          </div>
        ) : (
          <span className="empty-cell">—</span>
        )}
      </div>

      {/* אנשי קשר */}
      <div className="row-contacts-col">
        {sellNames && <div className="row-contact"><span className="contact-label">Sell</span><span>{sellNames}</span></div>}
        {presaleNames && <div className="row-contact"><span className="contact-label">Presale</span><span>{presaleNames}</span></div>}
        {!sellNames && !presaleNames && <span className="empty-cell">—</span>}
      </div>

      {/* חץ */}
      <div className="row-arrow">{isSelected ? '▲' : '▼'}</div>
    </div>
  );
}
