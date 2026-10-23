import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { updateResume } from "../services/resumeService";

export const ResumeContext = createContext();

export const defaultPhotoSettings = {
  shape: "circle", // 'circle' | 'rounded' | 'square'
  borderWidth: 2, // 0 | 1 | 2 | 3 | 4 (px)
  borderColor: "primary", // 'primary' | 'neutral' | custom hex
  grayscale: false, // boolean
  size: 64, // 56 | 64 | 72 | 80 | 96 (px)
  zoom: 1, // 1 to 3
  panX: 0, // -50 to 50 (%)
  panY: 0, // -50 to 50 (%)
};

export const initialResumeState = {
  title: "My Resume",
  template: "modern",
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    photo: "",
  },
  photoSettings: { ...defaultPhotoSettings },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionOrder: [
    "personalInfo",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "interests",
  ],
  hiddenSections: [],
  atsScore: 0,
  pageCountLock: null, // null (fluid), 1, or 2
  versions: [],
};

export function ResumeProvider({ children, initialData = null, resumeId = null }) {
  const [resume, setResume] = useState(initialData || initialResumeState);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving', 'error'
  const isFirstRender = useRef(true);

  // ── Undo / Redo History Stack ──
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const [historyVersion, setHistoryVersion] = useState(0); // triggers re-render for canUndo/canRedo
  const isPerformingUndoRedo = useRef(false);
  const lastStateStringRef = useRef("");

  // Job keyword highlighting state (set by AIToolsPanel, consumed by templates)
  const [highlightKeywords, setHighlightKeywords] = useState([]); // string[] of matched keywords
  const [missingKeywords, setMissingKeywords] = useState([]); // string[] of keywords missing from resume

  // Update context state when initialData changes
  useEffect(() => {
    if (initialData) {
      // Sanitize hiddenSections: remove any empty sections erroneously flagged by legacy import parser
      const cleanedHidden = Array.isArray(initialData.hiddenSections)
        ? initialData.hiddenSections.filter((sec) => {
            const val = initialData[sec];
            return Array.isArray(val) ? val.length > 0 : Boolean(val);
          })
        : [];

      const merged = {
        ...initialResumeState,
        ...initialData,
        hiddenSections: cleanedHidden,
        personalInfo: {
          ...initialResumeState.personalInfo,
          ...(initialData.personalInfo || {}),
        },
        photoSettings: {
          ...defaultPhotoSettings,
          ...(initialData.photoSettings || {}),
        },
        versions: initialData.versions || [],
      };
      setResume(merged);
      lastStateStringRef.current = JSON.stringify(merged);
    }
  }, [initialData]);

  // Debounced Autosave effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastStateStringRef.current = JSON.stringify(resume);
      return;
    }

    if (!resumeId) return;

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        await updateResume(resumeId, resume);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Autosave Error:", err);
        setSaveStatus("error");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [resume, resumeId]);

  // General state update helper with automatic history tracking
  const setResumeState = useCallback((updater) => {
    setResume((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };

      if (!isPerformingUndoRedo.current) {
        // Record prior state into past stack if meaningful change
        const prevString = JSON.stringify(prev);
        if (prevString !== lastStateStringRef.current) {
          pastRef.current.push(JSON.parse(prevString));
          if (pastRef.current.length > 50) pastRef.current.shift();
          futureRef.current = [];
          setHistoryVersion((v) => v + 1);
        }
        lastStateStringRef.current = JSON.stringify(next);
      }

      return next;
    });
  }, []);

  // ── Undo & Redo Handlers ──
  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    isPerformingUndoRedo.current = true;
    const previous = pastRef.current.pop();
    futureRef.current.push(JSON.parse(JSON.stringify(resume)));
    setResume(previous);
    lastStateStringRef.current = JSON.stringify(previous);
    setHistoryVersion((v) => v + 1);
    setTimeout(() => {
      isPerformingUndoRedo.current = false;
    }, 50);
  }, [resume]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    isPerformingUndoRedo.current = true;
    const next = futureRef.current.pop();
    pastRef.current.push(JSON.parse(JSON.stringify(resume)));
    setResume(next);
    lastStateStringRef.current = JSON.stringify(next);
    setHistoryVersion((v) => v + 1);
    setTimeout(() => {
      isPerformingUndoRedo.current = false;
    }, 50);
  }, [resume]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  // Global Keyboard Shortcuts (Ctrl+Z / Cmd+Z and Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable);

      const isModifier = e.ctrlKey || e.metaKey;
      if (!isModifier) return;

      if (e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else if (!isInputActive) {
          e.preventDefault();
          undo();
        }
      } else if (e.key.toLowerCase() === "y" && !isInputActive) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // ── Version Snapshots Management ──
  const createVersion = useCallback(
    (name) => {
      const versionObj = {
        id: `ver_${Date.now()}`,
        name: name?.trim() || `Snapshot ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        createdAt: new Date().toISOString(),
        resumeData: JSON.parse(JSON.stringify(resume)),
      };

      setResumeState((prev) => ({
        ...prev,
        versions: [versionObj, ...(prev.versions || [])],
      }));

      return versionObj;
    },
    [resume, setResumeState]
  );

  const restoreVersion = useCallback(
    (versionId) => {
      const target = (resume.versions || []).find((v) => v.id === versionId);
      if (!target) return false;

      // Save current state to undo history before restoring
      pastRef.current.push(JSON.parse(JSON.stringify(resume)));
      setHistoryVersion((v) => v + 1);

      setResume((prev) => ({
        ...prev,
        ...target.resumeData,
        versions: prev.versions, // Keep all snapshots intact
      }));

      return true;
    },
    [resume]
  );

  const deleteVersion = useCallback(
    (versionId) => {
      setResumeState((prev) => ({
        ...prev,
        versions: (prev.versions || []).filter((v) => v.id !== versionId),
      }));
    },
    [setResumeState]
  );

  // ── Auto-Fit to 1 Page Helper ──
  const autoFitToOnePage = useCallback(() => {
    setResumeState((prev) => {
      const curTheme = prev.theme || {};
      return {
        ...prev,
        theme: {
          ...curTheme,
          fontScale: "compact", // 11px
          lineHeight: "tight", // 1.25
          sectionSpacing: Math.min(
            typeof curTheme.sectionSpacing === "number" ? curTheme.sectionSpacing : 20,
            12
          ),
          entrySpacing: Math.min(
            typeof curTheme.entrySpacing === "number" ? curTheme.entrySpacing : 14,
            8
          ),
          pageMargin: "compact", // 15mm
        },
      };
    });
  }, [setResumeState]);

  // ── Page Count Lock Helper ──
  const setPageCountLock = useCallback(
    (pages) => {
      setResumeState((prev) => ({
        ...prev,
        pageCountLock: pages, // null, 1, or 2
      }));
    },
    [setResumeState]
  );

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    let score = 0;
    const { personalInfo, summary, education, experience, skills, projects, certifications, languages } = resume;

    if (personalInfo.fullName && personalInfo.email && personalInfo.phone) score += 15;
    if (summary && summary.length > 30) score += 15;
    if (experience && experience.length > 0) score += 20;
    if (education && education.length > 0) score += 15;
    if (skills && skills.length >= 4) score += 15;
    if (projects && projects.length > 0) score += 10;
    if (certifications && certifications.length > 0) score += 5;
    if (languages && languages.length > 0) score += 5;

    return Math.min(score, 100);
  }, [resume]);

  // Section visibility & reorder helpers
  const toggleSectionVisibility = (sectionId) => {
    setResumeState((prev) => {
      const hidden = prev.hiddenSections || [];
      const isHidden = hidden.includes(sectionId);
      return {
        ...prev,
        hiddenSections: isHidden
          ? hidden.filter((id) => id !== sectionId)
          : [...hidden, sectionId],
      };
    });
  };

  const reorderSections = (newOrder) => {
    setResumeState((prev) => ({ ...prev, sectionOrder: newOrder }));
  };

  const setTemplate = (templateName) => {
    setResumeState((prev) => ({ ...prev, template: templateName }));
  };

  const setTitle = (title) => {
    setResumeState((prev) => ({ ...prev, title }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resume,
        setResume: setResumeState,
        activeSection,
        setActiveSection,
        saveStatus,
        setSaveStatus,
        calculateCompletion,
        toggleSectionVisibility,
        reorderSections,
        setTemplate,
        setTitle,
        highlightKeywords,
        setHighlightKeywords,
        missingKeywords,
        setMissingKeywords,
        // Undo / Redo
        undo,
        redo,
        canUndo,
        canRedo,
        // Snapshots / Versions
        createVersion,
        restoreVersion,
        deleteVersion,
        // Page Fitting & Locking
        autoFitToOnePage,
        setPageCountLock,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
