const headers = { "Content-Type": "application/json" };

export async function identify(params = {}) {
  try {
    const resp = await fetch("/portal/api/identify", {
      method: "POST",
      body: JSON.stringify(params),
      headers,
    });

    return await resp.json();
  } catch (e) {
    console.error(e);
    return { error: "Error sending request" };
  }
}

export async function notify(params = {}) {
  try {
    const resp = await fetch("/portal/api/notify", {
      method: "POST",
      body: JSON.stringify(params),
      headers,
    });

    return await resp.json();
  } catch (e) {
    console.error(e);
    return { error: "Error sending request" };
  }
}
