self.addEventListener("push", (event) => {
    if (!event.data) {
      console.error("Push event has no data");
      return;
    }
  
    const data = event.data.json();
  
    self.registration.showNotification(data.title, {
      body: data.message, // Use `body` instead of `message`
      icon: data.icon,
    });
  
    self.clients.matchAll().then((clients) => {
      if (clients.length === 0) {
        console.log("No clients are currently connected.");
      } else {
        clients.forEach((client) => {
          console.log("Sending notification to client:", client);
          client.postMessage(data);
        });
      }
    }).catch((error) => {
      console.error("Error sending notification to clients:", error);
    });
  });
