import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarManger from "./NavbarManger";

const UserStats = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [stats, setStats] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const statsRes = await axios.get(`http://localhost:5000/api/stats/user/${userId}`);
        setStats(statsRes.data.orders);
        const userRes = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUser(userRes.data);
      } catch (error) {
        console.error("❌ Error fetching user stats:", error);
      }
    };

    fetchStats();
  }, [userId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarManger />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Statistiques de <span className="text-indigo-600">{user?.name || "Utilisateur inconnu"}</span>
        </h2>

        {stats.length === 0 ? (
          <p className="text-center text-gray-500">Aucune statistique disponible pour cet utilisateur.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((order, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Commande #{index + 1}</h3>
                <p><span className="font-medium text-gray-600">Client:</span> {order.clientName || "Non spécifié"}</p>
                <p><span className="font-medium text-gray-600">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium text-gray-600">Statut:</span> 
                  <span className={`ml-1 font-semibold ${order.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>
                    {order.status}
                  </span>
                </p>
                <p><span className="font-medium text-gray-600">Produits:</span></p>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                  {order.products?.map((product, i) => (
                    <li key={i}>
                      {product.nom} — Quantité: {product.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats;
