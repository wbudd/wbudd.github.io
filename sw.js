self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {
    title: 'Push Event Data Title Missing',
    body : 'Push Event Data Body Missing'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/web-app-manifest-192x192.png'
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
});