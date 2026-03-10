package org.emanuel.repository;

import org.emanuel.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByAtividadeIdOrderByDataCriacaoDesc(Long atividadeId);

    List<Nota> findByLembreteAtivoTrueAndLembreteEnviadoFalse();

    // Lembretes que ja venceram e ainda nao foram enviados
    @Query("SELECT n FROM Nota n WHERE n.lembreteAtivo = true AND n.lembreteEnviado = false " +
           "AND n.dataLembrete <= :agora")
    List<Nota> findLembretesVencidos(@Param("agora") LocalDateTime agora);
}
