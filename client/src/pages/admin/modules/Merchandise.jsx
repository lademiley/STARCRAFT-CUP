import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initProducts = [
  { id: 1, name: 'SC2027 Official Jersey', category: 'Apparel', price: 15000, stock: 84, sold: 216, status: 'In Stock', icon: '👕' },
  { id: 2, name: 'Tournament Programme (Official)', category: 'Print', price: 2000, stock: 310, sold: 490, status: 'In Stock', icon: '📖' },
  { id: 3, name: 'SC2027 Scarf (Gold/Red)', category: 'Accessories', price: 5000, stock: 142, sold: 158, status: 'In Stock', icon: '🧣' },
  { id: 4, name: 'Championship Cap', category: 'Accessories', price: 3500, stock: 0, sold: 200, status: 'Out of Stock', icon: '🧢' },
  { id: 5, name: 'Signed Tournament Ball', category: 'Collectibles', price: 25000, stock: 8, sold: 12, status: 'Low Stock', icon: '⚽' },
  { id: 6, name: 'SC2027 Hoodie', category: 'Apparel', price: 12000, stock: 56, sold: 44, status: 'In Stock', icon: '👚' },
  { id: 7, name: 'Player Trading Cards (Set)', category: 'Collectibles', price: 8000, stock: 72, sold: 128, status: 'In Stock', icon: '🃏' },
  { id: 8, name: 'Tournament Mug', category: 'Household', price: 4500, stock: 0, sold: 95, status: 'Out of Stock', icon: '☕' },
]

const blank = { name: '', category: 'Apparel', price: 0, stock: 0, sold: 0, status: 'In Stock', icon: '👕' }
const catColor = { Apparel: '#3B82F6', Accessories: '#D4AF37', Collectibles: '#F59E0B', Print: '#22C55E', Household: '#8B5CF6' }
const statusColor = { 'In Stock': '#22C55E', 'Low Stock': '#F59E0B', 'Out of Stock': '#EF4444' }

export default function Merchandise() {
  const [products, setProducts] = useState(initProducts)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')

  const filtered = products.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalRevenue = products.reduce((s, p) => s + p.sold * p.price, 0)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = p => { setForm({ ...p }); setEditing(p.id); setModal(true) }
  const handleSave = () => {
    const item = { ...form, price: Number(form.price), stock: Number(form.stock), sold: Number(form.sold) }
    if (editing) setProducts(prev => prev.map(p => p.id === editing ? { ...item, id: editing } : p))
    else setProducts(prev => [...prev, { ...item, id: Date.now() }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Remove product?')) setProducts(prev => prev.filter(p => p.id !== id)) }

  const categories = ['All', ...new Set(products.map(p => p.category))]

  return (
    <div>
      <ModuleHeader title="Merchandise" subtitle="Manage tournament merchandise and inventory" action="Add Product" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={products.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Products" value={products.length} icon="👕" color="#D4AF37" />
        <StatCard label="Total Revenue" value={`₦${(totalRevenue/1000000).toFixed(1)}M`} icon="💰" color="#22C55E" />
        <StatCard label="Out of Stock" value={products.filter(p => p.status === 'Out of Stock').length} icon="⚠️" color="#EF4444" change="Needs restock" />
        <StatCard label="Units Sold" value={products.reduce((s, p) => s + p.sold, 0).toLocaleString()} icon="📦" color="#3B82F6" />
      </div>

      <SectionCard title="🛒 Product Catalog" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={c.select}>
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </ActionRow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ ...c.card, borderTop: `3px solid ${statusColor[p.status]}` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{p.icon}</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: 4 }}>{p.name}</div>
              <Badge label={p.category} color={catColor[p.category] || '#D4AF37'} />
              <div style={{ margin: '10px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '6px 10px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#D4AF37' }}>₦{p.price.toLocaleString()}</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Price</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '6px 10px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: p.stock === 0 ? '#EF4444' : p.stock < 20 ? '#F59E0B' : '#22C55E' }}>{p.stock}</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>In Stock</div>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{p.sold} units sold</div>
              <Badge label={p.status} color={statusColor[p.status]} />
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button onClick={() => openEdit(p)} style={{ ...c.btn, ...c.btnGhost, flex: 1, fontSize: '0.72rem' }}>✏️ Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ ...c.btn, ...c.btnDanger, padding: '8px 12px', fontSize: '0.72rem' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {modal && (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => { setModal(false); setEditing(null) }}>
          <FormField label="Product Name"><input style={c.input} value={form.name} onChange={set('name')} /></FormField>
          <FormField label="Icon Emoji"><input style={c.input} value={form.icon} onChange={set('icon')} /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Category">
              <select style={{ ...c.select, width: '100%' }} value={form.category} onChange={set('category')}>
                {Object.keys(catColor).map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
                <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FormField label="Price (₦)"><input style={c.input} type="number" value={form.price} onChange={set('price')} /></FormField>
            <FormField label="Stock"><input style={c.input} type="number" value={form.stock} onChange={set('stock')} /></FormField>
            <FormField label="Sold"><input style={c.input} type="number" value={form.sold} onChange={set('sold')} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Product</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
