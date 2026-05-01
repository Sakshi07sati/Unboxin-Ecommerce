import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../global_redux/features/auth/authThunks";
import toast from "react-hot-toast";
import {
  Edit2,
  Save,
  X,
  User,
  Mail,
  Calendar,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2,
  Package,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, userId, status } = useSelector((state) => state.auth);
    console.log(user,userId)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const currentUserId = userId || localStorage.getItem("userId");

    if (currentUserId) {
      dispatch(fetchUserProfile(currentUserId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    console.log("hello",formData)
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  FIXED FUNCTION (Date Of Birth Issue Solved)
  const handleSave = async () => {
    const currentUserId = userId || localStorage.getItem("userId");

    if (!currentUserId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    try {
      //  FIX — FORMAT DATE PROPERLY BEFORE SENDING TO BACKEND
      const formattedDOB = formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
        : "";

      await dispatch(
        updateUserProfile({
          userId: currentUserId,
          ...formData,
          dateOfBirth: formattedDOB, //  FIXED HERE
        })
      ).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      dispatch(fetchUserProfile(currentUserId));
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (user) {
  
      setFormData({
        username: user.username || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (status === "loading" && (!user || Object.keys(user).length === 0)) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700 text-lg font-medium">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (status !== "loading" && (!user || Object.keys(user).length === 0)) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Profile</h3>
            <p className="text-gray-600 mb-6">
              We couldn't retrieve your profile data. Please try again.
            </p>
            <button
              onClick={() => {
                const currentUserId = userId || localStorage.getItem("userId");
                if (currentUserId) {
                  dispatch(fetchUserProfile(currentUserId));
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
            <div className="relative bg-[#ff3f6c] px-6 sm:px-8 py-8 sm:py-12 text-white">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                      <User className="w-12 h-12 sm:w-14 sm:h-14 text-black" />
                    </div>
                   
                  </div>

                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                      {formData.username || "User"}
                    </h1>
                    <p className="text-black font-semibold text-sm sm:text-base mb-3">
                      {formData.email || "No email"}
                    </p>
                    {user?.createdAt && (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/20 backdrop-blur-sm rounded-full text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {!isEditing ? (
                  <div className="flex gap-3">
                    <Link
                      to="/my-orders"
                      className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap border border-indigo-100"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="bg-black/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-black/30 transition-all border border-black/30 flex items-center gap-2 whitespace-nowrap"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-8 sm:py-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Profile Information
                </h2>
                {!isEditing && (
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    View your personal details
                  </span>
                )}
              </div>

              <div className="grid gap-6">
                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter username"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium text-lg">
                          {formData.username || (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                      {isEditing && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          Email cannot be changed
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium text-lg">
                          {formData.dateOfBirth ? (
                            formatDate(formData.dateOfBirth)
                          ) : (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium text-lg">
                          {formData.phone || (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                          placeholder="Enter your address"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium text-lg">
                          {formData.address || (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <button
                    onClick={handleSave}
                    disabled={status === "loading"}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      status === "loading"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;