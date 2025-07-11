package com.sicarus.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BalanceHistoryRepository extends JpaRepository<BalanceHistory, Long> {
    List<BalanceHistory> findByAccountIdOrderByTimestampDesc(Long accountId);
}
