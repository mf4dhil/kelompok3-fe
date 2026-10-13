
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import api from "../services/api";

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);
        const data = response.data;

        // Debug: periksa respons dari backend di Console browser
        console.log("Data produk:", data);
        console.log("Varian produk:", data.productvariants);

        setProduct(data);

        // Ambil varian berdasarkan alias relasi dari backend
        const productVariants =
          data.productvariants ??
          data.ProductVariants ??
          data.product_variants ??
          data.variants ??
          [];

        console.log("Daftar varian yang digunakan:", productVariants);

        setVariants(productVariants);

        const firstActiveVariant = productVariants.find(
          (variant) =>
            variant.is_active === true ||
            variant.is_active === 1 ||
            variant.is_active === "1"
        ) ?? productVariants.find(
          (variant) => variant.is_active == null
        );

        setSelectedVariantId(
          firstActiveVariant ? String(firstActiveVariant.id) : ""
        );

        if (!firstActiveVariant) {
          setError("Produk ini belum memiliki varian aktif.");
        }
      } catch (err) {
        console.error("Error mengambil produk:", err);

        setError(
          err.response?.data?.message ||
            "Gagal memuat detail produk."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const activeVariants = variants.filter(
    (variant) =>
      variant.is_active === true ||
      variant.is_active === 1 ||
      variant.is_active === "1" ||
      variant.is_active == null
  );

  const selectedVariant = activeVariants.find(
    (variant) => String(variant.id) === selectedVariantId
  );

  const getRelationName = (variant, keys) => {
    for (const key of keys) {
      const relation = variant?.[key];

      if (relation?.name) return relation.name;

      if (relation?.value != null) {
        return `${relation.value}${
          relation.unit ? ` ${relation.unit}` : ""
        }`;
      }
    }

    return "-";
  };

  const handleOrder = () => {
    setError("");

    if (!product) {
      setError("Data produk belum tersedia.");
      return;
    }

    if (!selectedVariant) {
      setError("Silakan pilih varian kue terlebih dahulu.");
      return;
    }

    navigate("/orders", {
      state: {
        productId: product.id,
        productName: product.name,
        variantId: selectedVariant.id,
        variant: {
          shape: getRelationName(selectedVariant, [
            "shape",
            "Shape",
          ]),
          size: getRelationName(selectedVariant, [
            "size",
            "Size",
          ]),
          flavor: getRelationName(selectedVariant, [
            "flavor",
            "Flavor",
            "Flavors",
          ]),
          price: Number(selectedVariant.price),
        },
      },
    });
  };

  const imageUrl = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://localhost:3000/${product.image.replace(/^\/+/, "")}`
    : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-16">
        <p className="text-center text-primary/70">
          Memuat detail produk...
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-red-600">
            {error || "Produk tidak ditemukan."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-lg bg-tertiary/20 px-5 py-3 font-semibold text-tertiary transition hover:bg-tertiary hover:text-white"
          >
            Kembali
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen border-b border-secondary/30 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-primary/70 transition hover:text-tertiary"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="grid gap-8 overflow-hidden rounded-xl border border-secondary/30 bg-secondary/10 p-5 sm:p-8 md:grid-cols-2">
          <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-xl bg-secondary/20">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full max-h-96 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <ShoppingBag size={64} className="text-tertiary" />
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-wider text-tertiary">
              CakeOrder
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary">
              {product.name}
            </h1>

            <p className="mt-4 leading-7 text-primary/70">
              {product.description ||
                "Kue spesial yang dibuat sesuai pesanan."}
            </p>

            <div className="mt-6">
              <label
                htmlFor="variant"
                className="mb-2 block font-semibold text-primary"
              >
                Pilih varian kue
              </label>

              <select
                id="variant"
                value={selectedVariantId}
                onChange={(event) => {
                  setSelectedVariantId(event.target.value);
                  setError("");
                }}
                className="w-full rounded-lg border border-secondary/50 bg-white p-3 text-primary outline-none transition focus:border-tertiary focus:ring-2 focus:ring-tertiary/20"
              >
                <option value="">
                  -- Pilih bentuk, ukuran, dan rasa --
                </option>

                {activeVariants.map((variant) => (
                  <option
                    key={variant.id}
                    value={String(variant.id)}
                  >
                    {getRelationName(variant, [
                      "shape",
                      "Shape",
                    ])}
                    {" / "}
                    {getRelationName(variant, [
                      "size",
                      "Size",
                    ])}
                    {" / "}
                    {getRelationName(variant, [
                      "flavor",
                      "Flavor",
                      "Flavors",
                    ])}
                    {" — "}
                    {formatPrice(variant.price)}
                  </option>
                ))}
              </select>

              {activeVariants.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Belum ada varian aktif untuk produk ini.
                </p>
              )}
            </div>

            {selectedVariant && (
              <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
                <p className="text-sm text-primary/70">
                  Harga varian
                </p>

                <p className="mt-1 text-2xl font-bold text-tertiary">
                  {formatPrice(selectedVariant.price)}
                </p>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="mt-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-tertiary/20 px-5 py-3 font-semibold text-tertiary transition hover:bg-tertiary hover:text-white"
            >
              <ShoppingBag size={20} />
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
