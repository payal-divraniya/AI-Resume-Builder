import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import defaultResume from "../data/defaultResume";
import { useAuth } from "./AuthContext";

import {
  getResumes,
  createResume as createResumeAPI,
  updateResume as updateResumeAPI,
  deleteResume as deleteResumeAPI,
} from "../services/resumeService";

const ResumeContext = createContext(null);

const isMongoId = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

function notifyResumeError(message) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("resume-toast", {
        detail: { message, type: "error" },
      }),
    );
  }
}

function normalizeResume(item) {
  return {
    ...item,
    id: String(item._id || item.id),
    personalInfo: {
      ...defaultResume.personalInfo,
      ...(item.personalInfo || {}),
    },
    education: item.education || [],
    experience: item.experience || [],
    skills: item.skills || [],
    projects: item.projects || [],
    certifications: item.certifications || [],
    languages: item.languages || [],
    selectedTemplate: item.selectedTemplate || "modern",
    themeColor: item.themeColor || "#2563eb",
  };
}

function toResumePayload(item) {
  const excluded = new Set([
    "id",
    "_id",
    "__v",
    "owner",
    "createdAt",
    "updatedAt",
  ]);

  return Object.fromEntries(
    Object.entries(item).filter(([key]) => !excluded.has(key)),
  );
}

function createNewResume() {
  return {
    ...defaultResume,
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    personalInfo: { ...defaultResume.personalInfo },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  };
}

function isResumeBlank(item) {
  const personalInfo = item?.personalInfo || {};

  const hasPersonalInfo = Object.values(personalInfo).some((value) =>
    String(value ?? "").trim(),
  );

  const sections = [
    item?.education,
    item?.experience,
    item?.skills,
    item?.projects,
    item?.certifications,
    item?.languages,
  ];

  const hasSectionContent = sections.some(
    (section) => Array.isArray(section) && section.length > 0,
  );

  return !hasPersonalInfo && !hasSectionContent;
}

