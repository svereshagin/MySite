// Utility functions for JWT authentication with automatic token refresh

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

interface RefreshResponse {
  access_token: string
}

export const makeAuthenticatedRequest = async (url: string, options: RequestOptions = {}): Promise<Response> => {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
    credentials: "include", // Important: includes cookies for refresh token
  })

  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshResponse = await fetch("/api/v1/refresh", {
      method: "POST",
      credentials: "include", // Sends refresh token cookie
    })

    if (refreshResponse.ok) {
      const { access_token }: RefreshResponse = await refreshResponse.json()
      sessionStorage.setItem("access_token", access_token)

      // Retry original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${access_token}`,
        },
        credentials: "include",
      })
    } else {
      // Refresh failed - clear tokens and redirect to login
      sessionStorage.removeItem("access_token")
      window.location.href = "/login"
      throw new Error("Authentication failed")
    }
  }

  return response
}

export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem("access_token")
}

export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint to clear refresh token cookie
    await fetch("/api/v1/logout", {
      method: "POST",
      credentials: "include",
    })
  } catch (error) {
    console.error("Logout error:", error)
  }

  // Clear access token from sessionStorage
  sessionStorage.removeItem("access_token")
  // Refresh token cookie is cleared by server
}
