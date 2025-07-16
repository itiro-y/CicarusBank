package com.cicarus.notification.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;


public class UserHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        String userId = null;

        if (request instanceof ServletServerHttpRequest servletRequest) {
            var queryParams = servletRequest.getServletRequest().getParameterMap();
            if (queryParams.containsKey("userId")) {
                userId = queryParams.get("userId")[0];
            }
        }

        if (userId != null && !userId.isEmpty()) {
            attributes.put("user", new StompPrincipal(userId));
            return true;
        }

        System.out.println("⚠️ userId não fornecido no query param!");
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
        // nada aqui
    }

}
