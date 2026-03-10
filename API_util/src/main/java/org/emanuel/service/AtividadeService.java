package org.emanuel.service;

import org.emanuel.model.Atividade;
import org.emanuel.model.enums.StatusAtividade;
import org.emanuel.repository.AtividadeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AtividadeService {

    private final AtividadeRepository repo;
    private final AISearchService aiSearchService;

    public AtividadeService(AtividadeRepository repo, AISearchService aiSearchService) {
        this.repo = repo;
        this.aiSearchService = aiSearchService;
    }

    public List<Atividade> listarTodas() {
        return repo.findAll();
    }

    public Optional<Atividade> buscarPorId(Long id) {
        return repo.findById(id);
    }

    public Atividade salvar(Atividade atividade) {
        return repo.save(atividade);
    }

    public void deletar(Long id) {
        repo.deleteById(id);
    }

    public List<Atividade> buscarHoje() {
        LocalDateTime inicio = LocalDate.now().atStartOfDay();
        LocalDateTime fim    = LocalDate.now().atTime(23, 59, 59);
        return repo.findHoje(inicio, fim);
    }

    public List<Atividade> buscarAtrasadas() {
        return repo.findAtrasadas(LocalDateTime.now());
    }

    /**
     * Busca textual. Se useAI = true e houver provedor configurado,
     * reordena os resultados pela relevancia indicada pela IA.
     */
    public List<Atividade> buscar(String query, boolean useAI) {
        List<Atividade> resultados = repo.buscarPorTexto(query);

        if (!useAI || resultados.isEmpty()) return resultados;

        List<Long> idsOrdenados = aiSearchService.buscarComIA(query, resultados);
        if (idsOrdenados.isEmpty()) return resultados;

        // Reordena conforme ranking da IA
        return resultados.stream()
            .filter(a -> idsOrdenados.contains(a.getId()))
            .sorted(Comparator.comparingInt(a -> idsOrdenados.indexOf(a.getId())))
            .toList();
    }

    public Atividade concluir(Long id) {
        Atividade a = repo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Atividade nao encontrada: " + id));
        a.setStatus(StatusAtividade.CONCLUIDA);
        return repo.save(a);
    }
}
