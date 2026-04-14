import { serverGetProducts } from '@/backend/products';
import ProductForm from '@/frontend/components/ProductForm';
import ProductList from '@/frontend/components/ProductList';
import Link from 'next/link';

export const metadata = {
  title: 'Produtos · StockManager',
  description: 'Gerencie seu inventário de produtos',
};

export default async function ProductsPage() {
  const products = await serverGetProducts();
  const totalProdutos = products.length;
  const totalEstoque = products.reduce((s, p) => s + p.stock, 0);
  const valorTotal = products.reduce((s, p) => s + p.price * p.stock, 0);
  const semEstoque = products.filter(p => p.stock === 0).length;

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
          <Link href="/products" className="navbar-link active">Produtos</Link>
          <Link href="/backlog" className="navbar-link">Backlog</Link>
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
        {/* Glow background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative' }}>
          <div className="animate-fade-up" style={{ marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent-cyan)',
            }}>
              Gerenciamento de Inventário
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
            Seus Produtos
          </h1>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
          }}>
            {[
              { label: 'Total de Produtos', val: totalProdutos, cls: '', icon: '📦' },
              { label: 'Unidades em Estoque', val: totalEstoque, cls: 'azul', icon: '🗂️' },
              {
                label: 'Valor do Inventário',
                val: `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                cls: 'ouro', icon: '💰',
              },
              { label: 'Sem Estoque', val: semEstoque, cls: 'erro', icon: '⚠️' },
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '28px',
          alignItems: 'start',
        }}>
          <div className="animate-fade-up delay-200">
            <ProductForm />
          </div>
          <div className="animate-fade-up delay-300">
            <ProductList initialProducts={products} />
          </div>
        </div>
      </main>
    </div>
  );
}
