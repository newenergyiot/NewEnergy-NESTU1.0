// sw.js - Service Worker para Web Push
self.addEventListener('push', function(event) {
    if (!event.data) return;
    
    const dados = event.data.json();
    const titulo = dados.title || "Alerta NewEnergy";
    const opcoes = {
        body: dados.body || "Atenção: Sensor fora da faixa ideal!",
        icon: "/icon.png", // Opcional: coloque um ícone se tiver
        badge: "/badge.png",
        vibrate: [200, 100, 200],
        data: { url: dados.url || "/" }
    };

    event.waitUntil(
        self.registration.showNotification(titulo, opcoes)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
