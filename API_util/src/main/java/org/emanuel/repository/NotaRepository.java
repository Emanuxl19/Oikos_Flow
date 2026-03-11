package org.emanuel.repository;

import org.emanuel.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByAtividadeIdOrderByDataCriacaoDesc(Long atividadeId);

    long countByLembreteAtivoTrueAndLembreteEnviadoFalse();

    List<Nota> findByLembreteAtivoTrueAndLembreteEnviadoFalse();

    List<Nota> findTop20ByLembreteAtivoTrueAndLembreteEnviadoFalseAndDataLembreteLessThanEqualOrderByDataLembreteAsc(
            LocalDateTime agora
    );

    List<Nota> findTop50ByLembreteAtivoTrueAndLembreteEnviadoFalseAndDataLembreteLessThanEqualOrderByDataLembreteAsc(
            LocalDateTime agora
    );
}
