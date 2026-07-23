import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { useProfile } from "../hooks";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { updateProfileInput } from "@mahe-npm/common";
import { Link } from "react-router";


export function DashboardProfile() {
  const { loading, user, refetch } = useProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    bio: "",
    avatarUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        handle: user.handle || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      name: formData.name.trim() || undefined,
      handle: formData.handle.trim().toLowerCase() || undefined,
      bio: formData.bio.trim() || undefined,
      avatarUrl: formData.avatarUrl.trim() || undefined,
    };

    const { success, error: parseError } = updateProfileInput.safeParse(payload);
    if (!success) {
      toast.error(parseError.errors[0].message);
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile`,
        payload,
        {
          headers: {
            Authorization: token
          }
        }
      );
      toast.success("Profile updated successfully", {
        position: "bottom-right",
        theme: "colored",
        transition: Bounce,
      });
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Appbar val={true} />
        <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-gray-100 rounded-md mb-8"></div>
            <div className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200">
              <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
              <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
              <div className="h-32 bg-gray-100 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Appbar val={true} />
      
      <div className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-sans tracking-tight">Your Profile</h1>
            <p className="text-gray-500 text-lg mt-2 font-serif">Customize how you appear to other readers and writers.</p>
          </div>
          {user?.handle && (
            <Link 
              to={`/authors/${user.handle}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-900 h-10 px-4 py-2 text-sm"
              target="_blank"
            >
              ↗ View Public Profile
            </Link>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:border-blue-500/30 transition-colors">
          <div className="p-8 space-y-8 max-w-3xl mx-auto">
            
            {/* Avatar section top aligned */}
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center border-b border-gray-200 pb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden z-10 shadow-sm shrink-0 text-3xl">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <span className="text-gray-400">👤</span>
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                <label className="flex items-center text-sm font-semibold text-gray-900">
                  <span className="mr-2 text-gray-500">🖼</span> Avatar URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-900">
                  <span className="mr-2 text-gray-500">👤</span> Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-900">
                  <span className="mr-2 text-gray-500">@</span> Public Handle <span className="text-gray-500 font-normal ml-2">(Optional)</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-colors">
                  <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 border-r border-gray-200 text-sm font-medium">
                    /authors/
                  </span>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    placeholder="janedoe"
                    className="flex-1 min-w-0 block w-full px-4 py-3 bg-white border-none focus:ring-0 outline-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-900">
                <span className="mr-2 text-gray-500">≡</span> Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell the world about yourself, your expertise, and what you write about..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-colors resize-y text-gray-900 placeholder:text-gray-500 font-serif"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DashboardProfile;
