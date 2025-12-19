(function () {
  fetch("https://site-backend.dom-falcone-official.workers.dev", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page: window.location.pathname
    })
  }).catch(() => {});
})();