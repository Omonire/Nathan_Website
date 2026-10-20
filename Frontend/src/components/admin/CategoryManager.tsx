import { useState } from 'react'
import { getCategories, addCategory, updateCategory, deleteCategory, type Category } from '../../lib/cms'

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(getCategories)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)

  const emptyCategory: Omit<Category, 'id'> = {
    name: '',
    description: '',
    active: true,
    order: categories.length + 1,
  }

  const [formData, setFormData] = useState<Omit<Category, 'id'>>(emptyCategory)

  function handleSave() {
    if (editing) {
      updateCategory(editing.id, formData)
    } else {
      addCategory(formData)
    }
    setCategories(getCategories())
    setShowForm(false)
    setEditing(null)
    setFormData(emptyCategory)
  }

  function handleEdit(category: Category) {
    setEditing(category)
    setFormData({ ...category })
    setShowForm(true)
  }

  function handleDelete(id: string) {
    if (confirm('Delete this category? Services in this category will not be deleted.')) {
      deleteCategory(id)
      setCategories(getCategories())
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wider text-ashtray">Categories</h2>
        <button
          onClick={() => { setEditing(null); setFormData(emptyCategory); setShowForm(true) }}
          className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gold/30 bg-coal p-6 animate-fade-in">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-gold">
            {editing ? 'Edit Category' : 'Add New Category'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-ashtray">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="size-4 rounded border-smoke accent-gold"
                />
                <span className="font-mono text-xs text-ashtray">Active</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={!formData.name}
              className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80 disabled:opacity-50"
            >
              {editing ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="rounded-lg border border-smoke px-4 py-2 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-gold hover:text-gold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categories.sort((a, b) => a.order - b.order).map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-xl border border-smoke bg-coal p-4 transition hover:border-gold/30"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gold/10 font-mono text-xs text-gold">
                {category.order}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-bone">{category.name}</span>
                  {!category.active && <span className="text-xs text-red-400">(inactive)</span>}
                </div>
                <p className="mt-0.5 font-mono text-xs text-ashtray">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-ashtray transition hover:border-gold hover:text-gold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-red-400 transition hover:border-red-500 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
