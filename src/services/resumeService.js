const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/resumes`;

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("resumeAI_token");

  if (!token) {
    throw new Error("Please log in to save your resume.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("resumeAI_token");
    localStorage.removeItem("resumeAI_user");

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }

    throw new Error("Your session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export const getResumes = async () => {
  const data = await apiRequest(API_URL);
  return data.resumes;
};

export const getResumeById = async (id) => {
  const data = await apiRequest(`${API_URL}/${encodeURIComponent(id)}`);
  return data.resume;
};

export const createResume = async (resumeData) => {
  const data = await apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify(resumeData),
  });
  return data.resume;
};

export const updateResume = async (id, resumeData) => {
  const data = await apiRequest(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(resumeData),
  });
  return data.resume;
};

export const deleteResume = async (id) => {
  return apiRequest(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};
