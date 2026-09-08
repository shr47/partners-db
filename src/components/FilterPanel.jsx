const ECO_OPTIONS = ['הכל', 'Michal', 'Amitai', 'Dan', 'Orly'];
const LEVEL_OPTIONS = ['הכל', 'Platinum', 'Gold', 'Silver'];

export default function FilterPanel({ filters, onChange, totalCount, filteredCount }) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Eco Manager</label>
        <div className="filter-chips">
          {ECO_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`chip ${filters.eco === opt ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, eco: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>רמת שותף</label>
        <div className="filter-chips">
          {LEVEL_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`chip level-chip ${opt.toLowerCase()} ${filters.level === opt ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, level: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="results-count">
        מציג <strong>{filteredCount}</strong> מתוך <strong>{totalCount}</strong> שותפים
      </div>
    </div>
  );
}
