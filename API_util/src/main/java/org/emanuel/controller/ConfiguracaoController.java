package org.emanuel.controller;

import org.emanuel.model.Configuracao;
import org.emanuel.service.ConfiguracaoService;
import org.emanuel.service.TelegramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/configuracao")
public class ConfiguracaoController {

    private final ConfiguracaoService service;
    private final TelegramService telegramService;

    public ConfiguracaoController(ConfiguracaoService service, TelegramService telegramService) {
        this.service = service;
        this.telegramService = telegramService;
    }

    @GetMapping
    public Configuracao buscar() {
        Configuracao config = service.getConfig();
        // Mascara a API key na resposta (exibe apenas os ultimos 4 chars)
        if (config.getAiApiKey() != null && config.getAiApiKey().length() > 4) {
            config.setAiApiKey("****" + config.getAiApiKey()
                    .substring(config.getAiApiKey().length() - 4));
        }
        return config;
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> salvar(@RequestBody Configuracao config) {
        // Se a API key vier mascarada (****), mantem a existente
        Configuracao atual = service.getConfig();
        if (config.getAiApiKey() != null && config.getAiApiKey().startsWith("****")) {
            config.setAiApiKey(atual.getAiApiKey());
        }
        service.salvar(config);
        return ResponseEntity.ok(Map.of("mensagem", "Configuracao salva com sucesso"));
    }

    @PostMapping("/testar-telegram")
    public ResponseEntity<Map<String, Object>> testarTelegram() {
        boolean ok = telegramService.testarConexao();
        return ResponseEntity.ok(Map.of(
            "sucesso", ok,
            "mensagem", ok ? "Mensagem enviada com sucesso!" : "Falha ao enviar. Verifique token e chatId."
        ));
    }
}
