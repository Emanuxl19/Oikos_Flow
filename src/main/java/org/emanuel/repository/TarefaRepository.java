package org.emanuel.repository;

    import org.emanuel.model.Tarefa;
    import org.springframework.data.jpa.repository.JpaRepository;
public interface TarefaRepository extends JpaRepository<Tarefa,Long> {
}
