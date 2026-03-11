package org.emanuel.scheduler;

import org.emanuel.model.Nota;
import org.emanuel.repository.NotaRepository;
import org.emanuel.service.TelegramService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class LembreteScheduler {

    private static final Logger log = LoggerFactory.getLogger(LembreteScheduler.class);

    private final NotaRepository notaRepo;
    private final TelegramService telegramService;

    public LembreteScheduler(NotaRepository notaRepo, TelegramService telegramService) {
        this.notaRepo = notaRepo;
        this.telegramService = telegramService;
    }

    @Scheduled(fixedDelayString = "${app.lembrete.intervalo-ms:60000}")
    public void verificarLembretes() {
        List<Nota> vencidos = notaRepo
                .findTop50ByLembreteAtivoTrueAndLembreteEnviadoFalseAndDataLembreteLessThanEqualOrderByDataLembreteAsc(
                        LocalDateTime.now()
                );

        if (vencidos.isEmpty()) return;

        log.info("Processando {} lembrete(s) vencido(s)", vencidos.size());

        for (Nota nota : vencidos) {
            String titulo = nota.getAtividade() != null
                    ? nota.getAtividade().getTitulo()
                    : "Atividade";

            String mensagem = String.format(
                "<b>Lembrete: %s</b>\n\n%s",
                titulo,
                nota.getConteudo()
            );

            boolean enviado = telegramService.enviarMensagem(mensagem);

            // Marca como enviado independente do Telegram estar ativo
            // (para nao reprocessar em loop)
            nota.setLembreteEnviado(true);
            notaRepo.save(nota);

            if (enviado) {
                log.info("Lembrete enviado via Telegram para nota id={}", nota.getId());
            } else {
                log.debug("Telegram inativo - lembrete id={} marcado como enviado", nota.getId());
            }
        }
    }
}
