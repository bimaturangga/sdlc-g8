import { useEffect, useRef, useState } from 'react';

export default function SearchableSelect({
  id,
  options = [],
  value = '',
  onChange,
  placeholder = 'Pilih atau cari jurusan...',
  allowCustom = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const customInputRef = useRef(null);

  // Filter options based on search query
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const exactMatchExists = options.some(
    (opt) => opt.toLowerCase() === searchQuery.trim().toLowerCase(),
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
        setIsCustomMode(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input or custom input when opened
  useEffect(() => {
    if (isOpen) {
      if (isCustomMode) {
        customInputRef.current?.focus();
      } else {
        searchInputRef.current?.focus();
      }
    }
  }, [isOpen, isCustomMode]);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
    setIsCustomMode(false);
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  }

  function handleApplyCustom(e) {
    e?.preventDefault();
    if (customInput.trim()) {
      onChange(customInput.trim());
      setIsOpen(false);
      setCustomInput('');
      setIsCustomMode(false);
      setSearchQuery('');
    }
  }

  function handleUseQueryAsCustom() {
    if (searchQuery.trim()) {
      onChange(searchQuery.trim());
      setIsOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <div className="searchable-select-wrapper" ref={containerRef}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        className={`searchable-select-trigger ${isOpen ? 'active' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="trigger-content">
          <svg
            className="trigger-icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              d="M3 7.5L10 3.5L17 7.5L10 11.5L3 7.5Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 10.5V14.5C5 15.5 7.2 16.5 10 16.5C12.8 16.5 15 15.5 15 14.5V10.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={value ? 'select-val' : 'select-placeholder'}>
            {value || placeholder}
          </span>
        </span>

        <span className="trigger-actions">
          {value && (
            <span
              role="button"
              tabIndex={0}
              className="trigger-clear-btn"
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
              title="Hapus pilihan"
              aria-label="Hapus pilihan"
            >
              &times;
            </span>
          )}
          <svg
            className={`dropdown-chevron ${isOpen ? 'open' : ''}`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="searchable-dropdown-menu" role="listbox">
          {!isCustomMode ? (
            <>
              {/* Search Field */}
              <div className="search-input-box">
                <svg
                  className="search-input-icon"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="6" strokeWidth="1.7" />
                  <path d="M13.5 13.5L17 17" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Ketik nama jurusan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsOpen(false);
                    } else if (
                      e.key === 'Enter' &&
                      filteredOptions.length === 1
                    ) {
                      e.preventDefault();
                      handleSelect(filteredOptions[0]);
                    } else if (
                      e.key === 'Enter' &&
                      filteredOptions.length === 0 &&
                      searchQuery.trim()
                    ) {
                      e.preventDefault();
                      handleUseQueryAsCustom();
                    }
                  }}
                  aria-label="Cari jurusan"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Options List */}
              <ul className="searchable-options-list">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected = value === option;
                    return (
                      <li
                        key={option}
                        className={`searchable-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="option-name">{option}</span>
                        {isSelected && (
                          <svg
                            className="check-mark"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            width="18"
                            height="18"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="searchable-empty">
                    <p>Tidak ada jurusan yang cocok dengan "{searchQuery}"</p>
                    {allowCustom && searchQuery.trim() && !exactMatchExists && (
                      <button
                        type="button"
                        className="custom-quick-add-btn"
                        onClick={handleUseQueryAsCustom}
                      >
                        + Gunakan <strong>"{searchQuery.trim()}"</strong>
                      </button>
                    )}
                  </li>
                )}
              </ul>

              {/* Footer action to type custom major */}
              {allowCustom && (
                <div className="searchable-dropdown-footer">
                  <button
                    type="button"
                    className="custom-toggle-btn"
                    onClick={() => {
                      setIsCustomMode(true);
                      setCustomInput(searchQuery.trim());
                    }}
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M10 4V16M4 10H16" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Jurusan tidak ada di daftar? Tulis manual
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Custom Input Form Mode */
            <form onSubmit={handleApplyCustom} className="custom-input-form">
              <div className="custom-form-header">
                <span className="custom-form-title">Tulis Nama Jurusan Manual</span>
                <button
                  type="button"
                  className="link-button"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setIsCustomMode(false)}
                >
                  ← Kembali ke daftar
                </button>
              </div>
              <input
                ref={customInputRef}
                type="text"
                placeholder="Contoh: Arsitektur, Hubungan Masyarakat..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="custom-text-input"
              />
              <div className="custom-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  onClick={() => setIsCustomMode(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  disabled={!customInput.trim()}
                >
                  Terapkan Jurusan
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
