import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { useProfile } from "../hooks";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { updateProfileInput } from "@mahe-npm/common";
import { Link } from "react-router";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { User, AtSign, AlignLeft, Image as ImageIcon, ExternalLink, Camera } from "lucide-react";

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
      <div className="min-h-screen bg-background flex flex-col">
        <Appbar val={true} />
        <Container size="article" className="py-12 flex-1">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-surface-subtle rounded-md mb-8"></div>
            <div className="space-y-6 bg-surface p-8 rounded-2xl border border-border">
              <div className="h-12 bg-surface-subtle rounded-xl w-full"></div>
              <div className="h-12 bg-surface-subtle rounded-xl w-full"></div>
              <div className="h-32 bg-surface-subtle rounded-xl w-full"></div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Appbar val={true} />
      
      <Container size="article" className="py-12 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground font-sans tracking-tight">Your Profile</h1>
            <p className="text-muted text-lg mt-2 font-serif">Customize how you appear to other readers and writers.</p>
          </div>
          {user?.handle && (
            <Link 
              to={`/authors/${user.handle}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 border border-border bg-transparent hover:bg-surface-subtle text-foreground h-10 px-4 py-2 text-sm"
              target="_blank"
            >
              <ExternalLink size={16} className="mr-2" /> View Public Profile
            </Link>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden hover:border-primary/30 transition-colors">
          <div className="p-8 space-y-8 max-w-3xl mx-auto">
            
            {/* Avatar section top aligned */}
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center border-b border-border pb-8">
              <div className="w-24 h-24 rounded-full border-4 border-surface bg-surface-subtle flex items-center justify-center overflow-hidden z-10 shadow-sm shrink-0">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <User size={40} className="text-muted opacity-50" />
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                <label className="flex items-center text-sm font-semibold text-foreground">
                  <ImageIcon size={16} className="mr-2 text-muted" /> Avatar URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors text-foreground placeholder:text-muted"
                  />
                  <Camera size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-foreground">
                  <User size={16} className="mr-2 text-muted" /> Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors text-foreground placeholder:text-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-foreground">
                  <AtSign size={16} className="mr-2 text-muted" /> Public Handle <span className="text-muted font-normal ml-2">(Optional)</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-colors">
                  <span className="inline-flex items-center px-3 bg-surface-subtle text-muted border-r border-border text-sm font-medium">
                    /authors/
                  </span>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    placeholder="janedoe"
                    className="flex-1 min-w-0 block w-full px-4 py-3 bg-background border-none focus:ring-0 outline-none text-foreground placeholder:text-muted"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-foreground">
                <AlignLeft size={16} className="mr-2 text-muted" /> Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell the world about yourself, your expertise, and what you write about..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors resize-y text-foreground placeholder:text-muted font-serif"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={saving}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default DashboardProfile;
