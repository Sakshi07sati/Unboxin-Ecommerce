import React, { useState } from "react";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { user, role, permissions } = useSelector((state) => state.auth);
  const [showDetails, setShowDetails] = useState(false);

  if (role !== "admin") {
    return <div className="p-8 text-red-600">Access Denied: Admins only</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowDetails((prev) => !prev)}
      >
        {showDetails ? "Hide" : "Show"} Admin Details
      </button>
      {showDetails && (
        <div className="mt-6 border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Admin Details</h2>
          <div><strong>Name:</strong> {user?.name || "N/A"}</div>
          <div><strong>Email:</strong> {user?.email || "N/A"}</div>
          <div><strong>Role:</strong> {role}</div>
          <div className="mt-2">
            <strong>Permissions:</strong>
            <pre className="bg-white p-2 rounded text-xs mt-1 border overflow-x-auto">
              {JSON.stringify(permissions, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
