export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const options: RequestInit = { ...init, credentials: "include" };

  let res = await fetch(input, options);

  if (res.status === 401) {
    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      window.location.href = "/login";
      return res;
    }

    res = await fetch(input, options);
  }

  return res;
}
