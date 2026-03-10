package org.emanuel.service;

import lombok.RequiredArgsConstructor;
import org.emanuel.model.Transacao;
import org.emanuel.model.Usuario;
import org.emanuel.model.enums.TipoTransacao;
import org.emanuel.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;

    public List<Transacao> listarTodas(Usuario usuario) {
        return transacaoRepository.findByUsuarioIdOrderByDataDesc(usuario.getId());
    }

    public List<Transacao> listarPorMes(Usuario usuario, int ano, int mes) {
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());
        return transacaoRepository.findByUsuarioIdAndDataBetweenOrderByDataDesc(usuario.getId(), inicio, fim);
    }

    public Transacao criar(Transacao transacao, Usuario usuario) {
        transacao.setUsuario(usuario);
        return transacaoRepository.save(transacao);
    }

    public Transacao atualizar(Long id, Transacao dados, Usuario usuario) {
        Transacao t = transacaoRepository.findById(id)
                .filter(x -> x.getUsuario().getId().equals(usuario.getId()))
                .orElseThrow(() -> new RuntimeException("Transacao nao encontrada"));
        t.setDescricao(dados.getDescricao());
        t.setValor(dados.getValor());
        t.setTipo(dados.getTipo());
        t.setCategoria(dados.getCategoria());
        t.setData(dados.getData());
        t.setObservacao(dados.getObservacao());
        return transacaoRepository.save(t);
    }

    public void deletar(Long id, Usuario usuario) {
        Transacao t = transacaoRepository.findById(id)
                .filter(x -> x.getUsuario().getId().equals(usuario.getId()))
                .orElseThrow(() -> new RuntimeException("Transacao nao encontrada"));
        transacaoRepository.delete(t);
    }

    public Map<String, Object> resumo(Usuario usuario, int ano, int mes) {
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());
        Long uid = usuario.getId();

        BigDecimal receitas = transacaoRepository.sumByUsuarioIdAndTipoAndDataBetween(uid, TipoTransacao.RECEITA, inicio, fim);
        BigDecimal despesas = transacaoRepository.sumByUsuarioIdAndTipoAndDataBetween(uid, TipoTransacao.DESPESA, inicio, fim);
        BigDecimal saldo = receitas.subtract(despesas);

        Map<String, BigDecimal> porCategoria = new LinkedHashMap<>();
        transacaoRepository.sumByCategoriaAndTipo(uid, TipoTransacao.DESPESA)
                .forEach(row -> porCategoria.put(
                        row[0] != null ? row[0].toString() : "Sem categoria",
                        (BigDecimal) row[1]
                ));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("receitas", receitas);
        result.put("despesas", despesas);
        result.put("saldo", saldo);
        result.put("despesasPorCategoria", porCategoria);
        return result;
    }
}