function safeRead(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function ResumeProvider({ children }) {
  const { user, token, isAuthenticated } = useAuth();

  const accountKey = user?._id || user?.id || user?.email || "signed-out";

  return (
    <ResumeProviderInner
      key={String(accountKey).toLowerCase()}
      user={user}
      token={token}
      isAuthenticated={isAuthenticated}
    >
      {children}
    </ResumeProviderInner>
  );
}

function ResumeProviderInner({ children, user, token, isAuthenticated }) {
  const accountKey = user?._id || user?.id || user?.email || "signed-out";

  const storagePrefix = `resumeAI:${String(accountKey).toLowerCase()}`;
  const storageKey = `${storagePrefix}:resumes`;
  const activeKey = `${storagePrefix}:active`;
  const mappingKey = `${storagePrefix}:mongoIdMap`;

  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [isMongoLoaded, setIsMongoLoaded] = useState(false);

  const pendingCreates = useRef(new Set());
  const pendingDeletes = useRef(new Set());
  const pendingUpdates = useRef(new Set());

  // Stores the latest edit version of each resume.
  // Only resumes present in this map are eligible for autosave.
  const dirtyVersions = useRef(new Map());

  const syncTimer = useRef(null);
  const accountRef = useRef(storagePrefix);

  const readMapping = useCallback(() => safeRead(mappingKey, {}), [mappingKey]);

  // Mark a resume as edited.
  const markResumeDirty = (id) => {
    const key = String(id);

    dirtyVersions.current.set(key, (dirtyVersions.current.get(key) || 0) + 1);
  };

  // Load only the signed-in user's resumes.
  useEffect(() => {
    let cancelled = false;

    accountRef.current = storagePrefix;

    clearTimeout(syncTimer.current);

    pendingCreates.current.clear();
    pendingDeletes.current.clear();
    pendingUpdates.current.clear();
    dirtyVersions.current.clear();

    setResumes([]);
    setActiveResumeId(null);
    setIsMongoLoaded(false);

    if (!isAuthenticated || !token || !user) {
      setIsMongoLoaded(true);

      return () => {
        cancelled = true;
      };
    }

    async function loadResumes() {
      try {
        const databaseResumes = await getResumes();

        if (cancelled) return;

        const normalized = databaseResumes
          .map(normalizeResume)
          .filter((item) => !isResumeBlank(item));

        const storedActiveId = localStorage.getItem(activeKey);

        const activeExists = normalized.some(
          (item) => String(item.id) === String(storedActiveId),
        );

        if (normalized.length > 0) {
          setResumes(normalized);

          setActiveResumeId(activeExists ? storedActiveId : normalized[0].id);
        } else {
          setResumes([]);
          setActiveResumeId(null);
        }
      } catch (error) {
        console.error("Could not load this user's resumes:", error.message);

        if (!cancelled) {
          const localResumes = safeRead(storageKey, []).filter(
            (item) => !isResumeBlank(item),
          );

          setResumes(localResumes);

          const storedActiveId = localStorage.getItem(activeKey);

          const activeExists = localResumes.some(
            (item) => String(item.id) === String(storedActiveId),
          );

          setActiveResumeId(
            activeExists ? storedActiveId : (localResumes[0]?.id ?? null),
          );

          notifyResumeError(
            "Could not load resumes from the server. Check your connection and try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsMongoLoaded(true);
        }
      }
    }

    loadResumes();

    return () => {
      cancelled = true;
      clearTimeout(syncTimer.current);
    };
  }, [storagePrefix, token, isAuthenticated, user, activeKey, storageKey]);

  // Save a separate local backup for the current account.
  useEffect(() => {
    if (!isAuthenticated || !user || !isMongoLoaded) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(resumes));
    } catch (error) {
      console.error("Could not back up resumes:", error);
    }
  }, [resumes, storageKey, isMongoLoaded, isAuthenticated, user]);

  // Remember the active resume.
  useEffect(() => {
    if (!isAuthenticated || !user || activeResumeId == null) return;

    localStorage.setItem(activeKey, String(activeResumeId));
  }, [activeResumeId, activeKey, isAuthenticated, user]);

  // Autosave ONLY resumes that have actually been edited or created.
  useEffect(() => {
    if (!isMongoLoaded || !isAuthenticated || !token || !user) {
      return;
    }

    clearTimeout(syncTimer.current);

    const accountAtSchedule = storagePrefix;

    syncTimer.current = setTimeout(async () => {
      if (accountRef.current !== accountAtSchedule) return;

      for (const item of resumes) {
        if (accountRef.current !== accountAtSchedule) return;

        const id = String(item.id);
        const version = dirtyVersions.current.get(id);

        // Skip resumes that have not been edited.
        if (version === undefined) continue;

        if (pendingDeletes.current.has(id)) continue;

        if (pendingCreates.current.has(id) || pendingUpdates.current.has(id)) {
          continue;
        }

        if (isMongoId(id)) {
          pendingUpdates.current.add(id);

          try {
            await updateResumeAPI(id, toResumePayload(item));

            if (accountRef.current !== accountAtSchedule) return;

            // Clear the dirty flag only if no newer edit happened.
            if (dirtyVersions.current.get(id) === version) {
              dirtyVersions.current.delete(id);
            }
          } catch (error) {
            notifyResumeError(
              error.message || "Could not automatically update your resume.",
            );
          } finally {
            pendingUpdates.current.delete(id);

            // If another edit happened during saving,
            // trigger another autosave cycle.
            if (dirtyVersions.current.has(id)) {
              setResumes((current) => [...current]);
            }
          }
        } else {
          pendingCreates.current.add(id);

          try {
            const saved = await createResumeAPI(toResumePayload(item));

            if (!saved?._id) {
              throw new Error("The server did not return the saved resume.");
            }

            if (accountRef.current !== accountAtSchedule) return;

            const newId = String(saved._id);
            const mapping = readMapping();

            mapping[id] = newId;

            localStorage.setItem(mappingKey, JSON.stringify(mapping));

            const latestVersion = dirtyVersions.current.get(id);
            const hasNewerEdits = latestVersion !== version;

            dirtyVersions.current.delete(id);

            if (hasNewerEdits) {
              dirtyVersions.current.set(newId, latestVersion);
            }

            setResumes((current) =>
              current.map((entry) =>
                String(entry.id) === id ? { ...entry, id: newId } : entry,
              ),
            );

            setActiveResumeId((current) =>
              String(current) === id ? newId : current,
            );
          } catch (error) {
            notifyResumeError(
              error.message || "Could not automatically save your new resume.",
            );
          } finally {
            pendingCreates.current.delete(id);

            if (dirtyVersions.current.has(id)) {
              setResumes((current) => [...current]);
            }
          }
        }
      }
    }, 800);

    return () => clearTimeout(syncTimer.current);
  }, [
    resumes,
    isMongoLoaded,
    isAuthenticated,
    token,
    user,
    storagePrefix,
    mappingKey,
    readMapping,
  ]);

  const resume =
    resumes.find((item) => String(item.id) === String(activeResumeId)) ||
    resumes[0] ||
    null;

  const updateActiveResume = (updater) => {
    if (!resume) return;

    markResumeDirty(resume.id);

    setResumes((previous) =>
      previous.map((item) =>
        String(item.id) === String(resume.id) ? updater(item) : item,
      ),
    );
  };

  const saveResume = async () => {
    if (!isMongoLoaded) {
      throw new Error("Please wait while your resumes finish loading.");
    }

    if (!isAuthenticated || !token) {
      throw new Error("Please log in to save your resume.");
    }

    if (!resume) {
      throw new Error("No resume is selected.");
    }

    const currentResume = resume;
    const id = String(currentResume.id);
    const version = dirtyVersions.current.get(id);

    clearTimeout(syncTimer.current);

    if (pendingDeletes.current.has(id)) {
      throw new Error("This resume is being deleted. Please try again.");
    }

    if (pendingCreates.current.has(id) || pendingUpdates.current.has(id)) {
      throw new Error("This resume is already being saved. Please try again.");
    }

    let saved;

    if (isMongoId(id)) {
      pendingUpdates.current.add(id);

      try {
        saved = await updateResumeAPI(id, toResumePayload(currentResume));
      } finally {
        pendingUpdates.current.delete(id);
      }

      if (version !== undefined && dirtyVersions.current.get(id) === version) {
        dirtyVersions.current.delete(id);
      }
    } else {
      pendingCreates.current.add(id);

      try {
        saved = await createResumeAPI(toResumePayload(currentResume));
      } finally {
        pendingCreates.current.delete(id);
      }
    }

    if (!saved?._id) {
      throw new Error("The server did not return a saved resume.");
    }

    const normalized = normalizeResume(saved);

    if (!isMongoId(id)) {
      const mapping = readMapping();

      mapping[id] = normalized.id;

      localStorage.setItem(mappingKey, JSON.stringify(mapping));

      const latestVersion = dirtyVersions.current.get(id);
      const hasNewerEdits =
        latestVersion !== undefined && latestVersion !== version;

      dirtyVersions.current.delete(id);

      if (hasNewerEdits) {
        dirtyVersions.current.set(normalized.id, latestVersion);
      }

      setResumes((current) =>
        current.map((item) =>
          String(item.id) === id
            ? hasNewerEdits
              ? { ...item, id: normalized.id }
              : normalized
            : item,
        ),
      );

      setActiveResumeId((current) =>
        String(current) === id ? normalized.id : current,
      );
    }

    return normalized;
  };

  const createResume = () => {
    const newResume = createNewResume();

    markResumeDirty(newResume.id);

    setResumes((previous) => [...previous, newResume]);
    setActiveResumeId(newResume.id);

    return newResume.id;
  };

  const selectResume = (id) => {
    setActiveResumeId(String(id));
  };

  const deleteResume = async (id) => {
    const targetId = String(id);

    if (!isAuthenticated || !token) {
      throw new Error("Please log in to manage resumes.");
    }

    if (pendingDeletes.current.has(targetId)) {
      throw new Error("This resume is already being deleted.");
    }

    pendingDeletes.current.add(targetId);

    try {
      if (isMongoId(targetId)) {
        await deleteResumeAPI(targetId);
      }

      dirtyVersions.current.delete(targetId);

      setResumes((previous) => {
        const updated = previous.filter((item) => String(item.id) !== targetId);

        if (updated.length === 0) {
          setActiveResumeId(null);
          return [];
        }

        if (String(activeResumeId) === targetId) {
          setActiveResumeId(updated[0].id);
        }

        return updated;
      });
    } catch (error) {
      throw new Error(error.message || "Could not delete resume.", {
        cause: error,
      });
    } finally {
      pendingDeletes.current.delete(targetId);
    }
  };

  const duplicateResume = async (id) => {
    if (!isMongoLoaded) {
      throw new Error("Please wait while your resumes finish loading.");
    }

    if (!isAuthenticated || !token) {
      throw new Error("Please log in to duplicate resumes.");
    }

    const original = resumes.find((item) => String(item.id) === String(id));

    if (!original) {
      throw new Error("Resume not found.");
    }

    const duplicated = {
      ...original,
      id: createNewResume().id,
      title: original.title ? `${original.title} Copy` : "My Resume Copy",
      personalInfo: { ...original.personalInfo },
      education: original.education.map((item) => ({ ...item })),
      experience: original.experience.map((item) => ({ ...item })),
      skills: original.skills.map((item) => ({ ...item })),
      projects: original.projects.map((item) => ({ ...item })),
      certifications: original.certifications.map((item) => ({ ...item })),
      languages: original.languages.map((item) => ({ ...item })),
    };

    const localId = String(duplicated.id);

    pendingCreates.current.add(localId);

    try {
      const saved = await createResumeAPI(toResumePayload(duplicated));

      if (!saved?._id) {
        throw new Error("The server did not return the duplicated resume.");
      }

      const normalized = normalizeResume(saved);
      const mapping = readMapping();

      mapping[localId] = normalized.id;

      localStorage.setItem(mappingKey, JSON.stringify(mapping));

      setResumes((previous) => [...previous, normalized]);
      setActiveResumeId(normalized.id);

      return normalized.id;
    } catch (error) {
      throw new Error(error.message || "Could not duplicate resume.", {
        cause: error,
      });
    } finally {
      pendingCreates.current.delete(localId);
    }
  };

  const updateResume = (updatedResume) => {
    markResumeDirty(updatedResume.id);

    setResumes((previous) =>
      previous.map((item) =>
        String(item.id) === String(updatedResume.id) ? updatedResume : item,
      ),
    );
  };

  const resetResume = () => {
    if (!resume) return;

    const reset = {
      ...createNewResume(),
      id: resume.id,
    };

    markResumeDirty(reset.id);

    setResumes((previous) =>
      previous.map((item) =>
        String(item.id) === String(resume.id) ? reset : item,
      ),
    );

    setActiveResumeId(reset.id);
  };

  const updatePersonalInfo = (field, value) => {
    updateActiveResume((item) => ({
      ...item,
      personalInfo: {
        ...item.personalInfo,
        [field]: value,
      },
    }));
  };

  const addSectionItem = (section, entry) => {
    updateActiveResume((item) => ({
      ...item,
      [section]: [...item[section], entry],
    }));
  };

  const updateSectionItem = (section, id, field, value) => {
    updateActiveResume((item) => ({
      ...item,
      [section]: item[section].map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    }));
  };

  const removeSectionItem = (section, id) => {
    updateActiveResume((item) => ({
      ...item,
      [section]: item[section].filter((entry) => entry.id !== id),
    }));
  };

  const addEducation = (item) => addSectionItem("education", item);

  const updateEducation = (id, field, value) =>
    updateSectionItem("education", id, field, value);

  const removeEducation = (id) => removeSectionItem("education", id);

  const addExperience = (item) => addSectionItem("experience", item);

  const updateExperience = (id, field, value) =>
    updateSectionItem("experience", id, field, value);

  const removeExperience = (id) => removeSectionItem("experience", id);

  const addSkill = (item) => addSectionItem("skills", item);

  const updateSkill = (id, field, value) =>
    updateSectionItem("skills", id, field, value);

  const removeSkill = (id) => removeSectionItem("skills", id);

  const addProject = (item) => addSectionItem("projects", item);

  const updateProject = (id, field, value) =>
    updateSectionItem("projects", id, field, value);

  const removeProject = (id) => removeSectionItem("projects", id);

  const addCertification = (item) => addSectionItem("certifications", item);

  const updateCertification = (id, field, value) =>
    updateSectionItem("certifications", id, field, value);

  const removeCertification = (id) => removeSectionItem("certifications", id);

  const addLanguage = (item) => addSectionItem("languages", item);

  const updateLanguage = (id, field, value) =>
    updateSectionItem("languages", id, field, value);

  const removeLanguage = (id) => removeSectionItem("languages", id);

  return (
    <ResumeContext.Provider
      value={{
        resume,
        resumes,
        activeResumeId,
        isMongoLoaded,
        setResume: updateResume,
        updateResume,
        resetResume,
        saveResume,
        createResume,
        selectResume,
        deleteResume,
        duplicateResume,
        updatePersonalInfo,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        addSkill,
        updateSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addCertification,
        updateCertification,
        removeCertification,
        addLanguage,
        updateLanguage,
        removeLanguage,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error("useResume must be used inside ResumeProvider");
  }

  return context;
}

export default ResumeContext;
