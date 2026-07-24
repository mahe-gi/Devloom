import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { useProfile } from "../hooks";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { updateProfileInput } from "@mahe-npm/common";
import { Link } from "react-router";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Avatar } from "../components/ui/Avatar";

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
      <div className="min-h-screen bg-background flex flex-col text-foreground">
        <Appbar val={true} />
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-12 flex-1 w-full">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-surface rounded-md mb-8"></div>
            <div className="space-y-6 bg-surface p-8 rounded-2xl border border-border">
              <div className="h-12 bg-background rounded-xl w-full"></div>
              <div className="h-12 bg-background rounded-xl w-full"></div>
              <div className="h-32 bg-background rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <Appbar val={true} />
      
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-12 flex-1 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold font-sans tracking-tight">Your Profile</h1>
            <p className="text-foreground-secondary text-lg mt-2 font-serif">Customize how you appear to other readers and writers.</p>
          </div>
          {user?.handle && (
            <Link to={`/authors/${user.handle}`} target="_blank">
              <Button variant="outline">
                ↗ View Public Profile
              </Button>
            </Link>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto w-full">
          
          {/* Section: Avatar */}
          <div className="pt-6">
            <h2 className="text-xl font-bold mb-6 font-sans border-b border-border pb-4 text-foreground">Avatar</h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              <Avatar src={formData.avatarUrl} fallback={formData.name ? formData.name.charAt(0) : "👤"} size="lg" className="w-24 h-24 text-4xl border-4 border-background shadow-sm" />
              <div className="flex-1 space-y-2 w-full">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <span className="mr-2 text-foreground-secondary">🖼</span> Avatar URL
                </label>
                <Input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full text-base py-3 px-4 rounded-xl focus:ring-2 focus:ring-ring focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Public Profile */}
          <div className="pt-6">
            <h2 className="text-xl font-bold mb-6 font-sans border-b border-border pb-4 text-foreground">Public Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <span className="mr-2 text-foreground-secondary">👤</span> Display Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full text-base py-3 px-4 rounded-xl focus:ring-2 focus:ring-ring focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <span className="mr-2 text-foreground-secondary">@</span> Public Handle <span className="text-foreground-secondary font-normal ml-2">(Optional)</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-border focus-within:ring-2 focus-within:ring-ring transition-colors bg-background">
                  <span className="inline-flex items-center px-4 text-foreground-secondary bg-surface-subtle border-r border-border text-sm font-medium">
                    /authors/
                  </span>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    placeholder="janedoe"
                    className="flex-1 min-w-0 block w-full px-4 py-2.5 bg-transparent border-none focus:ring-0 outline-none text-foreground placeholder:text-foreground-muted"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Bio */}
          <div className="pt-6">
            <h2 className="text-xl font-bold mb-6 font-sans border-b border-border pb-4 text-foreground">Bio</h2>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-foreground">
                <span className="mr-2 text-foreground-secondary">≡</span> About You
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell the world about yourself, your expertise, and what you write about..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-ring outline-none transition-colors resize-y text-foreground placeholder:text-foreground-muted font-serif text-base"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" variant="primary" size="lg" disabled={saving} className="px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DashboardProfile;
