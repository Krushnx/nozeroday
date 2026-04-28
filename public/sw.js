self.addEventListener("push", function (event) {
  let data = {};

  try {
    data = event.data.json();
  } catch {
    data = {
      title: "Notification",
      body: event.data?.text() || "New update",
    };
  }

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icon.png",
    badge: "/icon.png",
  });
});