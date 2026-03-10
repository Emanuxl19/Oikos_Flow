package org.emanuel.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.emanuel.model.Transacao;
import org.emanuel.model.Usuario;
import org.emanuel.service.TransacaoService;
import org.emanuel.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;
    private final UsuarioService usuarioService;

    private Usuario getUsuario(UserDetails ud) {
        return usuarioService.findByEmail(ud.getUsername());
    }

    @GetMapping
    public List<Transacao> listar(@AuthenticationPrincipal UserDetails ud) {
        return transacaoService.listarTodas(getUsuario(ud));
    }

    @GetMapping("/mes")
    public List<Transacao> listarMes(
            @RequestParam(defaultValue = "0") int ano,
            @RequestParam(defaultValue = "0") int mes,
            @AuthenticationPrincipal UserDetails ud) {
        int a = ano == 0 ? LocalDate.now().getYear() : ano;
        int m = mes == 0 ? LocalDate.now().getMonthValue() : mes;
        return transacaoService.listarPorMes(getUsuario(ud), a, m);
    }

    @GetMapping("/resumo")
    public Map<String, Object> resumo(
            @RequestParam(defaultValue = "0") int ano,
            @RequestParam(defaultValue = "0") int mes,
            @AuthenticationPrincipal UserDetails ud) {
        int a = ano == 0 ? LocalDate.now().getYear() : ano;
        int m = mes == 0 ? LocalDate.now().getMonthValue() : mes;
        return transacaoService.resumo(getUsuario(ud), a, m);
    }

    @PostMapping
    public ResponseEntity<Transacao> criar(@Valid @RequestBody Transacao transacao,
                                           @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(transacaoService.criar(transacao, getUsuario(ud)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transacao> atualizar(@PathVariable Long id,
                                               @Valid @RequestBody Transacao dados,
                                               @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(transacaoService.atualizar(id, dados, getUsuario(ud)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails ud) {
        transacaoService.deletar(id, getUsuario(ud));
        return ResponseEntity.noContent().build();
    }
}
