package com.cicarus.notification.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;

@Component
public class WebSocketEventListener {
    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        Principal user = event.getUser();
        System.out.println("🟢 Conexão STOMP recebida de: " + (user != null ? user.getName() : "usuário anônimo"));
    }

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();
        Principal user = accessor.getUser();

        System.out.println("🔔 Cliente " + (user != null ? user.getName() : "desconhecido") +
                " se inscreveu no canal: " + destination);
    }
}
