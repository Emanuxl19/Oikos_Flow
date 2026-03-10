package org.emanuel.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.emanuel.model.enums.Prioridade;
import org.emanuel.model.enums.StatusAtividade;
import org.emanuel.model.enums.TipoAtividade;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "atividade")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Titulo obrigatorio")
    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoAtividade tipo = TipoAtividade.GERAL;

    private String categoria;

    // Usado principalmente para atividades ESCOLAR
    private String materia;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Prioridade prioridade = Prioridade.MEDIA;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusAtividade status = StatusAtividade.PENDENTE;

    private LocalDateTime prazo;

    // Tempo estimado em minutos
    private Integer tempoEstimado;

    // Usado para atividades FINANCEIRO
    @Column(precision = 15, scale = 2)
    private BigDecimal valor;

    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    @OneToMany(mappedBy = "atividade", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<Nota> notas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
        if (status == null) status = StatusAtividade.PENDENTE;
        if (prioridade == null) prioridade = Prioridade.MEDIA;
        if (tipo == null) tipo = TipoAtividade.GERAL;
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
