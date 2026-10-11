"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaUser, FaCode, FaProjectDiagram, FaGraduationCap, FaShareAlt, FaCog,
  FaPlus, FaEdit, FaTrash, FaSave, FaSpinner, FaTags, FaInfoCircle, FaImage,
} from "react-icons/fa";
import { Modal } from "@/components/admin/Modal";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { FaFilePdf } from "react-icons/fa6";
import { urlForImage } from "@/lib/sanity/image";

type Section = "personalInfo" | "skills" | "projects" | "experience" | "socialLinks" | "siteSettings" | "categories" | "about";

const sections: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "personalInfo", label: "Personal Info", icon: <FaUser /> },
  { key: "about", label: "About", icon: <FaInfoCircle /> },
  { key: "skills", label: "Skills", icon: <FaCode /> },
  { key: "projects", label: "Projects", icon: <FaProjectDiagram /> },
  { key: "experience", label: "Experience", icon: <FaGraduationCap /> },
  { key: "socialLinks", label: "Social Links", icon: <FaShareAlt /> },
  { key: "categories", label: "Categories", icon: <FaTags /> },
  { key: "siteSettings", label: "Site Settings", icon: <FaCog /> },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

// ─── Skeleton ───
function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

// ─── Spinner ───
function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <FaSpinner className={`animate-spin ${className}`} />;
}

// ─── API helper ───
const typeMap: Record<string, string> = {
  socialLinks: "socialLink",
  skills: "skill",
  projects: "project",
  experience: "experience",
  personalInfo: "personalInfo",
  siteSettings: "siteSettings",
  categories: "category",
  about: "about",
};

async function api(section: string, action: string, data?: Doc, id?: string, ids?: string[]) {
  const type = typeMap[section] || section;
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, action, data, id, ids }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json;
}

// ─── Badge ───
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-foreground/10 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
      {children}
    </span>
  );
}

// ===================================================================
// Admin Dashboard
// ===================================================================
// ─── PDF Upload ───
function PdfUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-pdf", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onChange(json.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
          <FaFilePdf className="h-5 w-5 shrink-0 text-red-500" />
          <span className="flex-1 truncate text-sm font-medium text-foreground">CV uploaded</span>
          <button onClick={() => onChange("")} className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-xs text-red-500 hover:bg-red-500/20">&times;</button>
        </div>
      ) : null}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground hover:bg-muted">
        {uploading ? <Spinner /> : <FaFilePdf />}
        {uploading ? "Uploading..." : "Upload CV (PDF)"}
        <input type="file" accept=".pdf" onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
}

// ─── Image Upload ───
function ImageUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onChange(json.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-xl bg-accent">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <button onClick={() => onChange("")} className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">&times;</button>
        </div>
      ) : null}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground hover:bg-muted">
        {uploading ? <Spinner /> : <FaImage />}
        {uploading ? "Uploading..." : "Upload Image"}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
}

