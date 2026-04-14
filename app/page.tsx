import Link from 'next/link';
import { serverGetProducts } from '@/backend/products';

export const metadata = {
  title: 'StockManager — Início',
  description: 'Sistema de gerenciamento de inventário moderno e eficiente.',
};

export default async function HomePage() {
  const products = await serverGetProducts();
  const totalProdutos = products.length;
  const totalEstoque = products.reduce((s, p) => s + p.stock, 0);
  const valorTotal = products.reduce((s, p) => s + p.price * p.stock, 0);
  const backlogCount = products.filter(p => p.stock <= 15).length;

  const features = [
    {
      icon: '⚡',
      title: 'Tempo Real',
      desc: 'Dados sincronizados instantaneamente via Server Actions do Next.js.',
    },
    {
      icon: '🔍',
      title: 'Busca Avançada',
      desc: 'Filtre por nome, categoria e status de estoque com precisão.',
    },
    {
      icon: '📊',
      title: 'Backlog Inteligente',
      desc: 'Alertas automáticos de reposição com priorização por criticidade.',
    },
    {
      icon: '🛡️',
      title: 'Validação Robusta',
      desc: 'Regras de negócio aplicadas no servidor para máxima confiabilidade.',
    },
  ];

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
          <Link href="/" className="navbar-link active">Início</Link>
          <Link href="/products" className="navbar-link">Produtos</Link>
          <Link href="/backlog" className="navbar-link">Backlog</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '100px 40px 120px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '15%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          {/* Badge */}
          <div className="animate-fade-up" style={{ marginBottom: '24px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px',
              background: 'var(--accent-cyan-dim)',
              border: '1px solid var(--border-accent)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-cyan)',
            }}>
              <span style={{
                width: 6, height: 6,
                background: 'var(--accent-cyan)',
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: '0 0 6px var(--accent-cyan)',
              }} />
              Controle de Inventário · Next.js 16
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            Gestão de estoque{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              precisa e eficiente
            </span>
          </h1>

          <p className="animate-fade-up delay-200" style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Cadastre, edite e monitore seu inventário em tempo real. Alertas inteligentes
            de reposição para nunca perder uma venda.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300" style={{
            display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <Link href="/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
              color: '#080c14',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,212,255,0.35)',
              transition: 'all 0.2s',
            }}>
              Gerenciar Produtos →
            </Link>
            <Link href="/backlog" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: '1px solid var(--border)',
              transition: 'all 0.2s',
            }}>
              Ver Backlog
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        maxWidth: '1300px', margin: '0 auto',
        padding: '0 40px 80px',
      }}>
        {/* Divider glow */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)',
          marginBottom: '48px',
          opacity: 0.5,
        }} />

        <div className="animate-fade-up" style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
          }}>
            Visão Geral do Inventário
          </span>
        </div>
        <h2 className="animate-fade-up delay-100" style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '32px',
        }}>
          Métricas em tempo real
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {[
            { label: 'Produtos Cadastrados', val: totalProdutos, cls: '', icon: '📦' },
            { label: 'Unidades em Estoque', val: totalEstoque, cls: 'azul', icon: '🗂️' },
            {
              label: 'Valor do Inventário',
              val: `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              cls: 'ouro', icon: '💰',
            },
            { label: 'Em Backlog', val: backlogCount, cls: 'erro', icon: '⚠️' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`stat-card ${s.cls} animate-fade-up`}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{s.icon}</div>
              <div className="stat-number">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="animate-fade-up" style={{ marginBottom: '12px' }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--accent-cyan)',
              }}>
                Funcionalidades
              </span>
            </div>
            <h2 className="animate-fade-up delay-100" style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              Tudo que você precisa para gerenciar seu estoque
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className="animate-fade-up"
                style={{
                  animationDelay: `${0.1 + i * 0.08}s`,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 24px',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{
                  width: 48, height: 48,
                  background: 'var(--accent-cyan-dim)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem',
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="animate-fade-up" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}>
            Pronto para organizar seu estoque?
          </h2>
          <p className="animate-fade-up delay-100" style={{
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            fontSize: '1rem',
          }}>
            Acesse o gerenciador e comece agora mesmo.
          </p>
          <Link href="/products" className="animate-fade-up delay-200" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '15px 40px',
            background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
            color: '#080c14',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,212,255,0.35)',
          }}>
            Ir para Produtos →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '28px 40px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        letterSpacing: '0.03em',
      }}>
        StockManager · Next.js 16 SSR + Tailwind CSS v4 · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
