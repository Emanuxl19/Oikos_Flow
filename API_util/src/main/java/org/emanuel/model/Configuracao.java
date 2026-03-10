package org.emanuel.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuracao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Configuracao {

    @Id
    private Long id = 1L;

    // AI Provider: claude | openai | gemini | ollama | none
    private String aiProvider;

    @Column(columnDefinition = "TEXT")
    private String aiApiKey;

    private String aiModel;

    // Base URL para provedores OpenAI-compativeis (DeepSeek, Qwen, Kimi...)
    private String aiBaseUrl;

    // URL do Ollama local (ex: http://localhost:11434)
    private String aiOllamaUrl;

    @Column(columnDefinition = "TEXT")
    private String telegramBotToken;

    private String telegramChatId;

    private boolean lembretesTelegramAtivos = false;
}