// ─── Category Select ───
function CategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [cats, setCats] = useState<Doc[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    api("categories", "fetch").then((r) => {
      if (Array.isArray(r.data)) setCats(r.data);
    }).catch(() => {});
  }, []);

  async function addCategory() {
    if (!newName.trim()) return;
    await api("categories", "create", { name: newName.trim(), order: cats.length });
    setNewName("");
    setAdding(false);
    const r = await api("categories", "fetch");
    if (Array.isArray(r.data)) setCats(r.data);
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {cats.map((c) => (
              <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {adding ? (
        <div className="flex gap-1 items-end">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCategory(); }}
            className="w-32 rounded-lg border border-foreground/10 bg-muted/50 px-2.5 py-1.5 text-sm outline-none focus:border-foreground/30"
            placeholder="New name"
            autoFocus
          />
          <button onClick={addCategory} className="rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background">Add</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:bg-muted hover:text-foreground">
          <FaPlus className="text-xs" />
        </button>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [active, setActive] = useState<Section>("personalInfo");
  const [docs, setDocs] = useState<Record<string, Doc[] | Doc | null>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [formData, setFormData] = useState<Doc>({});
  const [aboutDoc, setAboutDoc] = useState<Doc | null>(null);
  const [piDoc, setPiDoc] = useState<Doc | null>(null);
  const [ssDoc, setSsDoc] = useState<Doc | null>(null);
  const [projLabel, setProjLabel] = useState("");
  const [projHeading, setProjHeading] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [expLabel, setExpLabel] = useState("");
  const [expHeading, setExpHeading] = useState("");
  const [expDesc, setExpDesc] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result: Record<string, Doc[] | Doc | null> = {};
    const allSections = ["personalInfo", "about", "skills", "projects", "experience", "socialLinks", "categories", "siteSettings"];
    try {
      const res = await Promise.all(allSections.map((s) => api(s, "fetch")));
      for (let i = 0; i < allSections.length; i++) {
        result[allSections[i]] = res[i].data;
      }
    } catch (err) {
      console.error(err);
    }
    setDocs(result);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const sectionData = docs[active] as Doc[] | Doc | null | undefined;

  useEffect(() => {
    if (active === "projects") {
      const ss = docs.siteSettings as Doc | null | undefined;
      setProjLabel(ss?.sectionLabels?.projects ?? "");
      setProjHeading(ss?.projectsHeading ?? "");
      setProjDesc(ss?.projectsDescription ?? "");
    }
    if (active === "experience") {
      const ss = docs.siteSettings as Doc | null | undefined;
      setExpLabel(ss?.sectionLabels?.experience ?? "");
      setExpHeading(ss?.experienceHeading ?? "");
      setExpDesc(ss?.experienceDescription ?? "");
    }
  }, [active, docs]);

  function extractFormData(doc: Doc): Doc {
    const rawType = doc._type || active;
    const formKey = typeMap[rawType] || rawType;
    const fields = formFields[formKey as keyof typeof formFields];
    const allowedKeys = new Set(fields?.map((f) => f.key) || []);
    const clean: Doc = {};
    for (const [k, v] of Object.entries(doc)) {
      if (allowedKeys.has(k)) clean[k] = v;
    }
    return clean;
  }

  useEffect(() => {
    if (active === "about" && sectionData && typeof sectionData === "object") {
      setAboutDoc(sectionData);
      setFormData(extractFormData(sectionData));
    }
  }, [active, sectionData]);

  useEffect(() => {
    if (active === "personalInfo" && sectionData && typeof sectionData === "object") {
      setPiDoc(sectionData);
      setFormData(extractFormData(sectionData));
    }
  }, [active, sectionData]);

  useEffect(() => {
    if (active === "siteSettings" && sectionData && typeof sectionData === "object") {
      setSsDoc(sectionData);
      setFormData(extractFormData(sectionData));
    }
  }, [active, sectionData]);

  function openNew() {
    setEditing(null);
    setFormData({});
    setModalOpen(true);
  }

  function openEdit(doc: Doc) {
    const rawType = doc._type;
    const formKey = typeMap[rawType] || rawType;
    const fields = formFields[formKey as keyof typeof formFields];
    const allowedKeys = new Set(fields?.map((f) => f.key) || []);
    const clean: Doc = {};
    for (const [k, v] of Object.entries(doc)) {
      if (allowedKeys.has(k)) clean[k] = v;
    }
    setEditing(doc);
    setFormData(clean);
    setModalOpen(true);
  }

  async function handleSave() {
    setActionLoading("save");
    try {
      const sectionName = editing ? (typeMap[editing._type] || editing._type) : (typeMap[active] || active);
      if (editing) {
        await api(sectionName, "update", formData, editing._id);
      } else {
        await api(active, "create", formData);
      }
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSaveInline(section: string, doc: Doc | null) {
    setActionLoading("save");
    try {
      if (doc?._id) {
        await api(section, "update", formData, doc._id);
      } else {
        const result = await api(section, "create", formData);
        if (section === "about") setAboutDoc(result.data);
        if (section === "personalInfo") setPiDoc(result.data);
        if (section === "siteSettings") setSsDoc(result.data);
      }
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSaveProjectsConfig() {
    setActionLoading("projConfig");
    try {
      const ss = docs.siteSettings as Doc | null | undefined;
      if (!ss?._id) return;
      const sectionLabels = { ...(ss.sectionLabels || {}), projects: projLabel };
      const payload: Doc = { sectionLabels, projectsHeading: projHeading, projectsDescription: projDesc };
      await api("siteSettings", "update", payload, ss._id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSaveExperienceConfig() {
    setActionLoading("expConfig");
    try {
      const ss = docs.siteSettings as Doc | null | undefined;
      if (!ss?._id) return;
      const sectionLabels = { ...(ss.sectionLabels || {}), experience: expLabel };
      const payload: Doc = { sectionLabels, experienceHeading: expHeading, experienceDescription: expDesc };
      await api("siteSettings", "update", payload, ss._id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(doc: Doc) {
    if (!confirm(`Delete this ${doc._type}?`)) return;
    setActionLoading(doc._id);
    try {
      await api(doc._type, "delete", undefined, doc._id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting");
    } finally {
      setActionLoading(null);
    }
  }

  function inputField(field: typeof formFields[string][0]) {
    if (field.type === "textarea") {
      return (
        <textarea
          value={formData[field.key] ?? ""}
          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
          className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/30"
          rows={field.rows || 3}
        />
      );
    }
    if (field.type === "array") {
      return (
        <ArrayInput
          values={formData[field.key] ?? []}
          onChange={(vals) => setFormData({ ...formData, [field.key]: vals })}
        />
      );
    }
    if (field.type === "categorySelect") {
      return (
        <CategorySelect
          value={formData[field.key] ?? ""}
          onChange={(v) => setFormData({ ...formData, [field.key]: v })}
        />
      );
    }
    if (field.type === "imageUpload") {
      return (
        <ImageUpload
          value={formData[field.key] ?? ""}
          onChange={(v) => setFormData({ ...formData, [field.key]: v })}
        />
      );
    }
    if (field.type === "fileUpload") {
      return (
        <PdfUpload
          value={formData[field.key] ?? ""}
          onChange={(v) => setFormData({ ...formData, [field.key]: v })}
        />
      );
    }
    return (
      <input
        type={field.type === "number" ? "number" : "text"}
        value={formData[field.key] ?? ""}
        onChange={(e) => setFormData({ ...formData, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
        className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/30"
        placeholder={field.placeholder}
      />
    );
  }

  function renderForm() {
    const rawType = editing?._type || active;
    const formKey = typeMap[rawType] || rawType;
    const fields = formFields[formKey as keyof typeof formFields];
    if (!fields) return <p className="text-sm text-muted-foreground">No editable fields</p>;

    const isWide = (f: typeof fields[0]) => f.type === "textarea" || f.type === "array";

    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {fields.map((field, idx) => {
          const next = fields[idx + 1];
          if (field.key === "order") return null;

          if (next?.key === "order") {
            return (
              <div key={field.key} className="col-span-2 grid grid-cols-[1fr_auto] gap-x-4 items-end">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{field.label}</label>
                  {inputField(field)}
                </div>
                <div className="w-20">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{next.label}</label>
                  {inputField(next)}
                </div>
              </div>
            );
          }

          const wide = isWide(field);
          const alone = !next || isWide(next);
          return (
            <div key={field.key} className={wide || alone ? "col-span-2" : ""}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{field.label}</label>
              {inputField(field)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background pt-14">
      {/* ─── Sidebar ─── */}
      <aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-56 border-r border-foreground/10 bg-background p-3">
        <nav className="flex flex-col gap-1">
          {sections.map((s) => {
            const count = getCount(s.key, docs);
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active === s.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="text-sm">{s.icon}</span>
                <span className="flex-1 text-left">{s.label}</span>
                {count !== null ? (
                  <span className={`text-[11px] font-semibold ${active === s.key ? "text-background/70" : "text-muted-foreground"}`}>
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="ml-56 flex-1 px-8 py-8">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <Skeleton rows={6} />
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                  {sections.find((s) => s.key === active)?.label}
                </h1>
                {active !== "personalInfo" && active !== "siteSettings" && active !== "about" ? (
                  <button
                    onClick={openNew}
                    className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:-translate-y-0.5"
                  >
                    <FaPlus />
                    Add New
                  </button>
                ) : null}
              </div>

              {/* Content */}
              {active === "about" || active === "personalInfo" || active === "siteSettings" ? (
                <div className="rounded-2xl border border-foreground/10 bg-card p-6">
                  {renderForm()}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        const d = active === "about" ? aboutDoc : active === "personalInfo" ? piDoc : ssDoc;
                        if (d) setFormData(extractFormData(d));
                      }}
                      className="rounded-xl border border-foreground/10 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveInline(active, active === "about" ? aboutDoc : active === "personalInfo" ? piDoc : ssDoc)}
                      disabled={actionLoading === "save"}
                      className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
                    >
                      {actionLoading === "save" ? <Spinner /> : <FaSave />}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {active === "projects" ? (
                    <div className="rounded-2xl border border-foreground/10 bg-card p-5">
                      <p className="mb-3 text-xs font-medium text-muted-foreground">Section Text</p>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Section Label</label>
                          <input value={projLabel} onChange={(e) => setProjLabel(e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Heading</label>
                          <input value={projHeading} onChange={(e) => setProjHeading(e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Description</label>
                          <textarea value={projDesc} onChange={(e) => setProjDesc(e.target.value)} rows={2} className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30" />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={handleSaveProjectsConfig}
                          disabled={actionLoading === "projConfig"}
                          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
                        >
                          {actionLoading === "projConfig" ? <Spinner /> : <FaSave />}
                          Save Section Text
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {active === "experience" ? (
                    <div className="rounded-2xl border border-foreground/10 bg-card p-5">
                      <p className="mb-3 text-xs font-medium text-muted-foreground">Section Text</p>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Section Label</label>
                          <input value={expLabel} onChange={(e) => setExpLabel(e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Heading</label>
                          <input value={expHeading} onChange={(e) => setExpHeading(e.target.value)} className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Description</label>
                          <textarea value={expDesc} onChange={(e) => setExpDesc(e.target.value)} rows={2} className="w-full rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30" />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={handleSaveExperienceConfig}
                          disabled={actionLoading === "expConfig"}
                          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
                        >
                          {actionLoading === "expConfig" ? <Spinner /> : <FaSave />}
                          Save Section Text
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {(sectionData as Doc[] | null)?.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">No items yet.</p>
                  ) : null}
                  {(sectionData as Doc[] | null)?.map((doc: Doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-card p-5 transition-all hover:shadow-sm"
                    >
                      {doc.imageUrl || doc.image ? (
                        <img
                          src={doc.imageUrl || urlForImage(doc.image).width(160).height(96).url()}
                          alt={getDocTitle(doc)}
                          className="h-14 w-24 shrink-0 rounded-lg border border-foreground/10 object-cover"
                        />
                      ) : null}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {getDocTitle(doc)}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {getDocSubtitle(doc)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => openEdit(doc)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          disabled={actionLoading === doc._id}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          {actionLoading === doc._id ? <Spinner /> : <FaTrash className="text-sm" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ─── Modal ─── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit" : "New"} className="max-w-2xl">
        {renderForm()}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-xl border border-foreground/10 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={actionLoading === "save"}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
          >
            {actionLoading === "save" ? <Spinner /> : <FaSave />}
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Array Input ───
function ArrayInput({ values, onChange }: { values: string[]; onChange: (vals: string[]) => void }) {
  const [input, setInput] = useState("");

  function add() {
    if (input.trim()) {
      onChange([...values, input.trim()]);
      setInput("");
    }
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className="flex-1 rounded-lg border border-foreground/10 bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30"
          placeholder="Type and press Enter"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-foreground/10 px-3 text-sm font-medium text-foreground hover:bg-foreground/20"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
            {v}
            <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-foreground">&times;</button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Single Item Render (personalInfo / siteSettings) ───
function renderSingleItem(doc: Doc | null, openEdit: (d: Doc) => void, handleDelete: (d: Doc) => void, loading: string | null) {
  if (!doc) return <p className="text-sm text-muted-foreground">No data</p>;

  return (
    <div className="space-y-4">
      {Object.entries(doc).filter(([k]) => !k.startsWith("_")).map(([key, value]) => (
        <div key={key}>
          <p className="text-xs font-medium text-muted-foreground">{key}</p>
          <p className="mt-0.5 text-sm text-foreground break-words">
            {typeof value === "object" ? JSON.stringify(value, null, 1) : String(value)}
          </p>
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => openEdit(doc)}
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90"
        >
          <FaEdit /> Edit
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ───
function getDocTitle(doc: Doc): string {
  return doc.title || doc.name || doc.platform || doc.company || doc.role || doc._id;
}

function getDocSubtitle(doc: Doc): string {
  if (doc.category) return `Category: ${doc.category}`;
  if (doc.description) return doc.description.slice(0, 80);
  if (doc.url) return doc.url;
  if (doc.company) return doc.company;
  return "";
}

function getCount(section: Section, docs: Record<string, Doc[] | Doc | null>): number | null {
  const d = docs[section];
  if (Array.isArray(d)) return d.length;
  if (d && typeof d === "object") return null;
  return 0;
}

// ─── Field Definitions ───
const formFields: Record<string, { key: string; label: string; type: string; placeholder?: string; rows?: number }[]> = {
  personalInfo: [
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "subheadline", label: "Subheadline", type: "textarea" },
    { key: "bio", label: "Bio", type: "textarea", rows: 5 },
    { key: "email", label: "Email", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "cvFile", label: "CV File (PDF)", type: "fileUpload" },
  ],
  skill: [
    { key: "name", label: "Name", type: "text" },
    { key: "iconKey", label: "Icon Key", type: "text" },
    { key: "category", label: "Category", type: "categorySelect" },
  ],
  about: [
    { key: "sectionName", label: "Section Name", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body Text", type: "textarea", rows: 5 },
    { key: "location", label: "Location", type: "text" },
    { key: "imageUrl", label: "Image", type: "imageUpload" },
    { key: "button1Label", label: "Button 1 Label", type: "text" },
    { key: "button1Url", label: "Button 1 URL", type: "text" },
    { key: "button2Label", label: "Button 2 Label", type: "text" },
    { key: "button2Url", label: "Button 2 URL", type: "text" },
  ],
  category: [
    { key: "name", label: "Name", type: "text" },
    { key: "order", label: "Order", type: "number" },
  ],
  project: [
    { key: "title", label: "Title", type: "text" },
    { key: "order", label: "Order", type: "number" },
    { key: "imageUrl", label: "Project Image (upload)", type: "imageUpload" },
    { key: "screenshotUrl", label: "Screenshot URL (exact page)", type: "text" },
    { key: "storeUrl", label: "Live URL", type: "text" },
    { key: "adminUrl", label: "Admin Dashboard URL", type: "text" },
    { key: "githubUrl", label: "GitHub URL", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "techStack", label: "Tech Stack", type: "array" },
  ],
  experience: [
    { key: "company", label: "Company / Institution", type: "text" },
    { key: "order", label: "Order", type: "number" },
    { key: "role", label: "Role / Degree", type: "text" },
    { key: "startDate", label: "Start Date", type: "text" },
    { key: "endDate", label: "End Date", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  socialLink: [
    { key: "platform", label: "Platform", type: "text" },
    { key: "order", label: "Order", type: "number" },
    { key: "url", label: "URL", type: "text" },
    { key: "iconKey", label: "Icon Key", type: "text" },
  ],
  siteSettings: [
    { key: "siteTitle", label: "Site Title", type: "text" },
    { key: "siteDescription", label: "Site Description", type: "textarea" },
    { key: "footerText", label: "Footer Text", type: "text" },
    { key: "experiencePresentLabel", label: "Present Label", type: "text" },
    { key: "projectsHeading", label: "Projects Heading", type: "text" },
    { key: "projectsDescription", label: "Projects Description", type: "textarea" },
    { key: "experienceHeading", label: "Experience Heading", type: "text" },
    { key: "experienceDescription", label: "Experience Description", type: "textarea" },
  ],
};
