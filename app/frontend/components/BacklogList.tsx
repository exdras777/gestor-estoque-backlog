'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

type Filter = 'all' | 'critical' | 'urgent' | 'warning';

const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Eletrônicos',
  clothing: 'Roupas',
  food: 'Alimentos',
  books: 'Livros',
  other: 'Outro',
};

const BADGE_MAP: Record<string, string> = {
  electronics: 'badge-eletronicos',
  clothing:    'badge-roupas',
  food:        'badge-alimentos',
  books:       'badge-livros',
  other:       'badge-outro',
};

function getPriority(stock: number): { label: string; color: string; bg: string; border: string; level: Filter } {
  if (stock === 0) return {
    label: 'Crítico',
    color: '#fda4af',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.3)',
    level: 'critical',
  };
  if (stock <= 5) return {
    label: 'Urgente',
    color: '#fbbf24',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    level: 'urgent',
  };
  return {
    label: 'Atenção',
    color: '#93c5fd',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.3)',
    level: 'warning',
  };
}

export default function BacklogList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => ({
    critical: products.filter(p => p.stock === 0).length,
    urgent: products.filter(p => p.stock >= 1 && p.stock <= 5).length,
    warning: products.filter(p => p.stock >= 6 && p.stock <= 15).length,
  }), [products]);

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        if (filter === 'critical') return p.stock === 0;
        if (filter === 'urgent') return p.stock >= 1 && p.stock <= 5;
        if (filter === 'warning') return p.stock >= 6 && p.stock <= 15;
        return true;
      })
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.stock - b.stock);
  }, [products, filter, search]);

  const tabs: { key: Filter; label: string; count: number; activeColor: string }[] = [
    { key: 'all', label: 'Todos', count: products.length, activeColor: 'var(--accent-cyan)' },
    { key: 'critical', label: '🔴 Crítico', count: counts.critical, activeColor: '#f43f5e' },
    { key: 'urgent', label: '🟡 Urgente', count: counts.urgent, activeColor: '#f59e0b' },
    { key: 'warning', label: '🔵 Atenção', count: counts.warning, activeColor: '#6366f1' },
  ];

  return (
    <div>
      {/* Filtros e busca */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {tabs.map(tab => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isActive ? tab.activeColor + '55' : 'var(--border)'}`,
                  background: isActive ? tab.activeColor + '18' : 'transparent',
                  color: isActive ? tab.activeColor : 'var(--text-secondary)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tab.label}
                <span style={{
                  background: isActive ? tab.activeColor + '30' : 'rgba(255,255,255,0.06)',
                  color: isActive ? tab.activeColor : 'var(--text-muted)',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="busca-wrapper" style={{ maxWidth: '240px' }}>
          <span className="busca-icon">🔍</span>
          <input
            type="text"
            className="busca-input"
            placeholder="Buscar produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Conteúdo */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            {filter === 'all' && !search ? 'Nenhum backlog!' : 'Nenhum resultado'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {filter === 'all' && !search
              ? 'Todos os produtos estão com estoque adequado.'
              : 'Tente ajustar os filtros ou a busca.'}
          </p>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Prioridade</th>
                <th>Reposição Sugerida</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const priority = getPriority(p.stock);
                const suggested = Math.max(20 - p.stock, 5);
                return (
                  <tr key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {p.name}
                      </div>
                      {p.description && (
                        <div style={{
                          fontSize: '0.76rem',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                          maxWidth: '220px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${BADGE_MAP[p.category] || 'badge-default'}`}>
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: priority.color,
                      }}>
                        {p.stock}
                        <span style={{ fontSize: '0.75rem', fontWeight: 400, marginLeft: '4px', color: 'var(--text-muted)' }}>un.</span>
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: priority.bg,
                        color: priority.color,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: `1px solid ${priority.border}`,
                      }}>
                        {priority.label}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--accent-emerald)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}>
                        +{suggested} un.
                      </span>
                    </td>
                    <td>
                      <Link href="/products" style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        color: 'var(--accent-cyan)',
                        border: '1px solid var(--border-accent)',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}>
                        Repor Estoque
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
