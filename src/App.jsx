import { useState, useMemo } from 'react';
import initialPartners from './data/partners.json';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import PartnerRow from './components/PartnerRow';
import PartnerDetail from './components/PartnerDetail';
import './App.css';

const DEFAULT_FILTERS = { eco: 'הכל', level: 'הכל' };

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase().trim();
}

function hasData(p) {
  return p.products.length > 0 || p.partnerLevel || p.notes;
}

// כל השמות הייחודיים מכל אנשי הקשר
function getAllNames(partners) {
  const names = new Set();
  partners.forEach(p =>
    p.products.forEach(prod =>
      ['sell', 'presale', 'deployment', 'clientEngineer'].forEach(role =>
        (prod.contacts[role] || []).forEach(c => { if (c.name) names.add(c.name); })
      )
    )
  );
  return Array.from(names).sort();
}

function exportJSON(partners) {
  const blob = new Blob([JSON.stringify(partners, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'partners.json';
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [partners, setPartners] = useState(initialPartners);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const allNames = useMemo(() => getAllNames(partners), [partners]);

  const filtered = useMemo(() => {
    const q = normalize(search);
    const result = partners.filter(p => {
      if (filters.eco !== 'הכל' && p.eco !== filters.eco) return false;
      if (filters.level !== 'הכל' && p.partnerLevel !== filters.level) return false;
      if (!q) return true;
      const contactNames = p.products.flatMap(prod =>
        ['sell', 'presale', 'deployment', 'clientEngineer'].flatMap(role =>
          (prod.contacts[role] || []).map(c => normalize(c.name))
        )
      );
      const productNames = p.products.map(prod => normalize(prod.name));
      return (
        normalize(p.name).includes(q) ||
        productNames.some(n => n.includes(q)) ||
        contactNames.some(n => n.includes(q)) ||
        normalize(p.eco).includes(q) ||
        normalize(p.notes).includes(q)
      );
    });
    return [
      ...result.filter(p => hasData(p)),
      ...result.filter(p => !hasData(p)),
    ];
  }, [search, filters, partners]);

  function handlePartnerChange(updated) {
    setPartners(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelected(updated);
    setHasChanges(true);
  }

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
            {hasChanges && (
              <button
                className="header-link-btn export-btn"
                onClick={() => { exportJSON(partners); setHasChanges(false); }}
                title="הורד את הנתונים המעודכנים"
              >
                💾 שמור שינויים
              </button>
            )}
            <a
              href="https://ibmsc.lightning.force.com/lightning/page/analytics?wave__assetType=dashboard&wave__assetId=0FKgR00000014ETWAY"
              target="_blank" rel="noreferrer"
              className="header-link-btn isc-btn"
            >
              <span className="link-icon">📊</span> ISC Dashboard
            </a>
            <a
              href="https://www.ibm.com/partnerplus/directory/companies?field_keyword_03[0]=Israel"
              target="_blank" rel="noreferrer"
              className="header-link-btn portal-btn"
            >
              <span className="link-icon">🌐</span> Partner Portal
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
                <button onClick={() => { setSearch(''); setFilters(DEFAULT_FILTERS); }}>נקה חיפוש</button>
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
            <PartnerDetail
              partner={selected}
              allNames={allNames}
              onChange={handlePartnerChange}
              onClose={() => setSelected(null)}
            />
          </aside>
        )}
      </main>
    </div>
  );
}
