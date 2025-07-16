package com.sicarus.account.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUserId(Long userId);

    @Query("SELECT a FROM Account a " +
            "left join fetch a.balanceHistory " +
            "WHERE a.id = :id")
    Optional<Account> findByIdWithHistory(@Param("id") Long id);

}
