package org.emanuel.repository;

import org.emanuel.model.Transacao;
import org.emanuel.model.enums.TipoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByUsuarioIdOrderByDataDesc(Long usuarioId);

    List<Transacao> findByUsuarioIdAndTipoOrderByDataDesc(Long usuarioId, TipoTransacao tipo);

    List<Transacao> findByUsuarioIdAndDataBetweenOrderByDataDesc(Long usuarioId, LocalDate inicio, LocalDate fim);

    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t WHERE t.usuario.id = :uid AND t.tipo = :tipo")
    BigDecimal sumByUsuarioIdAndTipo(@Param("uid") Long usuarioId, @Param("tipo") TipoTransacao tipo);

    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t WHERE t.usuario.id = :uid AND t.tipo = :tipo AND t.data BETWEEN :inicio AND :fim")
    BigDecimal sumByUsuarioIdAndTipoAndDataBetween(@Param("uid") Long usuarioId, @Param("tipo") TipoTransacao tipo, @Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT t.categoria, SUM(t.valor) FROM Transacao t WHERE t.usuario.id = :uid AND t.tipo = :tipo GROUP BY t.categoria ORDER BY SUM(t.valor) DESC")
    List<Object[]> sumByCategoriaAndTipo(@Param("uid") Long usuarioId, @Param("tipo") TipoTransacao tipo);
}
