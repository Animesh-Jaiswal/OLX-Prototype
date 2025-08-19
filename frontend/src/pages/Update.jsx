import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Update() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState({});

  // fetch existing ad
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SITE_APP}/api/ads/${id}`).then((res) => {
      setForm({ ...res.data, images: [] }); // images will be added only if new ones selected
      setPreview(res.data.images); // existing images
    });
  }, [id]);

  if (!form) return <p className="text-center mt-10">Loading...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + preview.length > 20) {
      setErrors({ ...errors, images: "Max 20 photos" });
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreview([...preview, ...urls]);
    setForm({ ...form, images: [...form.images, ...files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "images") fd.append(key, value);
    });
    form.images.forEach((file) => fd.append("images", file));

    await axios.put(`${import.meta.env.VITE_SITE_APP}/api/ads/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    navigate(`/ads/${id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white border border-gray-300 rounded p-4"
    >
      <h2 className="text-lg font-bold mb-4">Update Ad</h2>
      {/* reuse same inputs as Create.jsx */}
      <div className="mb-3">
        <label className="block mb-1">Ad Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full"
        />
      </div>

      {/* description, price, etc. (reuse from Create) */}

      {/* Photos */}
      <div className="mb-3">
        <label className="block mb-1">Add More Photos</label>
        <input type="file" multiple accept="image/*" onChange={handleImages} />
        <div className="grid grid-cols-5 gap-2 mt-2">
          {preview.map((url, i) => (
            <img key={i} src={url} alt="preview" className="h-20 w-full object-cover border" />
          ))}
        </div>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
    </form>
  );
}
