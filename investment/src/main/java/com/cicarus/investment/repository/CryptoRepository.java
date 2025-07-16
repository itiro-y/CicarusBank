package com.cicarus.investment.repository;

import com.cicarus.investment.model.Crypto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CryptoRepository extends JpaRepository<Crypto, Long> {
    List<Crypto> findAllByAccountId(Long accountId);
}
