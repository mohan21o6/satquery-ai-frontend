import React, { useState } from 'react';
import { Search, X, ArrowRight, FileText, Cpu, MapPin } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const items = [
    { title: 'ChangeFormer V6 Siamese ViT Specs', category: 'Models', id: 'models', icon: Cpu },
    { title: 'Spatial Difference Neck Architecture', category: 'Models', id: 'models', icon: Cpu },
    { title: 'Bi-Temporal Change Detection & Masks', category: 'Models', id: 'models', icon: Cpu },
    { title: 'Urban Growth & Infrastructure Tracking', category: 'Use Cases', id: 'use-cases', icon: MapPin },
    { title: 'Environmental Change Telemetry', category: 'Use Cases', id: 'use-cases', icon: MapPin },
    { title: 'Supported Formats (GeoTIFF, TIFF, PNG, JPEG)', category: 'Docs', id: 'inputs', icon: FileText },
    { title: 'Change Detection Workflow & Alignment', category: 'Workflow', id: 'how-it-works', icon: FileText },
    { title: 'Frequently Asked Questions & Security', category: 'FAQ', id: 'faq', icon: FileText },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(2, 6, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 229, 255, 0.15)',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Search size={18} color="var(--accent-cyan)" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search models, use cases, formats, documentation..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px 14px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No matching resources found for "{searchTerm}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 229, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'rgba(0, 229, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 500 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {item.category.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
