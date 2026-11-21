self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {
    title: 'Push Event Data Title Missing',
    body : 'Push Event Data Body Missing'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || '/', self.location.origin
  ).href;

  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    for (const client of windowClients) {
      if (client.url === targetUrl && 'focus' in client) {
        return await client.focus();
      }
    }
    for (const client of windowClients) {
      if (client.url.startsWith(self.location.origin) && 'focus' in client) {
        const navigatedClient = await client.navigate(targetUrl);
        return await navigatedClient?.focus();
      }
    }
    if (clients.openWindow) {
      return await clients.openWindow(targetUrl);
    }
  })());
});