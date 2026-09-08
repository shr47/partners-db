import { useState, useRef, useEffect } from 'react';

export default function NameAutocomplete({ value, onChange, allNames, placeholder = 'שם איש קשר' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const suggestions = allNames.filter(
    n => n !== query && n.toLowerCase().includes(query.toLowerCase())
  );

  function select(name) { setQuery(name); onChange(name); setOpen(false); }

  return (
    <div className="autocomplete-wrap" ref={ref}>
      <input
        className="edit-input"
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        dir="rtl"
      />
      {open && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.slice(0, 8).map(name => (
            <li key={name} onMouseDown={() => select(name)} className="autocomplete-item">
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
