const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Ошибка запроса: ${response.status}`;

    try {
      const error = await response.json();
      message = error.detail ?? error.message ?? message;
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const ApiClient = {
  get(path) {
    return request(path);
  },

  post(path, data) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  patch(path, data) {
    return request(path, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(path) {
    return request(path, {
      method: "DELETE",
    });
  },
};
