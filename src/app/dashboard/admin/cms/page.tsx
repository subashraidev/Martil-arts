"use client";

import { useState } from "react";
import { Globe, BookOpen, Image, MessageSquare, Send, Check } from "lucide-react";

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<"blog" | "gallery" | "announcement">("blog");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Blog states
  const [blogData, setBlogData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "Philosophy",
    tags: "",
    image: "",
  });

  // Gallery states
  const [galleryData, setGalleryData] = useState({
    url: "",
    album: "Classes",
    title: "",
  });

  // Announcement states
  const [annData, setAnnData] = useState({
    title: "",
    content: "",
    target: "students",
  });

  const handleBlogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGalleryData({ ...galleryData, [e.target.name]: e.target.value });
  };

  const handleAnnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAnnData({ ...annData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let payload: any = { type: activeTab };
      if (activeTab === "blog") payload = { ...payload, ...blogData };
      else if (activeTab === "gallery") payload = { ...payload, ...galleryData };
      else if (activeTab === "announcement") payload = { ...payload, ...annData };

      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save CMS item");
      }

      setSuccess(`🎉 Success! ${activeTab.toUpperCase()} has been published successfully.`);
      
      // Reset forms
      if (activeTab === "blog") {
        setBlogData({ title: "", summary: "", content: "", category: "Philosophy", tags: "", image: "" });
      } else if (activeTab === "gallery") {
        setGalleryData({ url: "", album: "Classes", title: "" });
      } else if (activeTab === "announcement") {
        setAnnData({ title: "", content: "", target: "students" });
      }
    } catch (err: any) {
      setError(err.message || "Failed to post CMS item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">Website Content Management (CMS)</h1>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">Compose blog articles, update the media gallery, or broadcast announcements.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-150 pb-2">
        <button
          onClick={() => { setActiveTab("blog"); setSuccess(""); setError(""); }}
          className={`flex items-center gap-1.5 pb-2 text-xs font-bold uppercase cursor-pointer ${
            activeTab === "blog" ? "border-b-2 border-martial-red text-primary-navy" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Write Blog</span>
        </button>
        <button
          onClick={() => { setActiveTab("gallery"); setSuccess(""); setError(""); }}
          className={`flex items-center gap-1.5 pb-2 text-xs font-bold uppercase cursor-pointer ${
            activeTab === "gallery" ? "border-b-2 border-martial-red text-primary-navy" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Image className="h-4 w-4" />
          <span>Media Gallery</span>
        </button>
        <button
          onClick={() => { setActiveTab("announcement"); setSuccess(""); setError(""); }}
          className={`flex items-center gap-1.5 pb-2 text-xs font-bold uppercase cursor-pointer ${
            activeTab === "announcement" ? "border-b-2 border-martial-red text-primary-navy" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Post Broadcast</span>
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Blog form */}
      {activeTab === "blog" && (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Article Title *</label>
              <input
                type="text"
                name="title"
                required
                value={blogData.title}
                onChange={handleBlogChange}
                placeholder="The Tenets of Taekwondo..."
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Category *</label>
              <select
                name="category"
                value={blogData.category}
                onChange={handleBlogChange}
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none"
              >
                <option value="Philosophy">Philosophy</option>
                <option value="Training Tips">Training Tips</option>
                <option value="Parenting">Parenting</option>
                <option value="Events">Events</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Cover Image URL</label>
              <input
                type="text"
                name="image"
                value={blogData.image}
                onChange={handleBlogChange}
                placeholder="https://images.unsplash.com/photo-..."
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Tags (Comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={blogData.tags}
                onChange={handleBlogChange}
                placeholder="Tenets, Kids, Sparring"
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1.5">Summary / Excerpt *</label>
            <input
              type="text"
              name="summary"
              required
              value={blogData.summary}
              onChange={handleBlogChange}
              placeholder="Short paragraph summary to display in listing grid..."
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1.5">Article Body Content *</label>
            <textarea
              name="content"
              required
              rows={8}
              value={blogData.content}
              onChange={handleBlogChange}
              placeholder="Write the full post contents here. Use standard double linebreaks for paragraphs."
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5 text-accent-gold" />
            {loading ? "Publishing article..." : "Publish Blog Post"}
          </button>
        </form>
      )}

      {/* Gallery form */}
      {activeTab === "gallery" && (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs max-w-lg">
          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1.5">Media Image URL *</label>
            <input
              type="text"
              name="url"
              required
              value={galleryData.url}
              onChange={handleGalleryChange}
              placeholder="https://images.unsplash.com/photo-..."
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Caption / Title</label>
              <input
                type="text"
                name="title"
                value={galleryData.title}
                onChange={handleGalleryChange}
                placeholder="Youth Sparring Championship"
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Album Category *</label>
              <select
                name="album"
                value={galleryData.album}
                onChange={handleGalleryChange}
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none"
              >
                <option value="Classes">Classes</option>
                <option value="Belt Promotion">Belt Promotion</option>
                <option value="Tournaments">Tournaments</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5 text-accent-gold" />
            {loading ? "Adding media..." : "Add to Gallery"}
          </button>
        </form>
      )}

      {/* Announcement form */}
      {activeTab === "announcement" && (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Announcement Title *</label>
              <input
                type="text"
                name="title"
                required
                value={annData.title}
                onChange={handleAnnChange}
                placeholder="August Belt Testing Details"
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Target Audience *</label>
              <select
                name="target"
                value={annData.target}
                onChange={handleAnnChange}
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none"
              >
                <option value="students">All Students</option>
                <option value="all">Everyone (Students & Staff)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-500 uppercase mb-1.5">Message Content *</label>
            <textarea
              name="content"
              required
              rows={4}
              value={annData.content}
              onChange={handleAnnChange}
              placeholder="Provide information about training times, locations, and deadlines..."
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5 text-accent-gold" />
            {loading ? "Publishing..." : "Send Announcement Broadcast"}
          </button>
        </form>
      )}
    </div>
  );
}
