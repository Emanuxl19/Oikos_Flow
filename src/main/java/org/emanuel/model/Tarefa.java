package org.emanuel.model;
import jakarta.persistence.*;

@Entity
    public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    private boolean concluida;

    public Tarefa(){}

        public Tarefa(String descricao, boolean concluida){
        this.descricao = descricao;
        this.concluida = concluida;
        }

        public Long getId() {
        return id;
        }

        public String getDescricao() {
        return descricao;
        }

        public void setDescricao(String descricao) {
        this.descricao = descricao;
        }

        public boolean isConcluida() {
            return concluida;
        }

        public void setConcluida(boolean concluida) {
        this.concluida = concluida;
        }
}
