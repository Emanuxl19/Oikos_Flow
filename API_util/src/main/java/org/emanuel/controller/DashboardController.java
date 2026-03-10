package org.emanuel.controller;

import org.emanuel.model.Atividade;
import org.emanuel.model.enums.Prioridade;
import org.emanuel.model.enums.StatusAtividade;
import org.emanuel.model.enums.TipoAtividade;
import org.emanuel.repository.AtividadeRepository;
import org.emanuel.repository.NotaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final AtividadeRepository atividadeRepo;
    private final NotaRepository notaRepo;

    public DashboardController(AtividadeRepository atividadeRepo, NotaRepository notaRepo) {
        this.atividadeRepo = atividadeRepo;
        this.notaRepo = notaRepo;
    }

    @GetMapping
    public Map<String, Object> stats() {
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime fimDia    = LocalDate.now().atTime(23, 59, 59);
        LocalDateTime agora     = LocalDateTime.now();

        long total      = atividadeRepo.count();
        long pendentes  = atividadeRepo.countByStatus(StatusAtividade.PENDENTE);
        long emAndamento= atividadeRepo.countByStatus(StatusAtividade.EM_ANDAMENTO);
        long concluidas = atividadeRepo.countByStatus(StatusAtividade.CONCLUIDA);
        long atrasadas  = atividadeRepo.findAtrasadas(agora).size();
        long hoje       = atividadeRepo.findHoje(inicioDia, fimDia).size();
        long lembretes  = notaRepo.findByLembreteAtivoTrueAndLembreteEnviadoFalse().size();

        Map<String, Long> porTipo = new LinkedHashMap<>();
        for (TipoAtividade tipo : TipoAtividade.values()) {
            porTipo.put(tipo.name(), atividadeRepo.countByTipo(tipo));
        }

        Map<String, Long> porPrioridade = new LinkedHashMap<>();
        for (Prioridade p : Prioridade.values()) {
            porPrioridade.put(p.name(), atividadeRepo.countByPrioridade(p));
        }

        List<Atividade> proximas = atividadeRepo.findProximas()
                .stream().limit(5).toList();

        Map<String, Object> resultado = new LinkedHashMap<>();
        resultado.put("totalAtividades",       total);
        resultado.put("pendentes",             pendentes);
        resultado.put("emAndamento",           emAndamento);
        resultado.put("concluidas",            concluidas);
        resultado.put("atrasadas",             atrasadas);
        resultado.put("hoje",                  hoje);
        resultado.put("lembretesPendentes",    lembretes);
        resultado.put("porTipo",               porTipo);
        resultado.put("porPrioridade",         porPrioridade);
        resultado.put("proximasAtividades",    proximas);

        return resultado;
    }
}
