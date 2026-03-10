package org.emanuel.repository;

import org.emanuel.model.Atividade;
import org.emanuel.model.enums.Prioridade;
import org.emanuel.model.enums.StatusAtividade;
import org.emanuel.model.enums.TipoAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    // Atividades com prazo hoje (nao concluidas/canceladas)
    @Query("SELECT a FROM Atividade a WHERE a.prazo >= :inicio AND a.prazo <= :fim " +
           "AND a.status NOT IN ('CONCLUIDA', 'CANCELADA') ORDER BY a.prazo ASC")
    List<Atividade> findHoje(@Param("inicio") LocalDateTime inicio,
                              @Param("fim") LocalDateTime fim);

    // Atividades atrasadas (prazo < agora e nao concluidas/canceladas)
    @Query("SELECT a FROM Atividade a WHERE a.prazo < :agora " +
           "AND a.status NOT IN ('CONCLUIDA', 'CANCELADA') ORDER BY a.prazo ASC")
    List<Atividade> findAtrasadas(@Param("agora") LocalDateTime agora);

    List<Atividade> findByMateriaIgnoreCaseOrderByPrazoAsc(String materia);

    List<Atividade> findByTipoOrderByPrazoAsc(TipoAtividade tipo);

    List<Atividade> findByStatusOrderByPrazoAsc(StatusAtividade status);

    List<Atividade> findByPrioridadeOrderByPrazoAsc(Prioridade prioridade);

    // Busca textual simples
    @Query("SELECT a FROM Atividade a WHERE " +
           "LOWER(a.titulo) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.descricao) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.materia) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.categoria) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Atividade> buscarPorTexto(@Param("q") String q);

    // Proximas atividades (pendentes ordenadas por prazo)
    @Query("SELECT a FROM Atividade a WHERE a.status = 'PENDENTE' AND a.prazo IS NOT NULL " +
           "ORDER BY a.prazo ASC")
    List<Atividade> findProximas();

    // Contagens para dashboard
    long countByStatus(StatusAtividade status);
    long countByTipo(TipoAtividade tipo);
    long countByPrioridade(Prioridade prioridade);
}
