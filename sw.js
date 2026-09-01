// sw.js - Service Worker para Web Push (NewEnergy)

self.addEventListener('push', function(event) {
    if (!event.data) return;
    
    let dados = {};
    try {
        dados = event.data.json();
    } catch (e) {
        dados = { title: "Alerta NewEnergy", body: event.data.text() };
    }

    const titulo = dados.title || "Alerta NewEnergy";
    const opcoes = {
        body: dados.body || "Atenção: Sensor fora da faixa ideal de temperatura!",
        vibrate: [200, 100, 200],
        data: { url: dados.url || "/" }
    };

    event.waitUntil(
        self.registration.showNotification(titulo, opcoes)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const urlParaAbrir = event.notification.data.url || "/";

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(urlParaAbrir);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlParaAbrir);
            }
        })
    );
});
