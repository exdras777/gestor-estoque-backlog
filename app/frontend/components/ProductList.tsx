'use client';
import { Product, CreateProductInput } from '@/types/product';
import { useState, useMemo } from 'react';

const BADGE_MAP: Record<string, string> = {
  electronics: 'badge-eletronicos',
  clothing:    'badge-roupas',
  food:        'badge-alimentos',
  books:       'badge-livros',
  other:       'badge-outro',
};
const LABEL_MAP: Record<string, string> = {
  electronics: 'Eletrônicos',
  clothing:    'Roupas',
  food:        'Alimentos',
  books:       'Livros',
  other:       'Outro',
};

function EstoqueIndicador({ stock }: { stock: number }) {
  if (stock === 0) return (
    <span style={{
      background: 'rgba(244,63,94,0.15)',
      color: '#fda4af',
      border: '1px solid rgba(244,63,94,0.3)',
      padding: '3px 10px',
      borderRadius: '20px',
      fontWeight: 700,
      fontSize: '0.78rem',
      fontFamily: "'JetBrains Mono', monospace",
    }}>Esgotado</span>
  );
  if (stock <= 5) return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      color: '#f87171',
      fontSize: '0.95rem',
    }}>{stock}<span style={{ fontSize: '0.72rem', fontWeight: 400, marginLeft: 3 }}>un.</span></span>
  );
  if (stock <= 15) return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      color: '#fbbf24',
      fontSize: '0.95rem',
    }}>{stock}<span style={{ fontSize: '0.72rem', fontWeight: 400, marginLeft: 3 }}>un.</span></span>
  );
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      color: '#34d399',
      fontSize: '0.95rem',
    }}>{stock}<span style={{ fontSize: '0.72rem', fontWeight: 400, marginLeft: 3 }}>un.</span></span>
  );
}

function EditModal({ product, onClose, onSaved }: { product: Product; onClose: () => void; onSaved: (updated: Product) => void }) {
  const [form, setForm] = useState<CreateProductInput>({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, ...form }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar produto');
      const updated = await res.json();
      onSaved(updated);
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        {/* Header modal */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}>
              Editar Produto
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              ID: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{product.id}</span>
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            width: 34, height: 34,
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>×</button>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {erro && <div className="alerta alerta-erro"><span>⚠</span> {erro}</div>}
          <div>
            <label className="label">Nome *</label>
            <input name="name" className="input-field" value={form.name} onChange={handleChange} placeholder="Nome do produto" />
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea name="description" className="input-field" value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="label">Preço (R$) *</label>
              <input name="price" type="number" min="0" step="0.01" className="input-field" value={form.price} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Estoque *</label>
              <input name="stock" type="number" min="0" className="input-field" value={form.stock} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="label">Categoria *</label>
            <select name="category" className="input-field" value={form.category} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="electronics">💻 Eletrônicos</option>
              <option value="clothing">👕 Roupas</option>
              <option value="food">🌿 Alimentos</option>
              <option value="books">📚 Livros</option>
              <option value="other">📦 Outro</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '0 28px 24px', display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading} className="btn-primario" style={{ flex: 2 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(8,12,20,0.3)',
                  borderTopColor: '#080c14',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Salvando...
              </span>
            ) : '✓ Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [produtos, setProdutos] = useState<Product[]>(initialProducts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('');
  const [editando, setEditando] = useState<Product | null>(null);

  const filtrados = useMemo(() => {
    return produtos.filter(p => {
      const matchBusca = busca === '' ||
        p.name.toLowerCase().includes(busca.toLowerCase()) ||
        p.description.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = categoriaSel === '' || p.category === categoriaSel;
      return matchBusca && matchCategoria;
    });
  }, [produtos, busca, categoriaSel]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) return;
    setLoadingId(id);
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Erro ao excluir');
      setProdutos(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao excluir produto');
    } finally {
      setLoadingId(null);
    }
  };

  const handleSaved = (updated: Product) => {
    setProdutos(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <>
      {editando && (
        <EditModal
          product={editando}
          onClose={() => setEditando(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="card" style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              marginBottom: '2px',
            }}>
              Inventário
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {filtrados.length} produto{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}>
          <div className="busca-wrapper">
            <span className="busca-icon">🔍</span>
            <input
              type="text"
              className="busca-input"
              placeholder="Buscar produto..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <select className="filtro-select" value={categoriaSel} onChange={e => setCategoriaSel(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="electronics">💻 Eletrônicos</option>
            <option value="clothing">👕 Roupas</option>
            <option value="food">🌿 Alimentos</option>
            <option value="books">📚 Livros</option>
            <option value="other">📦 Outro</option>
          </select>
          {(busca || categoriaSel) && (
            <button
              onClick={() => { setBusca(''); setCategoriaSel(''); }}
              style={{
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              ✕ Limpar
            </button>
          )}
        </div>

        {/* Tabela ou empty state */}
        {filtrados.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">{produtos.length === 0 ? '📦' : '🔍'}</span>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              {produtos.length === 0 ? 'Nenhum produto ainda' : 'Nenhum resultado encontrado'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {produtos.length === 0
                ? 'Use o formulário ao lado para cadastrar seu primeiro produto.'
                : 'Tente alterar os filtros de busca ou limpar a pesquisa.'}
            </p>
          </div>
        ) : (
          <div className="tabela-wrapper">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Cadastrado em</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((produto, i) => (
                  <tr key={produto.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <td data-label="Produto">
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', fontSize: '0.9rem' }}>
                          {produto.name}
                        </p>
                        {produto.description && (
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {produto.description.length > 60 ? produto.description.slice(0, 60) + '...' : produto.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td data-label="Categoria">
                      <span className={`badge ${BADGE_MAP[produto.category] || 'badge-default'}`}>
                        {LABEL_MAP[produto.category] || produto.category}
                      </span>
                    </td>
                    <td data-label="Preço">
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                      }}>
                        R$ {produto.price.toFixed(2)}
                      </span>
                    </td>
                    <td data-label="Estoque">
                      <EstoqueIndicador stock={produto.stock} />
                    </td>
                    <td data-label="Cadastrado em">
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(produto.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td data-label="Ações" style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          className="btn-editar"
                          onClick={() => setEditando(produto)}
                          disabled={loadingId === produto.id}
                        >
                          ✏ Editar
                        </button>
                        <button
                          className="btn-perigo"
                          onClick={() => handleDelete(produto.id)}
                          disabled={loadingId === produto.id}
                        >
                          {loadingId === produto.id ? '...' : '✕ Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
