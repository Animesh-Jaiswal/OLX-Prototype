import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Show() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SITE_APP}/api/ads/${id}`).then((res) => setAd(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    await axios.delete(`${import.meta.env.VITE_SITE_APP}/api/ads/${id}`);
    navigate("/");
  };

  if (!ad) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="md:col-span-2">
        {/* Image gallery */}
        <div className="grid grid-cols-2 gap-2">
          {ad.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="ad"
              className="w-full h-64 object-cover rounded-lg border"
            />
          ))}
        </div>

        {/* Details Section */}
        <div className="mt-6 bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
            <p><strong>Type:</strong> {ad.type}</p>
            <p><strong>BHK:</strong> {ad.bhk}</p>
            <p><strong>Bathrooms:</strong> {ad.bathrooms}</p>
            <p><strong>Furnishing:</strong> {ad.furnishing || "N/A"}</p>
            <p><strong>Project Status:</strong> {ad.projectStatus || "N/A"}</p>
            <p><strong>Listed By:</strong> {ad.listedBy}</p>
            <p><strong>Super Built-up Area:</strong> {ad.superBuiltupSqft} sqft</p>
            {ad.carpetSqft ? <p><strong>Carpet Area:</strong> {ad.carpetSqft} sqft</p> : null}
            {ad.totalFloors ? <p><strong>Total Floors:</strong> {ad.totalFloors}</p> : null}
            {ad.floorNo ? <p><strong>Floor No:</strong> {ad.floorNo}</p> : null}
            <p><strong>Car Parking:</strong> {ad.carParking || "0"}</p>
            {ad.facing ? <p><strong>Facing:</strong> {ad.facing}</p> : null}
            {ad.projectName ? <p><strong>Project Name:</strong> {ad.projectName}</p> : null}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          <p className="text-gray-700">{ad.description}</p>
        </div>

        {/* Update & Delete Buttons */}
        <div className="flex gap-4 mt-6">
          <Link
            to={`/ads/${id}/edit`}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Update
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        {/* Price Box */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-2">₹ {ad.price}</h2>
          <p className="text-gray-700 mb-2">{ad.title}</p>
          <p className="text-sm text-gray-500">{ad.state}</p>
        </div>

        {/* Seller Info */}
        <div className="bg-white border rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">Posted by</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white">
              {ad.name ? ad.name[0] : "U"}
            </div>
            <div>
              <p className="font-medium">{ad.name}</p>
              <p className="text-sm text-gray-500">Member since 2024</p>
            </div>
          </div>
          <a
            href={`tel:${ad.phone}`}
            className="block w-full mt-4 text-center bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Call Seller
          </a>
        </div>

        {/* Location (Optional Google Maps Embed) */}
        <div className="bg-white border rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <p className="text-gray-700 mb-3">{ad.state}</p>
          <iframe
            title="map"
            width="100%"
            height="200"
            loading="lazy"
            allowFullScreen
            className="rounded-lg"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              ad.state
            )}&output=embed`}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
