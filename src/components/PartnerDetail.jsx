import { useState } from 'react';
import NameAutocomplete from './NameAutocomplete';

const LEVEL_COLORS = { Platinum: '#6b7280', Gold: '#d97706', Silver: '#64748b' };
const ECO_COLORS = { Michal: '#3b82f6', Amitai: '#8b5cf6', Dan: '#10b981', Orly: '#f59e0b' };
const CONTACT_ROLES = ['sell', 'presale', 'deployment', 'clientEngineer'];
const ROLE_LABELS = { sell: 'Sell', presale: 'Presale', deployment: 'Deployment', clientEngineer: 'Client Engineer' };

function emptyContact() { return { name: '', phone: '', email: '' }; }
function emptyProduct() {
  return {
    name: '',
    contacts: { sell: [], presale: [], deployment: [], expertLab: '', clientEngineer: [] }
  };
}

function ContactEditor({ person, onChange, onRemove, allNames }) {
  return (
    <div className="contact-editor">
      <div className="contact-editor-fields">
        <NameAutocomplete value={person.name} onChange={v => onChange({ ...person, name: v })} allNames={allNames} placeholder="שם" />
        <input className="edit-input" value={person.phone} onChange={e => onChange({ ...person, phone: e.target.value })} placeholder="טלפון" dir="ltr" />
        <input className="edit-input" value={person.email} onChange={e => onChange({ ...person, email: e.target.value })} placeholder="מייל" dir="ltr" />
      </div>
      <button className="btn-icon remove" onClick={onRemove} title="הסר">✕</button>
    </div>
  );
}

function ProductEditor({ product, productIdx, onChange, allNames }) {
  function updateContact(role, idx, val) {
    const updated = product.contacts[role].map((c, i) => i === idx ? val : c);
    onChange({ ...product, contacts: { ...product.contacts, [role]: updated } });
  }
  function addContact(role) {
    onChange({ ...product, contacts: { ...product.contacts, [role]: [...product.contacts[role], emptyContact()] } });
  }
  function removeContact(role, idx) {
    onChange({ ...product, contacts: { ...product.contacts, [role]: product.contacts[role].filter((_, i) => i !== idx) } });
  }

  return (
    <div className="product-editor">
      <div className="product-editor-header">
        <span className="product-tag lg">{product.name || `מוצר ${productIdx + 1}`}</span>
      </div>
      {CONTACT_ROLES.map(role => (
        <div key={role} className="role-section">
          <div className="role-label-row">
            <span className="role-label">{ROLE_LABELS[role]}</span>
            <button className="btn-add-contact" onClick={() => addContact(role)}>+ הוסף</button>
          </div>
          {product.contacts[role].map((person, idx) => (
            <ContactEditor
              key={idx}
              person={person}
              onChange={val => updateContact(role, idx, val)}
              onRemove={() => removeContact(role, idx)}
              allNames={allNames}
            />
          ))}
          {product.contacts[role].length === 0 && (
            <span className="no-contacts-hint">אין אנשי קשר</span>
          )}
        </div>
      ))}
      <div className="role-section">
        <span className="role-label">Expert Lab</span>
        <input
          className="edit-input"
          value={product.contacts.expertLab}
          onChange={e => onChange({ ...product, contacts: { ...product.contacts, expertLab: e.target.value } })}
          placeholder="קיים / לא קיים"
          dir="rtl"
        />
      </div>
    </div>
  );
}

export default function PartnerDetail({ partner, allNames, onChange, onClose }) {
  if (!partner) return null;
  const levelColor = LEVEL_COLORS[partner.partnerLevel] || '#9ca3af';
  const ecoColor = ECO_COLORS[partner.eco] || '#6b7280';

  function updateProduct(idx, val) {
    const products = partner.products.map((p, i) => i === idx ? val : p);
    onChange({ ...partner, products });
  }
  function addProduct() {
    onChange({ ...partner, products: [...partner.products, emptyProduct()] });
  }
  function removeProduct(idx) {
    onChange({ ...partner, products: partner.products.filter((_, i) => i !== idx) });
  }

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-title-row">
          <h2 className="detail-name">{partner.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="detail-badges">
          {partner.partnerLevel && <span className="badge level-badge lg" style={{ backgroundColor: levelColor }}>{partner.partnerLevel}</span>}
          {partner.eco && <span className="badge eco-badge lg" style={{ backgroundColor: ecoColor }}>Eco: {partner.eco}</span>}
        </div>
      </div>

      <div className="detail-body">
        {/* מוצרים + אנשי קשר */}
        <div className="detail-section-title">
          מוצרים ואנשי קשר
          <button className="btn-add-product" onClick={addProduct}>+ הוסף מוצר</button>
        </div>

        {partner.products.length === 0 && (
          <span className="no-data">אין מוצרים — לחצי "+ הוסף מוצר"</span>
        )}

        {partner.products.map((prod, idx) => (
          <div key={idx} className="product-block">
            <div className="product-block-header">
              <input
                className="edit-input product-name-input"
                value={prod.name}
                onChange={e => updateProduct(idx, { ...prod, name: e.target.value })}
                placeholder="שם מוצר"
                dir="ltr"
              />
              <button className="btn-icon remove" onClick={() => removeProduct(idx)} title="מחק מוצר">🗑</button>
            </div>
            <ProductEditor
              product={prod}
              productIdx={idx}
              onChange={val => updateProduct(idx, val)}
              allNames={allNames}
            />
          </div>
        ))}

        {/* קישורים */}
        <div className="detail-section-title">קישורים</div>
        <div className="detail-row">
          <span className="detail-label">Partner Portal</span>
          <input
            className="edit-input"
            value={partner.links.partnerPortal}
            onChange={e => onChange({ ...partner, links: { ...partner.links, partnerPortal: e.target.value } })}
            placeholder="https://..."
            dir="ltr"
          />
        </div>
        {partner.links.partnerPortal && (
          <a href={partner.links.partnerPortal} target="_blank" rel="noreferrer" className="link-btn">🌐 פתח Partner Portal</a>
        )}

        {/* הערות */}
        <div className="detail-section-title">הערות</div>
        <textarea
          className="edit-textarea"
          value={partner.notes}
          onChange={e => onChange({ ...partner, notes: e.target.value })}
          placeholder="הערות חופשיות..."
          dir="rtl"
          rows={3}
        />
      </div>
    </div>
  );
}
