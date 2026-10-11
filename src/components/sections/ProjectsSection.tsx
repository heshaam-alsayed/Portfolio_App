"use client";

import { useState } from "react";
import { FiGithub, FiGlobe, FiLock } from "react-icons/fi";
import type { Project, ProjectActionLabels } from "@/types/cms";
import { urlForImage } from "@/lib/sanity/image";

interface ProjectsSectionProps {
  projects: Project[];
  sectionLabel?: string;
  heading?: string;
  description?: string;
  actionLabels?: ProjectActionLabels;
}

function getHostname(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function thumIoUrl(url: string): string {
  return `https://image.thum.io/get/width/1280/crop/900/${url}`;
}

function mshotUrl(url: string): string {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=900`;
}

function buildCandidateSources(project: Project): string[] {
  const candidates: string[] = [];
  if (project.image) {
    candidates.push(urlForImage(project.image).width(1280).height(800).url());
  }
  const live = project.storeUrl || project.adminUrl;
  if (live) {
    candidates.push(thumIoUrl(live));
    candidates.push(mshotUrl(live));
  }
  return candidates;
}

function ProjectRow({
  project,
  index,
  actionLabels,
}: {
  project: Project;
  index: number;
  actionLabels?: ProjectActionLabels;
}) {
  const [candidates] = useState<string[]>(() => buildCandidateSources(project));
  const [candidateIndex, setCandidateIndex] = useState(0);

  const liveUrl = project.storeUrl || project.adminUrl || "";
  const sourceUrl = project.githubUrl;
  const adminUrl = project.adminUrl;
  const src = candidateIndex === -1 ? "" : candidates[candidateIndex] ?? "";

  function handleImageError() {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex(candidateIndex + 1);
    } else {
      setCandidateIndex(-1);
    }
  }

  return (
    <div className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="relative border-border bg-accent md:border-r">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-yellow-400/80" />
          <span className="size-2.5 rounded-full bg-green-400/80" />
          <span className="ml-3 inline-flex h-5 min-w-0 flex-1 items-center justify-center truncate rounded-md bg-background px-3 text-[10px] text-muted-foreground">
            {getHostname(liveUrl) || project.title}
          </span>
        </div>

        <div className="relative aspect-[16/11] overflow-hidden">
          {src ? (
            <img
              src={src}
              alt={`Screenshot of ${project.title}`}
              loading="lazy"
              onError={handleImageError}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent to-muted">
              <span className="text-6xl font-bold text-muted-foreground/20">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="size-1 rounded-full bg-muted-foreground/60" />
          <span>{project.techStack?.[0] ?? "Project"}</span>
        </div>

        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {project.title}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {project.techStack?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <div
                key={tech}
                className="inline-flex h-6 w-fit items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-foreground"
              >
                {tech}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-3 pt-1">
          {liveUrl ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={liveUrl}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:-translate-y-0.5 hover:bg-foreground/90"
            >
              <FiGlobe className="size-4" />
              {actionLabels?.live || "Live Demo"}
            </a>
          ) : null}

          {sourceUrl ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={sourceUrl}
              className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-muted"
            >
              <FiGithub className="size-4" />
              {actionLabels?.source || "Source Code"}
            </a>
          ) : null}

          {adminUrl && adminUrl !== liveUrl ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={adminUrl}
              className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-muted"
            >
              <FiLock className="size-4" />
              Admin Demo
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({
  projects,
  sectionLabel,
  heading,
  description,
  actionLabels,
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="relative px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex flex-col items-center gap-y-4">
          <div className="flex w-full max-w-[800px] items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="z-10 rounded-xl border border-border bg-muted px-4 py-1">
              <span className="text-sm font-medium text-foreground">{sectionLabel}</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>

          <div className="flex flex-col items-center gap-y-3">
            {heading ? (
              <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl">
                {heading}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-[600px] text-balance text-center text-muted-foreground md:text-lg/relaxed">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {projects.map((project, index) => (
            <ProjectRow
              key={project._id}
              project={project}
              index={index}
              actionLabels={actionLabels}
            />
          ))}
        </div>
      </div>
    </section>
  );
}