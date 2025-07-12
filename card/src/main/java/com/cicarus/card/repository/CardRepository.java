package com.cicarus.card.repository;

import com.cicarus.card.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findAllByCustomerId(Long customerId);
}
