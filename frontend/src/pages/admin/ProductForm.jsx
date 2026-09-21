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

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <Link
          to="/admin/products"
          className="text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          ← Back
        </Link>
      </div>

      {error && (
        <div className="mt-5">
          <ErrorMessage message={error} />
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Fields */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="iPhone 16 Pro"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              placeholder="Short product description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price (EGP)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rating (0–5)
              </label>
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Image
          </label>

          <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No image
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-600"
          />

          <p className="mt-4 text-xs text-gray-500">Or paste an image URL</p>

          <input
            name="image"
            value={file ? "" : form.image}
            onChange={handleChange}
            disabled={Boolean(file)}
            placeholder="https://..."
            className={`${inputClass} mt-2 disabled:bg-gray-100`}
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white hover:bg-teal-600 disabled:bg-gray-300"
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
