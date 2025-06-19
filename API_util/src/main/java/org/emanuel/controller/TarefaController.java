package org.emanuel.controller;

    import org.emanuel.model.Tarefa;
    import org.emanuel.repository.TarefaRepository;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.Optional;

@RestController
    @RequestMapping("/tarefas")
public class TarefaController {

    private final TarefaRepository tarefaRepository;

    public TarefaController(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }
    @GetMapping
    public List<Tarefa> listar(){
        return tarefaRepository.findAll();
    }
    @PostMapping
    public ResponseEntity<Tarefa> criarTarefa(@RequestBody Tarefa novaTarefa){
        Tarefa salva = tarefaRepository.save(novaTarefa);
        return ResponseEntity.ok(salva);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizarTarefa(@PathVariable Long id, @RequestBody Tarefa novaTarefa){
       Optional<Tarefa> optional = tarefaRepository.findById(id);
       if (optional.isEmpty()) {
           return ResponseEntity.notFound().build();
       }

       Tarefa existente = optional.get();
       existente.setDescricao(novaTarefa.getDescricao());
       existente.setConcluida(novaTarefa.isConcluida());

       Tarefa atualizado = tarefaRepository.save(existente);
       return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTarefa(@PathVariable Long id){
            if (!tarefaRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

        tarefaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}