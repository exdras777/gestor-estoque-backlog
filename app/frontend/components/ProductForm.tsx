'use client';
import { useState, ChangeEvent } from 'react';
import { CreateProductInput } from '@/types/product';

const CATEGORIAS = [
  { value: 'electronics', label: 'Eletrônicos', emoji: '💻' },
  { value: 'clothing', label: 'Roupas', emoji: '👕' },
  { value: 'food', label: 'Alimentos', emoji: '🌿' },
  { value: 'books', label: 'Livros', emoji: '📚' },
  { value: 'other', label: 'Outro', emoji: '📦' },
];

const EMPTY: CreateProductInput = { name: '', description: '', price: 0, stock: 0, category: '' };

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: CreateProductInput & { id?: string };
  modo?: 'criar' | 'editar';
  onCancel?: () => void;
}

export default function ProductForm({ onSuccess, initialData, modo = 'criar', onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [form, setForm] = useState<CreateProductInput>(initialData || EMPTY);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(false);
    try {
      const isEdit = modo === 'editar' && initialData?.id;
      const response = await fetch('/api/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: initialData!.id, ...form } : form),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha na operação');
      }
      if (!isEdit) {
        setSucesso(true);
        setForm(EMPTY);
        setTimeout(() => setSucesso(false), 3500);
      }
      onSuccess?.();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '28px', position: 'sticky', top: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: 38, height: 38,
            background: modo === 'editar'
              ? 'rgba(245,158,11,0.15)'
              : 'var(--accent-cyan-dim)',
            border: `1px solid ${modo === 'editar' ? 'rgba(245,158,11,0.3)' : 'var(--border-accent)'}`,
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>
            {modo === 'editar' ? '✏️' : '＋'}
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              {modo === 'editar' ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {modo === 'editar' ? 'Atualize os campos desejados' : 'Preencha os dados do produto'}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', marginBottom: '20px' }} />

      {/* Alertas */}
      {erro && (
        <div className="alerta alerta-erro animate-fade-up">
          <span>⚠</span> {erro}
        </div>
      )}
      {sucesso && (
        <div className="alerta alerta-sucesso animate-fade-up">
          <span>✓</span> Produto registrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="label" htmlFor="name">Nome do Produto *</label>
          <input
            id="name" name="name" type="text" required
            className="input-field"
            value={form.name} onChange={handleChange}
            placeholder="Ex: Notebook Dell XPS 15"
          />
        </div>

        <div>
          <label className="label" htmlFor="description">Descrição</label>
          <textarea
            id="description" name="description"
            className="input-field"
            style={{ resize: 'vertical', minHeight: '76px' }}
            value={form.description} onChange={handleChange}
            placeholder="Descrição opcional do produto..."
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="label" htmlFor="price">Preço (R$) *</label>
            <input
              id="price" name="price" type="number" required
              min="0" step="0.01"
              className="input-field"
              value={form.price || ''} onChange={handleChange}
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="label" htmlFor="stock">Estoque *</label>
            <input
              id="stock" name="stock" type="number" required
              min="0"
              className="input-field"
              value={form.stock || ''} onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="category">Categoria *</label>
          <select
            id="category" name="category" required
            className="input-field"
            value={form.category} onChange={handleChange}
          >
            <option value="">Selecione uma categoria</option>
            {CATEGORIAS.map(c => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          {modo === 'editar' && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                padding: '11px',
                borderRadius: 'var(--radius-md)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primario"
            style={{ flex: 1 }}
          >
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
                {modo === 'editar' ? 'Salvando...' : 'Registrando...'}
              </span>
            ) : (
              <>{modo === 'editar' ? '✓ Salvar alterações' : '+ Registrar produto'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
