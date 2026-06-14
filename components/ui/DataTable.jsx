'use client';

import { useState, useMemo } from 'react';
import EmptyState from './EmptyState';

export default function DataTable({
  columns,
  data = [],
  searchable = [],
  searchPlaceholder = 'بحث...',
  sortable = true,
  pagination = { pageSize: 10 },
  actions,
  selectable = false,
  onSelectionChange,
  emptyIcon = 'inbox',
  emptyTitle = 'لا توجد بيانات',
  emptyDescription = 'لم يتم العثور على أي سجلات',
  loading = false,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    let result = [...data];
    if (search && searchable.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchable.some((key) => String(row[key] || '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey] || '';
        const bVal = b[sortKey] || '';
        const cmp = String(aVal).localeCompare(String(bVal), 'ar');
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, searchable, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / (pagination?.pageSize || 10));
  const paged = filtered.slice(
    page * (pagination?.pageSize || 10),
    (page + 1) * (pagination?.pageSize || 10)
  );

  const handleSort = (key) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
      onSelectionChange?.([]);
    } else {
      const ids = paged.map((r) => r.id);
      setSelected(new Set(ids));
      onSelectionChange?.(ids);
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  };

  if (loading) {
    return (
      <div className="card-admin p-8">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((_, j) => (
                <div key={j} className="skeleton h-4 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-admin overflow-hidden">
      {/* Search */}
      {searchable.length > 0 && (
        <div className="px-5 py-3 border-b border-[var(--color-border-subtle)]">
          <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={searchPlaceholder}
              className="admin-input pr-10"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {selectable && (
                <th className="w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === paged.length && paged.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`${sortable && col.sortable !== false ? 'cursor-pointer hover:text-[var(--color-text-primary)]' : ''}`}
                  style={{ width: col.width }}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="material-symbols-outlined text-[14px]">
                        {sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="w-20">إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={row.id || i} className={selected.has(row.id) ? 'bg-[var(--color-primary-light)]' : ''}>
                  {selectable && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="rounded cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td>
                      <div className="flex items-center gap-1">
                        {actions.map((action, j) => (
                          <button
                            key={j}
                            onClick={() => action.onClick(row)}
                            className={`p-1.5 rounded-[var(--radius-md)] transition-colors cursor-pointer ${action.danger ? 'hover:bg-[var(--color-danger-light)] text-[var(--color-danger)]' : 'hover:bg-[var(--color-surface-dim)] text-[var(--color-text-secondary)]'}`}
                            title={action.label}
                          >
                            <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border-subtle)]">
          <span className="text-xs text-[var(--color-text-secondary)]">
            عرض {page * (pagination?.pageSize || 10) + 1}-
            {Math.min((page + 1) * (pagination?.pageSize || 10), filtered.length)} من {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded hover:bg-[var(--color-surface-dim)] disabled:opacity-30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = page < 3 ? i : page - 2 + i;
              if (pageNum < 0 || pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded text-sm font-medium cursor-pointer ${page === pageNum ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-surface-dim)]'}`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded hover:bg-[var(--color-surface-dim)] disabled:opacity-30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
