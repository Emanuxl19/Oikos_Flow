package org.emanuel.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.emanuel.model.Atividade;
import org.emanuel.model.Configuracao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AISearchService {

    private static final Logger log = LoggerFactory.getLogger(AISearchService.class);

    private final ConfiguracaoService configuracaoService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AISearchService(ConfiguracaoService configuracaoService,
                           RestTemplate restTemplate,
                           ObjectMapper objectMapper) {
        this.configuracaoService = configuracaoService;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Retorna IDs das atividades mais relevantes para a query usando IA.
     * Se nao houver provedor configurado, retorna lista vazia.
     */
    public List<Long> buscarComIA(String query, List<Atividade> atividades) {
        if (atividades.isEmpty()) return List.of();

        Configuracao config = configuracaoService.getConfig();
        String provider = config.getAiProvider();

        if (provider == null || provider.isBlank() || provider.equalsIgnoreCase("none")) {
            return List.of();
        }

        String prompt = buildPrompt(query, atividades);

        try {
            String resposta = switch (provider.toLowerCase()) {
                case "claude"  -> callClaude(config, prompt);
                case "openai"  -> callOpenAI(config, prompt);
                case "gemini"  -> callGemini(config, prompt);
                case "ollama"  -> callOllama(config, prompt);
                default        -> null;
            };

            if (resposta == null || resposta.isBlank()) return List.of();

            JsonNode json = objectMapper.readTree(extractJson(resposta));
            List<Long> ids = new ArrayList<>();
            json.path("ids").forEach(n -> ids.add(n.asLong()));
            return ids;

        } catch (Exception e) {
            log.error("Erro na busca IA ({}): {}", provider, e.getMessage());
            return List.of();
        }
    }

    // -------------------------------------------------------
    // Provedores
    // -------------------------------------------------------

    private String callClaude(Configuracao config, String prompt) {
        String url = "https://api.anthropic.com/v1/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", config.getAiApiKey());
        headers.set("anthropic-version", "2023-06-01");

        String model = defaultIfBlank(config.getAiModel(), "claude-haiku-4-5-20251001");

        Map<String, Object> body = Map.of(
            "model", model,
            "max_tokens", 256,
            "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.POST, new HttpEntity<>(body, headers), String.class);

        JsonNode root = parseJson(response.getBody());
        return root.path("content").get(0).path("text").asText();
    }

    private String callOpenAI(Configuracao config, String prompt) {
        String baseUrl = defaultIfBlank(config.getAiBaseUrl(), "https://api.openai.com");
        String url = baseUrl + "/v1/chat/completions";
        String model = defaultIfBlank(config.getAiModel(), "gpt-4o-mini");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(config.getAiApiKey());

        Map<String, Object> body = Map.of(
            "model", model,
            "messages", List.of(
                Map.of("role", "system", "content", "Voce e um assistente de busca de atividades. Responda somente com JSON."),
                Map.of("role", "user", "content", prompt)
            )
        );

        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.POST, new HttpEntity<>(body, headers), String.class);

        JsonNode root = parseJson(response.getBody());
        return root.path("choices").get(0).path("message").path("content").asText();
    }

    private String callGemini(Configuracao config, String prompt) {
        String model = defaultIfBlank(config.getAiModel(), "gemini-1.5-flash");
        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                   + model + ":generateContent?key=" + config.getAiApiKey();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.POST, new HttpEntity<>(body, headers), String.class);

        JsonNode root = parseJson(response.getBody());
        return root.path("candidates").get(0)
                   .path("content").path("parts").get(0)
                   .path("text").asText();
    }

    private String callOllama(Configuracao config, String prompt) {
        String base = defaultIfBlank(config.getAiOllamaUrl(), "http://localhost:11434");
        String url = base + "/api/chat";
        String model = defaultIfBlank(config.getAiModel(), "qwen2.5");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "model", model,
            "stream", false,
            "messages", List.of(
                Map.of("role", "system", "content", "Voce e um assistente de busca de atividades. Responda somente com JSON."),
                Map.of("role", "user", "content", prompt)
            )
        );

        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.POST, new HttpEntity<>(body, headers), String.class);

        JsonNode root = parseJson(response.getBody());
        return root.path("message").path("content").asText();
    }

    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    private String buildPrompt(String query, List<Atividade> atividades) {
        StringBuilder sb = new StringBuilder();
        sb.append("Voce e um assistente de busca de atividades e tarefas.\n");
        sb.append("Com base na consulta do usuario, identifique as atividades mais relevantes.\n");
        sb.append("Retorne APENAS um JSON no formato exato: {\"ids\": [1, 2, 3]}\n\n");
        sb.append("Consulta: \"").append(query).append("\"\n\n");
        sb.append("Atividades disponíveis:\n");

        for (Atividade a : atividades) {
            sb.append("ID: ").append(a.getId())
              .append(" | Titulo: ").append(a.getTitulo())
              .append(" | Tipo: ").append(a.getTipo())
              .append(" | Status: ").append(a.getStatus())
              .append(" | Materia: ").append(a.getMateria() != null ? a.getMateria() : "-")
              .append(" | Descricao: ");

            if (a.getDescricao() != null) {
                sb.append(a.getDescricao(), 0, Math.min(80, a.getDescricao().length()));
            }
            sb.append("\n");
        }

        return sb.toString();
    }

    private String extractJson(String text) {
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}") + 1;
        if (start >= 0 && end > start) return text.substring(start, end);
        return "{\"ids\":[]}";
    }

    private JsonNode parseJson(String body) {
        try {
            return objectMapper.readTree(body);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao parsear resposta da IA: " + e.getMessage());
        }
    }

    private String defaultIfBlank(String value, String fallback) {
        return (value == null || value.isBlank()) ? fallback : value;
    }
}
