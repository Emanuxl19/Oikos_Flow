package org.emanuel.API_util; // Certifique-se de que o pacote está correto

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "org.emanuel")
@EnableJpaRepositories(basePackages = "org.emanuel.repository")
@EntityScan(basePackages = "org.emanuel.model")
public class APIUtilApplication {

    public static void main(String[] args) {
        SpringApplication.run(APIUtilApplication.class, args);
    }

}