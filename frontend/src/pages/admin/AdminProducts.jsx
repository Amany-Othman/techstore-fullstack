import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { CATEGORIES, LOW_STOCK_THRESHOLD } from "../../utils/constants";

const LIMIT = 10;

const formatEGP = (amount) => `${Number(amount ?? 0).toLocaleString()} EGP`;

const ICON_PATHS = {
  plus: "M12 4.5v15m7.5-7.5h-15",
  search:
    "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  close: "M6 18L18 6M6 6l12 12",
  check: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  chevronLeft: "M15.75 19.5L8.25 12l7.5-7.5",
  chevronRight: "M8.25 4.5l7.5 7.5-7.5 7.5",
  products:
    "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  warning:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg
      className={`h-5 w-5 ${filled ? "text-amber-400" : "text-gray-300"}`}
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
    </svg>
  );
}

function StockBadge({ stock }) {
  let style = "bg-emerald-50 text-emerald-700 ring-emerald-200";
  let text = stock;

  if (stock === 0) {
    style = "bg-rose-50 text-rose-700 ring-rose-200";
    text = "Out of stock";
  } else if (stock < LOW_STOCK_THRESHOLD) {
    style = "bg-amber-50 text-amber-700 ring-amber-200";
    text = `${stock} left`;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {text}
    </span>
  );
}

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce the search box so we don't fire a request per keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/products/admin", {
        params: {
          search: debouncedSearch || undefined,
          category: category || undefined,
          page,
          limit: LIMIT,
        },
      });

      setProducts(response.data.products);
      setPages(response.data.pages);
      setTotal(response.data.total);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Close the delete dialog with Escape
  useEffect(() => {
    if (!deleteTarget) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !deleting) setDeleteTarget(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteTarget, deleting]);

  const handleToggleFeatured = async (product) => {
    setNotice("");
    setError("");

    try {
      const response = await api.patch(`/api/products/${product._id}/feature`);

      setProducts((prev) =>
        prev.map((item) => (item._id === product._id ? response.data : item)),
      );

      setNotice(
        response.data.isFeatured
          ? `"${product.name}" is now featured on the Home page.`
          : `"${product.name}" removed from Featured.`,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update featured");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await api.delete(`/api/products/${deleteTarget._id}`);

      setProducts((prev) =>
        prev.filter((item) => item._id !== deleteTarget._id),
      );

      setTotal((prev) => prev - 1);
      setNotice(`"${deleteTarget.name}" was deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product");
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = Boolean(debouncedSearch || category);
  const rangeStart = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const rangeEnd = Math.min(page * LIMIT, total);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {total} {total === 1 ? "product" : "products"} in your store
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className={`inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 ${focusRing}`}
        >
          <Icon name="plus" className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">
            <Icon name="search" className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            aria-label="Search products by name"
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
          className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200"
        >
          <span className="mt-0.5 text-emerald-600">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <p className="flex-1">{notice}</p>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className={`rounded p-0.5 text-emerald-700 hover:bg-emerald-100 ${focusRing}`}
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-left text-xs font-medium text-gray-500">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3 text-center">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14">
                    <div className="flex flex-col items-center text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                        <Icon name="products" className="h-6 w-6" />
                      </span>
                      <p className="mt-3 font-medium text-gray-900">
                        {hasFilters
                          ? "No products match your filters"
                          : "No products yet"}
                      </p>
                      <p className="mt-1 text-gray-500">
                        {hasFilters
                          ? "Try a different name or category."
                          : "Add your first product to start selling."}
                      </p>
                      {!hasFilters && (
                        <Link
                          to="/admin/products/new"
                          className={`mt-4 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${focusRing}`}
                        >
                          Add product
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {products.map((product) => (
                <tr
                  key={product._id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-xl bg-gray-100 object-cover ring-1 ring-gray-200/70"
                      />
                      <span
                        className="max-w-[220px] truncate font-medium text-gray-900"
                        title={product.name}
                      >
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-gray-600">
                    {product.category}
                  </td>

                  <td className="px-5 py-3 font-medium tabular-nums text-gray-900">
                    {formatEGP(product.price)}
                  </td>

                  <td className="px-5 py-3">
                    <StockBadge stock={product.stock} />
                  </td>

                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleToggleFeatured(product)}
                      title={
                        product.isFeatured ? "Unfeature" : "Feature on Home"
                      }
                      aria-label={
                        product.isFeatured
                          ? `Remove ${product.name} from Featured`
                          : `Feature ${product.name} on Home`
                      }
                      aria-pressed={Boolean(product.isFeatured)}
                      className={`rounded-lg p-1.5 transition hover:bg-amber-50 ${focusRing}`}
                    >
                      <StarIcon filled={product.isFeatured} />
                    </button>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className={`rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 ${focusRing}`}
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(product)}
                        className={`rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 ${focusRing}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {rangeStart}–{rangeEnd} of {total}
          </p>

          {pages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={`inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
              >
                <Icon name="chevronLeft" className="h-4 w-4" />
                Prev
              </button>

              <span className="px-2 text-sm text-gray-600">
                Page {page} of {pages}
              </span>

              <button
                onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                disabled={page === pages}
                className={`inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
              >
                Next
                <Icon name="chevronRight" className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-6 backdrop-blur-[2px]"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <Icon name="warning" className="h-6 w-6" />
              </span>

              <div>
                <h3
                  id="delete-dialog-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Delete this product?
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  "{deleteTarget.name}" will be permanently removed. This can't
                  be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className={`rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 ${focusRing}`}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:bg-gray-300 ${focusRing}`}
              >
                {deleting ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
