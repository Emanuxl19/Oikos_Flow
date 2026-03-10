package org.emanuel.controller;

import jakarta.validation.Valid;
import org.emanuel.model.Atividade;
import org.emanuel.model.enums.Prioridade;
import org.emanuel.model.enums.StatusAtividade;
import org.emanuel.model.enums.TipoAtividade;
import org.emanuel.repository.AtividadeRepository;
import org.emanuel.service.AtividadeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atividades")
public class AtividadeController {

    private final AtividadeService service;
    private final AtividadeRepository repo;

    public AtividadeController(AtividadeService service, AtividadeRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping
    public List<Atividade> listar(
            @RequestParam(required = false) TipoAtividade tipo,
            @RequestParam(required = false) StatusAtividade status,
            @RequestParam(required = false) Prioridade prioridade,
            @RequestParam(required = false) String materia) {

        if (tipo != null)       return repo.findByTipoOrderByPrazoAsc(tipo);
        if (status != null)     return repo.findByStatusOrderByPrazoAsc(status);
        if (prioridade != null) return repo.findByPrioridadeOrderByPrazoAsc(prioridade);
        if (materia != null)    return repo.findByMateriaIgnoreCaseOrderByPrazoAsc(materia);

        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atividade> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hoje")
    public List<Atividade> hoje() {
        return service.buscarHoje();
    }

    @GetMapping("/atrasadas")
    public List<Atividade> atrasadas() {
        return service.buscarAtrasadas();
    }

    @GetMapping("/proximas")
    public List<Atividade> proximas() {
        return repo.findProximas();
    }

    @GetMapping("/por-materia/{materia}")
    public List<Atividade> porMateria(@PathVariable String materia) {
        return repo.findByMateriaIgnoreCaseOrderByPrazoAsc(materia);
    }

    @GetMapping("/por-tipo/{tipo}")
    public List<Atividade> porTipo(@PathVariable TipoAtividade tipo) {
        return repo.findByTipoOrderByPrazoAsc(tipo);
    }

    @GetMapping("/busca")
    public List<Atividade> buscar(
            @RequestParam String q,
            @RequestParam(defaultValue = "false") boolean useAI) {
        return service.buscar(q, useAI);
    }

    @PostMapping
    public ResponseEntity<Atividade> criar(@Valid @RequestBody Atividade atividade) {
        return ResponseEntity.ok(service.salvar(atividade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atividade> atualizar(@PathVariable Long id,
                                               @Valid @RequestBody Atividade dados) {
        return service.buscarPorId(id).map(existente -> {
            existente.setTitulo(dados.getTitulo());
            existente.setDescricao(dados.getDescricao());
            existente.setTipo(dados.getTipo());
            existente.setCategoria(dados.getCategoria());
            existente.setMateria(dados.getMateria());
            existente.setPrioridade(dados.getPrioridade());
            existente.setStatus(dados.getStatus());
            existente.setPrazo(dados.getPrazo());
            existente.setTempoEstimado(dados.getTempoEstimado());
            existente.setValor(dados.getValor());
            return ResponseEntity.ok(service.salvar(existente));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Atividade> concluir(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.concluir(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
