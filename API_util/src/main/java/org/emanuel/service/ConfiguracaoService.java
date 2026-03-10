package org.emanuel.service;

import org.emanuel.model.Configuracao;
import org.emanuel.repository.ConfiguracaoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class ConfiguracaoService {

    private final ConfiguracaoRepository repo;

    @Value("${ai.provider:none}")
    private String defaultAiProvider;

    @Value("${ai.api.key:}")
    private String defaultAiApiKey;

    @Value("${ai.model:}")
    private String defaultAiModel;

    @Value("${ai.base-url:}")
    private String defaultAiBaseUrl;

    @Value("${ai.ollama-url:http://localhost:11434}")
    private String defaultOllamaUrl;

    public ConfiguracaoService(ConfiguracaoRepository repo) {
        this.repo = repo;
    }

    // Inicializa config no banco com valores do application.properties se nao existir
    @PostConstruct
    public void inicializar() {
        if (repo.count() == 0) {
            Configuracao config = new Configuracao();
            config.setId(1L);
            config.setAiProvider(defaultAiProvider);
            config.setAiApiKey(defaultAiApiKey);
            config.setAiModel(defaultAiModel);
            config.setAiBaseUrl(defaultAiBaseUrl);
            config.setAiOllamaUrl(defaultOllamaUrl);
            repo.save(config);
        }
    }

    public Configuracao getConfig() {
        return repo.findById(1L).orElseGet(() -> {
            Configuracao c = new Configuracao();
            c.setId(1L);
            return c;
        });
    }

    public Configuracao salvar(Configuracao config) {
        config.setId(1L);
        return repo.save(config);
    }
}
