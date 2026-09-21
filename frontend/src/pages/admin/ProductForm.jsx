import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { CATEGORIES } from "../../utils/constants";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  rating: "",
  image: "",
};

const ICON_PATHS = {
  back: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18",
  check: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  photo:
    "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  upload:
    "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
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

function Field({ id, label, required, hint, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-rose-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pre-fill when editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        const product = response.data;

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "",
          stock: product.stock ?? "",
          rating: product.rating ?? "",
          image: product.image || "",
        });

        setPreview(product.image || "");
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "image") {
      setPreview(value);
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.price || !form.category || !form.description) {
      setError("Name, description, price and category are required");
      return;
    }

    if (!isEdit && !file && !form.image) {
      setError("Upload an image or paste an image URL");
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("stock", form.stock || 0);
      data.append("rating", form.rating || 0);

      if (file) {
        data.append("image", file);
      } else if (form.image) {
        data.append("image", form.image);
      }

      if (isEdit) {
        await api.put(`/api/products/${id}`, data);
      } else {
        await api.post("/api/products", data);
      }

      setSuccess(isEdit ? "Product updated" : "Product created");

      setTimeout(() => navigate("/admin/products"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-gray-500 transition hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <Icon name="back" className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-3">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {isEdit ? "Edit product" : "Add product"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update the details shoppers see on the product page."
            : "Fill in the details shoppers will see on the product page."}
        </p>
      </div>

      {error && (
        <div className="mt-5">
          <ErrorMessage message={error} />
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-5 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200"
        >
          <span className="text-emerald-600">
            <Icon name="check" className="h-5 w-5" />
          </span>
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Fields */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <h3 className="text-base font-semibold text-gray-900">
              Product details
            </h3>

            <div className="mt-5 space-y-5">
              <Field id="name" label="Name" required>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="iPhone 16 Pro"
                />
              </Field>

              <Field id="description" label="Description" required>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className={inputClass}
                  placeholder="Short product description"
                />
              </Field>

              <Field id="category" label="Category" required>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <h3 className="text-base font-semibold text-gray-900">
              Price and inventory
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field id="price" label="Price (EGP)" required>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field id="stock" label="Stock">
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field id="rating" label="Rating (0–5)">
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>
        </div>

        {/* Image + actions */}
        <section className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 lg:sticky lg:top-6">
          <h3 className="text-base font-semibold text-gray-900">Image</h3>

          <div className="mt-4 aspect-square w-full overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200/70">
            {preview ? (
              <img
                src={preview}
                alt="Product preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                <Icon name="photo" className="h-10 w-10" />
                <span className="text-sm">No image yet</span>
              </div>
            )}
          </div>

          <label
            htmlFor="image-file"
            className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-teal-400 hover:bg-teal-50/50 focus-within:ring-2 focus-within:ring-teal-500"
          >
            <Icon name="upload" className="h-4 w-4" />
            <span className="truncate">
              {file ? file.name : "Upload an image"}
            </span>
            <input
              id="image-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          <div className="mt-5">
            <Field
              id="image"
              label="Or use an image URL"
              hint={file ? "Remove the uploaded file to use a URL." : undefined}
            >
              <input
                id="image"
                name="image"
                value={file ? "" : form.image}
                onChange={handleChange}
                disabled={Boolean(file)}
                placeholder="https://..."
                className={`${inputClass} disabled:bg-gray-100`}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:bg-gray-300"
          >
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>

          <Link
            to="/admin/products"
            className="mt-3 block rounded-xl py-2.5 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Cancel
          </Link>
        </section>
      </form>
    </div>
  );
}

export default ProductForm;
