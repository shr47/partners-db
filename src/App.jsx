import { useState, useMemo } from 'react';
import partners from './data/partners.json';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import PartnerRow from './components/PartnerRow';
import PartnerDetail from './components/PartnerDetail';
import './App.css';

const DEFAULT_FILTERS = { eco: 'הכל', level: 'הכל' };

function normalize(str) {
  if (!str) return '';
  if (typeof str === 'object') return str.name ? str.name.toLowerCase() : '';
  return str.toLowerCase().trim();
}

function hasData(p) {
  return (
    p.products.length > 0 ||
    p.contacts.sell.length > 0 ||
    p.contacts.presale.length > 0 ||
    p.contacts.deployment.length > 0 ||
    p.contacts.expertLab ||
    p.contacts.clientEngineer.length > 0 ||
    p.partnerLevel ||
    p.notes
  );
}

export default function App() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = normalize(search);
    const result = partners.filter(p => {
      if (filters.eco !== 'הכל' && p.eco !== filters.eco) return false;
      if (filters.level !== 'הכל' && p.partnerLevel !== filters.level) return false;
      if (!q) return true;
      const contactNames = ['sell','presale','deployment','clientEngineer']
        .flatMap(k => Array.isArray(p.contacts[k]) ? p.contacts[k].map(c => normalize(c.name)) : []);
      return (
        normalize(p.name).includes(q) ||
        p.products.some(prod => normalize(prod).includes(q)) ||
        contactNames.some(n => n.includes(q)) ||
        normalize(p.eco).includes(q) ||
        normalize(p.notes).includes(q)
      );
    });
    // שותפים עם מידע קודם, ריקים אחרי
    return [
      ...result.filter(p => hasData(p)),
      ...result.filter(p => !hasData(p)),
    ];
  }, [search, filters]);

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-ibm">IBM</span>
            <span className="logo-title">Partner Hub Israel</span>
          </div>
          <p className="header-sub">בסיס נתונים של שותפים עסקיים · {partners.length} שותפים</p>
          <div className="header-links">
            <a
              href="https://ibmsc.lightning.force.com/lightning/page/analytics?wave__assetType=dashboard&wave__assetId=0FKgR00000014ETWAY"
              target="_blank"
              rel="noreferrer"
              className="header-link-btn isc-btn"
              title="דוח ISC — נדרשות הרשאות Salesforce"
            >
              <span className="link-icon">📊</span>
              ISC Dashboard
            </a>
            <a
              href="https://www.ibm.com/partnerplus/directory/companies?field_keyword_03[0]=Israel"
              target="_blank"
              rel="noreferrer"
              className="header-link-btn portal-btn"
              title="IBM Partner Plus Directory — Israel"
            >
              <span className="link-icon">🌐</span>
              Partner Portal
            </a>
          </div>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <SearchBar value={search} onChange={setSearch} />
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            totalCount={partners.length}
            filteredCount={filtered.length}
          />
        </aside>

        <section className="content">
          <div className="partners-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span>🔍</span>
                <p>לא נמצאו שותפים תואמים</p>
                <button onClick={() => { setSearch(''); setFilters(DEFAULT_FILTERS); }}>
                  נקה חיפוש
                </button>
              </div>
            ) : (
              filtered.map(p => (
                <PartnerRow
                  key={p.id}
                  partner={p}
                  isSelected={selected?.id === p.id}
                  onClick={() => setSelected(selected?.id === p.id ? null : p)}
                />
              ))
            )}
          </div>
        </section>

        {selected && (
          <aside className="detail-sidebar">
            <PartnerDetail partner={selected} onClose={() => setSelected(null)} />
          </aside>
        )}
      </main>
    </div>
  );
}
