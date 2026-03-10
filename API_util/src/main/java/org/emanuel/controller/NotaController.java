package org.emanuel.controller;

import jakarta.validation.Valid;
import org.emanuel.model.Nota;
import org.emanuel.repository.AtividadeRepository;
import org.emanuel.repository.NotaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotaController {

    private final NotaRepository notaRepo;
    private final AtividadeRepository atividadeRepo;

    public NotaController(NotaRepository notaRepo, AtividadeRepository atividadeRepo) {
        this.notaRepo = notaRepo;
        this.atividadeRepo = atividadeRepo;
    }

    @GetMapping("/atividades/{atividadeId}/notas")
    public ResponseEntity<List<Nota>> listar(@PathVariable Long atividadeId) {
        if (!atividadeRepo.existsById(atividadeId)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(notaRepo.findByAtividadeIdOrderByDataCriacaoDesc(atividadeId));
    }

    @PostMapping("/atividades/{atividadeId}/notas")
    public ResponseEntity<Nota> criar(@PathVariable Long atividadeId,
                                      @Valid @RequestBody Nota nota) {
        return atividadeRepo.findById(atividadeId).map(atividade -> {
            nota.setAtividade(atividade);
            return ResponseEntity.ok(notaRepo.save(nota));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/notas/{id}")
    public ResponseEntity<Nota> atualizar(@PathVariable Long id,
                                          @Valid @RequestBody Nota dados) {
        return notaRepo.findById(id).map(nota -> {
            nota.setConteudo(dados.getConteudo());
            nota.setDataLembrete(dados.getDataLembrete());
            nota.setLembreteAtivo(dados.isLembreteAtivo());
            if (!dados.isLembreteAtivo()) nota.setLembreteEnviado(false);
            return ResponseEntity.ok(notaRepo.save(nota));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/notas/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!notaRepo.existsById(id)) return ResponseEntity.notFound().build();
        notaRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Lembretes ativos nao enviados — frontend faz polling aqui
    @GetMapping("/notas/lembretes")
    public List<Nota> lembretesAtivos() {
        return notaRepo.findByLembreteAtivoTrueAndLembreteEnviadoFalse();
    }
}
