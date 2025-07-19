package com.cicarus.investment.repository;

import com.cicarus.investment.model.crypto.Crypto;
import com.cicarus.investment.model.crypto.CryptoType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CryptoRepository extends JpaRepository<Crypto, Long> {
    List<Crypto> findAllByAccountId(Long accountId);

    Optional<Crypto> findFirstByTypeAndAccountId(CryptoType type, Long accountId);
}
