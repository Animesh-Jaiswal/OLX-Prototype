import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "",
    bhk: "",
    bathrooms: "",
    furnishing: "",
    projectStatus: "",
    listedBy: "",
    superBuiltupSqft: "",
    carpetSqft: "",
    maintenance: "",
    totalFloors: "",
    floorNo: "",
    carParking: "",
    facing: "",
    projectName: "",
    title: "",
    description: "",
    price: "",
    state: "",
    name: "",
    phone: "",
    images: []
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + preview.length > 20) {
      setErrors({ ...errors, images: "You can upload up to 20 photos" });
      return;
    }

    // preview
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreview([...preview, ...urls]);

    // store actual files
    setForm({ ...form, images: [...form.images, ...files] });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.type) newErrors.type = "Type is required";
    if (!form.bhk) newErrors.bhk = "BHK is required";
    if (!form.bathrooms) newErrors.bathrooms = "Bathrooms required";
    if (!form.superBuiltupSqft) newErrors.superBuiltupSqft = "Super built-up area required";
    if (!form.title) newErrors.title = "Ad title required";
    if (!form.description) newErrors.description = "Description required";
    if (!form.price) newErrors.price = "Enter a valid price";
    if (!form.state) newErrors.state = "Select a state";
    if (form.images.length === 0) newErrors.images = "At least 1 photo required";
    if (!form.name) newErrors.name = "Name required";
    if (!form.phone) newErrors.phone = "Phone required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fd = new FormData();

      // append text fields
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "images") {
          fd.append(key, value);
        }
      });

      // append file objects
      form.images.forEach((file) => {
        fd.append("images", file);
      });

      await axios.post(`${import.meta.env.VITE_SITE_APP}/api/ads`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error posting ad");
    }
  };

  const OptionGroup = ({ label, name, options }) => (
    <div className="py-4 border-t border-gray-300">
      <p className="mb-2">{label} *</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setForm({ ...form, [name]: opt })}
            className={`border border-gray-300 px-3 py-2 rounded transition ${
              form[name] === opt
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 hover:cursor-pointer"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {errors[name] && <p className="text-red-600 text-sm">{errors[name]}</p>}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white border border-gray-300 rounded"
    >
      {/* Include Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">INCLUDE SOME DETAILS</h3>

        <OptionGroup
          label="Type"
          name="type"
          options={["Flats / Apartments", "Independent / Builder Floors", "Farm House", "House & Villa"]}
        />

        <OptionGroup label="BHK" name="bhk" options={["1", "2", "3", "4", "4+"]} />

        <OptionGroup label="Bathrooms" name="bathrooms" options={["1", "2", "3", "4", "4+"]} />

        <OptionGroup label="Furnishing" name="furnishing" options={["Furnished", "Semi-Furnished", "Unfurnished"]} />

        <OptionGroup label="Project Status" name="projectStatus" options={["New Launch", "Ready to Move", "Under Construction"]} />

        <OptionGroup label="Listed By" name="listedBy" options={["Builder", "Dealer", "Owner"]} />

        {/* Inputs */}
        <div className="py-4 border-t border-gray-300 space-y-4">
          <div>
            <label className="block mb-1">Super Builtup area sqft *</label>
            <input
              type="number"
              name="superBuiltupSqft"
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
            {errors.superBuiltupSqft && <p className="text-red-600 text-sm">{errors.superBuiltupSqft}</p>}
          </div>

          <div>
            <label className="block mb-1">Carpet Area sqft</label>
            <input
              type="number"
              name="carpetSqft"
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Maintenance (Monthly)</label>
            <input
              type="number"
              name="maintenance"
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Total Floors</label>
            <input
              type="number"
              name="totalFloors"
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Floor No</label>
            <input
              type="number"
              name="floorNo"
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
        </div>

        <OptionGroup label="Car Parking" name="carParking" options={["0", "1", "2", "3+"]} />

        {/* Facing dropdown */}
        <div className="py-4 border-t border-gray-300">
          <label className="block mb-1">Facing</label>
          <select
            name="facing"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="">Select Facing</option>
            <option>East</option>
            <option>West</option>
            <option>North</option>
            <option>South</option>
          </select>
        </div>

        <div className="py-4 border-t border-gray-300">
          <label className="block mb-1">Project Name</label>
          <input
            type="text"
            name="projectName"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Title & Description */}
      <div className="p-4 border-t border-gray-300 space-y-4">
        <div>
          <label className="block mb-1">Ad title *</label>
          <input
            type="text"
            name="title"
            maxLength="70"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
        </div>

        <div>
          <label className="block mb-1">Description *</label>
          <textarea
            name="description"
            maxLength="4096"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
        </div>
      </div>

      {/* Price */}
      <div className="p-4 border-t border-gray-300">
        <h3 className="font-semibold mb-2">SET A PRICE</h3>
        <label className="block mb-1">Price *</label>
        <input
          type="number"
          name="price"
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full"
        />
        {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
      </div>

      {/* Photos */}
      <div className="p-4 border-t border-gray-300">
        <h3 className="font-semibold mb-2">UPLOAD UP TO 20 PHOTOS</h3>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hover:cursor-pointer"
          onChange={handleImages}
        />
        {errors.images && <p className="text-red-600 text-sm">{errors.images}</p>}
        <div className="grid grid-cols-5 gap-2 mt-3">
          {preview.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="preview"
              className="h-20 w-full object-cover rounded border border-gray-300"
            />
          ))}
          {Array.from({ length: Math.max(0, 20 - preview.length) }).map((_, i) => (
            <div
              key={i}
              className="h-20 w-full border border-gray-300 rounded flex items-center justify-center text-gray-400"
            >
              +
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="p-4 border-t border-gray-300">
        <h3 className="font-semibold mb-2">CONFIRM YOUR LOCATION</h3>
        <label className="block mb-1">State *</label>
        <select
          name="state"
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="">Select State</option>
          <option>Telangana</option>
          <option>Maharashtra</option>
          <option>Karnataka</option>
          <option>Delhi</option>
        </select>
        {errors.state && <p className="text-red-600 text-sm">{errors.state}</p>}
      </div>

      {/* Review Details */}
      <div className="p-4 border-t border-gray-300 space-y-4">
        <h3 className="font-semibold mb-2">REVIEW YOUR DETAILS</h3>
        <div>
          <label className="block mb-1">Name *</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label className="block mb-1">Phone *</label>
          <input
            type="text"
            name="phone"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
        </div>
      </div>

      {/* Submit */}
      <div className="p-4 border-t border-gray-300">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:cursor-pointer hover:bg-blue-700"
        >
          Post now
        </button>
      </div>
    </form>
  );
}
