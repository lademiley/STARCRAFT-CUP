import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initItems = []

const catColors = { Clothing: '#3B82F6', Sports: '#22C55E', Lifestyle: '#EC4899', Print: '#F59E0B' }
const statusColors = { 'In Stock': '#22C55E', 'Low Stock': '#F59E0B', 'Out of Stock': '#EF4444' }
const blank = { name: '', category: 'Clothing', price: 0, stock: 0, sold: 0, status: 'In Stock' }

export default function Merchandise() {
  const [items, setItems]   = useState(initItems)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [modal, setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(blank)

  const filtered = items.filter(i =>
    (catFilter === 'All' || i.category === catFilter) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = items.reduce((s, i) => s + i.price * i.sold, 0)
  const lowStock     = items.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = i => { setEditing(i.id); setForm({ ...i }); setModal('edit') }
  const save     = () => {
    const processed = { ...form, price: Number(form.price), stock: Number(form.stock), sold: Number(form.sold) }
    if (modal === 'add') setItems(p => [...p, { ...processed, id: Date.now() }])
    else setItems(p => p.map(i => i.id === editing ? { ...processed, id: editing } : i))
    setModal(null)
  }
  const del = id => { if (confirm('Remove item?')) setItems(p => p.filter(i => i.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Merchandise" subtitle="Tournament merchandise inventory and sales" action="Add Product" onAction={openAdd} count={items.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Products"  value={items.length}                                icon="👕" color="#D4AF37" />
        <StatCard label="Sales Revenue"   value={`₦${(totalRevenue/1000000).toFixed(1)}M`}   icon="💰" color="#22C55E" />
        <StatCard label="Units Sold"      value={items.reduce((s, i) => s + i.sold, 0)}       icon="📦" color="#3B82F6" />
        <StatCard label="Low / Out Stock" value={lowStock}                                     icon="⚠️" color="#EF4444" change={lowStock > 0 ? 'Restock needed' : 'All stocked'} />
      </div>

      <SectionCard title="📦 Product Inventory" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={c.select}>
            <option value="All">All Categories</option>
            {['Clothing','Sports','Lifestyle','Print'].map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Product', 'Category', 'Price', 'Stock', 'Sold', 'Revenue', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(item, i) => (
            <tr key={item.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{item.name}</td>
              <td style={c.td}><Badge label={item.category} color={catColors[item.category] || '#D4AF37'} /></td>
              <td style={{ ...c.td, color: '#D4AF37', fontWeight: 700 }}>₦{item.price.toLocaleString()}</td>
              <td style={{ ...c.td, fontWeight: 700, color: item.stock < 20 ? '#EF4444' : '#fff' }}>{item.stock}</td>
              <td style={c.td}>{item.sold}</td>
              <td style={{ ...c.td, color: '#22C55E', fontWeight: 600 }}>₦{(item.price * item.sold).toLocaleString()}</td>
              <td style={c.td}><Badge label={item.status} color={statusColors[item.status] || '#D4AF37'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(item)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => del(item.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <FormField label="Product Name"><input style={c.input} value={form.name} onChange={f('name')} placeholder="e.g. StarCraft Cup Jersey" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Category">
              <select style={{ ...c.select, width: '100%' }} value={form.category} onChange={f('category')}>
                {['Clothing','Sports','Lifestyle','Print'].map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={f('status')}>
                <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
              </select>
            </FormField>
            <FormField label="Price (₦)"><input style={c.input} type="number" value={form.price} onChange={f('price')} /></FormField>
            <FormField label="Stock Qty"><input style={c.input} type="number" value={form.stock} onChange={f('stock')} /></FormField>
            <FormField label="Units Sold"><input style={c.input} type="number" value={form.sold} onChange={f('sold')} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Product</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
