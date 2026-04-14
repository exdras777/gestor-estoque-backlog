import { serverGetProducts } from '@/backend/products';
import BacklogList from '@/frontend/components/BacklogList';
import Link from 'next/link';

export const metadata = {
  title: 'Backlog · StockManager',
  description: 'Produtos que precisam de reposição de estoque',
};

export default async function BacklogPage() {
  const products = await serverGetProducts();
  const backlogProducts = products.filter(p => p.stock <= 15);
  const critical = backlogProducts.filter(p => p.stock === 0).length;
  const urgent = backlogProducts.filter(p => p.stock >= 1 && p.stock <= 5).length;
  const warning = backlogProducts.filter(p => p.stock >= 6 && p.stock <= 15).length;
  const pctBacklog = products.length > 0
    ? Math.round((backlogProducts.length / products.length) * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          <span style={{
            width: 32, height: 32,
            background: 'var(--grad-accent)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem',
            boxShadow: 'var(--shadow-glow)',
            flexShrink: 0,
          }}>⬡</span>
          Stock<span style={{ color: 'var(--accent-cyan)' }}>Manager</span>
        </Link>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Link href="/" className="navbar-link">Início</Link>
          <Link href="/products" className="navbar-link">Produtos</Link>
          <Link href="/backlog" className="navbar-link active">Backlog</Link>
        </div>
      </nav>

      {/* Page Header */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 40px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 80% 50%, rgba(244,63,94,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative' }}>
          <div className="animate-fade-up" style={{ marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent-rose)',
            }}>
              Reposição de Estoque
            </span>
          </div>
          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: '32px',
          }}>
            Backlog de Estoque
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
          }}>
            {[
              { label: 'Total em Backlog', val: backlogProducts.length, cls: '', icon: '📋' },
              { label: 'Crítico (sem estoque)', val: critical, cls: 'erro', icon: '🔴' },
              { label: 'Urgente (1–5 un.)', val: urgent, cls: 'ouro', icon: '🟡' },
              { label: 'Atenção (6–15 un.)', val: warning, cls: 'azul', icon: '🔵' },
              { label: '% do Inventário', val: `${pctBacklog}%`, cls: '', icon: '📊' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`stat-card ${s.cls} animate-fade-up`}
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{s.icon}</div>
                <div className="stat-number">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '40px',
        transform: 'translateY(-20px)',
      }}>
        {backlogProducts.length === 0 ? (
          <div className="empty-state animate-fade-up">
            <span className="empty-icon">🎉</span>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}>
              Estoque em dia!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Todos os produtos estão com estoque acima de 15 unidades.
            </p>
            <Link href="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
              color: '#080c14',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}>
              ← Voltar para Produtos
            </Link>
          </div>
        ) : (
          <div className="card animate-fade-up delay-200" style={{ padding: '32px' }}>
            <div style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                  letterSpacing: '-0.01em',
                }}>
                  Produtos que precisam de reposição
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Produtos com 15 unidades ou menos em estoque
                </p>
              </div>
              <Link href="/products" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-cyan-dim)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--border-accent)',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                ✏️ Gerenciar Produtos
              </Link>
            </div>
            <BacklogList products={backlogProducts} />
          </div>
        )}
      </main>
    </div>
  );
}
