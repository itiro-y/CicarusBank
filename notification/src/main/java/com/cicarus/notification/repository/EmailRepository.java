package com.cicarus.notification.repository;

import com.cicarus.notification.model.EmailModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmailRepository extends JpaRepository<EmailModel, Long> {
    List<EmailModel> findByCustomerId(Long customerId);
}