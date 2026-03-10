package org.emanuel.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class TelegramService {

    private static final Logger log = LoggerFactory.getLogger(TelegramService.class);
    private static final String TELEGRAM_API = "https://api.telegram.org/bot%s/sendMessage";

    private final ConfiguracaoService configuracaoService;
    private final RestTemplate restTemplate;

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.chat.id:}")
    private String chatId;

    public TelegramService(ConfiguracaoService configuracaoService, RestTemplate restTemplate) {
        this.configuracaoService = configuracaoService;
        this.restTemplate = restTemplate;
    }

    public boolean enviarMensagem(String texto) {
        var config = configuracaoService.getConfig();

        if (!config.isLembretesTelegramAtivos()) return false;

        if (botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            log.warn("Telegram padrao nao configurado no ambiente (telegram.bot.token / telegram.chat.id).");
            return false;
        }

        try {
            String url = String.format(TELEGRAM_API, botToken);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of(
                "chat_id", chatId,
                "text", texto,
                "parse_mode", "HTML"
            );

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Mensagem Telegram enviada para chat {}", chatId);
                return true;
            }
        } catch (Exception e) {
            log.error("Erro ao enviar mensagem Telegram: {}", e.getMessage());
        }
        return false;
    }

    public boolean testarConexao() {
        return enviarMensagem("<b>Gestor de Atividades</b>\nConexao com Telegram funcionando!");
    }
}
