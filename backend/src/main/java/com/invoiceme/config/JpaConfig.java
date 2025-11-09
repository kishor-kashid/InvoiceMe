package com.invoiceme.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA Configuration
 * Enables JPA repositories and transaction management
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.invoiceme.infrastructure.persistence")
@EnableTransactionManagement
public class JpaConfig {
    // Additional JPA configuration can be added here if needed
}

