import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SITE_APP}/api/ads`).then(res => setAds(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl text-gray-700 font-bold mb-4 text-center">Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {ads.length === 0 ? (
          <div className="col-span-full flex justify-center items-center mt-8">
            <div className="bg-red-900 text-white px-6 py-4 rounded w-64 h-32 flex items-center justify-center">
              <h2 className="text-lg font-semibold">No Ads Yet</h2>
            </div>
          </div>
        ) : (
          ads.map(ad => (
            <Link key={ad._id} to={`/ads/${ad._id}`} className="border rounded p-2 hover:shadow">
              <img src={ad.images?.[0]} alt={ad.title} className="w-full h-40 object-cover" />
              <h3 className="text-lg font-semibold">₹ {ad.price}</h3>
              <p>{ad.title}</p>
              <small className="text-gray-500">{ad.location}</small>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
