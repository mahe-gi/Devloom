import axios from "axios";
import { useEffect, useState } from "react";

// Intercept 409 errors globally to clear legacy token
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 409 && error.response?.data?.error === "AUTH_IDENTITY_CONFLICT") {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export interface Blog {
  content: string;
  title: string;
  id: number;
  slug?: string | null;
  summary?: string | null;
  coverImage?: string | null;
  published?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  tags?: { tag: { name: string; slug: string } }[];
  author: {
    id?: string | number;
    name?: string | null;
    username?: string;
    handle?: string | null;
    avatarUrl?: string | null;
  };
}

export const useBlog = ({ slugOrId }: { slugOrId: string | number }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugOrId) {
      setLoading(false);
      setError("Invalid article URL parameter");
      return;
    }

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${encodeURIComponent(slugOrId.toString())}`, { 
        headers,
        withCredentials: true
      })
      .then((res) => {
        setBlog(res.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load article");
        setLoading(false);
      });
  }, [slugOrId]);

  return {
    loading,
    blog,
    error,
  };
};

interface UseBlogsProps {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
}

export const useBlogs = ({ page = 1, limit = 10, q = "", tag = "" }: UseBlogsProps = {}) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, hasNextPage: false });

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(q ? { q } : {}),
      ...(tag ? { tag } : {}),
    });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk?${params.toString()}`, { 
        headers,
        withCredentials: true 
      })
      .then((res) => {
        const fetchedBlogs = res.data.articles || res.data.blogs || [];
        if (page === 1) {
          setBlogs(fetchedBlogs);
        } else {
          setBlogs((prev) => {
            const newMap = new Map(prev.map(b => [b.id, b]));
            fetchedBlogs.forEach((b: Blog) => newMap.set(b.id, b));
            return Array.from(newMap.values());
          });
        }
        setPagination(res.data.pagination || { total: 0, totalPages: 0, hasNextPage: false });
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load feed");
        setLoading(false);
      });
  }, [page, limit, q, tag]);

  return {
    loading,
    blogs,
    error,
    pagination,
  };
};

export const useMyBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/mine`, { 
        headers,
        withCredentials: true 
      })
      .then((res) => {
        setBlogs(res.data.articles || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load your articles");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    loading,
    blogs,
    error,
    refetch: fetchBlogs,
  };
};

export const useMyBlog = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setLoading(false);
      setError("Invalid article ID");
      return;
    }

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/mine/${id}`, { 
        headers,
        withCredentials: true 
      })
      .then((res) => {
        setBlog(res.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load article");
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
    error,
  };
};

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {}, { 
        headers,
        withCredentials: true 
      })
      .then((res) => {
        setUser(res.data.user);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load profile");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { loading, user, error, refetch: fetchProfile };
};

export const useAuthorProfile = (handle: string, page = 1, limit = 10) => {
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<any>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, hasNextPage: false });

  useEffect(() => {
    if (!handle) return;
    
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/authors/${handle}?page=${page}&limit=${limit}`, {
        withCredentials: true
      })
      .then((res) => {
        setAuthor(res.data.author);
        if (page === 1) {
          setBlogs(res.data.articles || []);
        } else {
          setBlogs(prev => {
            const newMap = new Map(prev.map(b => [b.id, b]));
            res.data.articles.forEach((b: Blog) => newMap.set(b.id, b));
            return Array.from(newMap.values());
          });
        }
        setPagination(res.data.pagination || { total: 0, totalPages: 0, hasNextPage: false });
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load author profile");
        setLoading(false);
      });
  }, [handle, page, limit]);

  return { loading, author, blogs, error, pagination };
};
