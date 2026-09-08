import { useState, useMemo } from 'react';
import partners from './data/partners.json';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import PartnerCard from './components/PartnerCard';
import PartnerDetail from './components/PartnerDetail';
import './App.css';

const DEFAULT_FILTERS = { eco: 'הכל', level: 'הכל' };

function normalize(str) {
  return str.toLowerCase().trim();
}

export default function App() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = normalize(search);
    return partners.filter(p => {
      if (filters.eco !== 'הכל' && p.eco !== filters.eco) return false;
      if (filters.level !== 'הכל' && p.partnerLevel !== filters.level) return false;
      if (!q) return true;
      return (
        normalize(p.name).includes(q) ||
        p.products.some(prod => normalize(prod).includes(q)) ||
        Object.values(p.contacts).some(v => normalize(v).includes(q)) ||
        normalize(p.eco).includes(q) ||
        normalize(p.notes).includes(q)
      );
    });
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

        <section className={`content ${selected ? 'with-detail' : ''}`}>
          <div className="cards-grid">
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
                <PartnerCard
                  key={p.id}
                  partner={p}
                  isSelected={selected?.id === p.id}
                  onClick={setSelected}
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
