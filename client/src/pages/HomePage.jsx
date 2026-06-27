// client/src/pages/HomePage.jsx
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import useGeolocation from "../hooks/useGeolocation";
import API from "../services/api";
import Layout from "../components/Layout";
import MapView from "../components/MapView";
import PackPreviewModal from "../components/PackPreviewModal";
import {
  Map,
  List,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function HomePage() {
  const { user } = useAuth();
  const socket = useSocket();
  const { coords, error: geoError, retry } = useGeolocation();
  const [view, setView] = useState("list");
  const [vendorCanteens, setVendorCanteens] = useState([]);
  const [vendorPacks, setVendorPacks] = useState([]);
  const [customerPacks, setCustomerPacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [expandedCanteens, setExpandedCanteens] = useState({});

  const isVendor = user?.role === "vendor";

  // Fetch vendor data
  const fetchVendorData = async () => {
    try {
      const [canteensRes, packsRes] = await Promise.all([
        API.get("/canteens/mine"),
        API.get("/packs/mine"),
      ]);
      setVendorCanteens(canteensRes.data);
      setVendorPacks(packsRes.data);
    } catch (err) {
      console.error("Error fetching vendor data", err);
      toast.error("Failed to load canteens");
    }
  };

  // Fetch customer data
  const fetchCustomerPacks = async () => {
    if (!coords) return;
    try {
      const { data } = await API.get(
        `/packs/nearby?lat=${coords.lat}&lng=${coords.lng}`,
      );
      setCustomerPacks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      if (isVendor) fetchVendorData();
      else fetchCustomerPacks();
    }
  }, [user, coords]);

  // Real‑time updates
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      if (isVendor) fetchVendorData();
      else fetchCustomerPacks();
    };
    socket.on("pack:new", handleUpdate);
    socket.on("pack:updated", handleUpdate);
    socket.on("pack:expired", handleUpdate);
    return () => {
      socket.off("pack:new", handleUpdate);
      socket.off("pack:updated", handleUpdate);
      socket.off("pack:expired", handleUpdate);
    };
  }, [socket, isVendor]);

  // Claim handler for customer
  const handleClaim = async (packId) => {
    if (!coords) return toast.error("Location not available");
    try {
      await API.post(`/packs/${packId}/claim`, {
        lat: coords.lat,
        lng: coords.lng,
      });
      toast.success("Pack claimed! Check My Claim for QR.");
      setSelectedPack(null);
      fetchCustomerPacks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Claim failed");
    }
  };

  // Memoized grouping: for vendor packs, group by canteen ID (string)
  const vendorGrouped = useMemo(() => {
    const grouped = {};
    vendorPacks.forEach((pack) => {
      // pack.canteen could be ObjectId string or an object
      const canteenId =
        typeof pack.canteen === "object" ? pack.canteen._id : pack.canteen;
      if (!canteenId) return;
      const id = canteenId.toString();
      if (!grouped[id]) {
        grouped[id] = {
          canteenId: id,
          packs: [],
        };
      }
      grouped[id].packs.push(pack);
    });
    return Object.values(grouped);
  }, [vendorPacks]);

  // Grouping for customer packs (canteen is populated)
  const customerGrouped = useMemo(() => {
    const grouped = {};
    customerPacks.forEach((pack) => {
      const canteen = pack.canteen;
      if (!canteen?._id) return;
      const id = canteen._id.toString();
      if (!grouped[id]) {
        grouped[id] = {
          canteen: canteen, // full canteen object
          packs: [],
        };
      }
      grouped[id].packs.push(pack);
    });
    return Object.values(grouped);
  }, [customerPacks]);

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {isVendor ? "My Canteens" : "Nearby Leftovers"}
          </h1>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {!isVendor && (
              <>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition ${
                    view === "list"
                      ? "bg-green-600 text-white"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`p-2 rounded-lg transition ${
                    view === "map"
                      ? "bg-green-600 text-white"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Map size={20} />
                </button>
              </>
            )}
            {isVendor && (
              <Link
                to="/create-canteen"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus size={18} /> New Canteen
              </Link>
            )}
          </div>
        </div>

        {geoError && !isVendor && (
          <div className="glass-card p-4 mb-4 text-red-400">
            Location error: {geoError}. Enable location or override in DevTools.
          </div>
        )}

        {/* ---- VENDOR VIEW ---- */}
        {isVendor && (
          <div className="space-y-6">
            {vendorCanteens.length === 0 && (
              <div className="glass-card p-8 text-center text-gray-400">
                No canteens yet. Create your first canteen to start posting
                leftovers.
              </div>
            )}
            {vendorCanteens.map((canteen) => {
              const canteenIdStr = canteen._id.toString();
              const isExpanded = expandedCanteens[canteenIdStr] ?? true;
              const group = vendorGrouped.find(
                (g) => g.canteenId === canteenIdStr,
              );
              const packsForCanteen = group ? group.packs : [];

              return (
                <div key={canteen._id} className="glass-card p-6">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedCanteens((prev) => ({
                        ...prev,
                        [canteenIdStr]: !isExpanded,
                      }))
                    }
                  >
                    <div>
                      <h3 className="text-xl font-semibold">{canteen.name}</h3>
                      <p className="text-gray-400 text-sm">{canteen.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">
                        {packsForCanteen.length} packs
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      {packsForCanteen.length === 0 && (
                        <p className="text-gray-500 text-sm">
                          No packs posted yet.
                        </p>
                      )}
                      {packsForCanteen.map((pack) => (
                        <div
                          key={pack._id}
                          className="flex items-center justify-between bg-white/5 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-4">
                            {pack.image && (
                              <img
                                src={pack.image}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{pack.description}</p>
                              <p className="text-sm text-gray-400">
                                ₹{pack.discountedPrice} (was ₹
                                {pack.originalPrice}) · Qty: {pack.quantity}
                              </p>
                              <span
                                className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                                  pack.status === "available"
                                    ? "bg-green-500/20 text-green-300"
                                    : pack.status === "claimed"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : pack.status === "expired"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-blue-500/20 text-blue-300"
                                }`}
                              >
                                {pack.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-pack/${pack._id}`}
                              className="text-gray-400 hover:text-white"
                              title="Edit pack"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              className="text-red-400 hover:text-red-300"
                              onClick={async () => {
                                if (!confirm("Delete this pack?")) return;
                                try {
                                  await API.delete(`/packs/${pack._id}`);
                                  toast.success("Pack deleted");
                                  fetchVendorData();
                                } catch (err) {
                                  toast.error(
                                    err.response?.data?.message ||
                                      "Failed to delete pack",
                                  );
                                }
                              }}
                              title="Delete pack"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <Link
                        to={`/create-pack?canteenId=${canteen._id}`}
                        className="flex items-center gap-2 text-green-400 hover:underline text-sm mt-2"
                      >
                        <Plus size={16} /> Add New Pack
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ---- CUSTOMER VIEW ---- */}
        {!isVendor && (
          <>
            {!coords ? (
              <div className="glass-card p-8 text-center max-w-md mx-auto mt-10">
                <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Location Required
                </h3>
                <p className="text-gray-300 mb-4">
                  We need your location to show nearby canteens and leftovers.
                </p>
                {geoError && (
                  <p className="text-sm text-red-400 mb-4">
                    Error: {geoError}. Please allow location access in your
                    browser settings and click below.
                  </p>
                )}
                <button
                  onClick={() => retry()}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Enable Location
                </button>
              </div>
            ) : (
              <>
                {view === "map" && (
                  <div className="mb-8">
                    <MapView packs={customerPacks} coords={coords} />
                  </div>
                )}
                {view === "list" && (
                  <div className="space-y-6">
                    {customerGrouped.length === 0 && (
                      <div className="glass-card p-8 text-center text-gray-400">
                        No leftovers nearby right now. Check back soon!
                      </div>
                    )}
                    {customerGrouped.map((group) => (
                      <div key={group.canteen._id} className="glass-card p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold">
                            {group.canteen.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {group.canteen.address}
                          </p>
                          <p className="text-sm text-gray-300">
                            {group.packs.length} pack(s) available
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.packs.map((pack) => (
                            <div
                              key={pack._id}
                              className="bg-white/5 rounded-lg p-4 flex flex-col"
                            >
                              {pack.image && (
                                <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                                  <img
                                    src={pack.image}
                                    alt={pack.description}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <h4 className="font-semibold text-lg">
                                {pack.description}
                              </h4>
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="line-through text-gray-500 text-sm">
                                  ₹{pack.originalPrice}
                                </span>
                                <span className="text-green-400 font-bold">
                                  ₹{pack.discountedPrice}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                Qty: {pack.quantity}
                              </p>
                              <Link
                                to={`/checkout/${pack._id}`}
                                className="mt-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition mt-3"
                              >
                                Claim
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Preview Modal (customer) */}
        {selectedPack && (
          <PackPreviewModal
            pack={selectedPack}
            onClose={() => setSelectedPack(null)}
            onClaim={handleClaim}
          />
        )}
      </div>
    </Layout>
  );
}
