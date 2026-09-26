"use client";

import React from "react";
import { X, BookOpen, Layers, CheckCircle2, Code2, Sparkles, Edit3, ExternalLink, Globe } from "lucide-react";
import { Project } from "../../types";

interface CaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
}

export default function CaseStudyModal({
  project,
  isOpen,
  onClose,
  onEdit,
}: CaseStudyModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs select-none">
      <div className="max-w-2xl w-full bg-white border border-zinc-200/90 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-dialog-show">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 px-6 py-4 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="h-4.5 w-4.5 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-900 truncate max-w-sm">
                  {project.title}
                </h2>
                {project.category && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {project.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Pratinjau Detail Studi Kasus (Halaman Website <span className="font-mono text-zinc-700">/projects/{project.id}</span>)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Subtitle Banner if exists */}
          {project.subtitle && (
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider block mb-1">
                Subtitle / Tagline Studi Kasus
              </span>
              <p className="text-xs font-medium text-zinc-800 leading-relaxed">
                {project.subtitle}
              </p>
            </div>
          )}

          {/* Section 1: Overview / Latar Belakang & Solusi */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs">
              <Globe className="h-4 w-4 text-zinc-700" />
              <span>1. Latar Belakang &amp; Solusi (Overview)</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200/90 text-zinc-700 leading-relaxed text-xs shadow-2xs">
              {project.longDescription ? (
                <p className="whitespace-pre-line">{project.longDescription}</p>
              ) : (
                <p className="text-zinc-400 italic">
                  Belum ada deskripsi studi kasus mendalam. Menggunakan fallback dari deskripsi singkat: &ldquo;{project.description}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Kemampuan Sistem & Highlights */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs">
                <Layers className="h-4 w-4 text-zinc-700" />
                <span>2. Fitur &amp; Kemampuan Sistem (Highlights Checklist)</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-medium">
                {project.highlights?.length || 0} Poin Terdaftar
              </span>
            </div>

            {project.highlights && project.highlights.length > 0 ? (
              <div className="space-y-2">
                {project.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5 text-zinc-800"
                  >
                    <CheckCircle2 className="h-4 w-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed font-normal">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                Belum ada poin highlights / kemampuan sistem yang ditambahkan untuk proyek ini. Klik tombol &ldquo;Edit Studi Kasus&rdquo; di bawah untuk menambahkannya.
              </div>
            )}
          </div>

          {/* Section 3: Tech Stack & Sorotan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-700 font-semibold text-[11px]">
                <Code2 className="h-3.5 w-3.5 text-zinc-600" />
                <span>Teknologi Digunakan (Tech Stack)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-700 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-400 text-xs">Belum ada tags</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-700 font-semibold text-[11px]">
                <Sparkles className="h-3.5 w-3.5 text-zinc-600" />
                <span>Key Metrics / Sorotan Proyek</span>
              </div>
              <p className="text-xs font-semibold text-zinc-900 pt-1">
                {project.metrics || <span className="text-zinc-400 font-normal italic">Tidak ada metrics spesifik</span>}
              </p>
              <p className="text-[10px] text-zinc-400">Tahun: {project.year || "2026"}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-150 px-6 py-3.5 bg-zinc-50/70">
          <div className="flex items-center gap-2">
            {project.demoUrl && project.demoUrl !== "#" && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Buka Demo Live</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-700 text-xs font-medium hover:bg-zinc-50 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(project);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium shadow-2xs transition active:scale-98 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Detail Studi Kasus</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
