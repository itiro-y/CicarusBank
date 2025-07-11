package com.sicarus.controller;

import com.sicarus.enums.TransactionType;
import com.sicarus.model.Account;
import com.sicarus.model.AccountRepository;
import com.sicarus.model.BalanceHistory;
import com.sicarus.model.BalanceHistoryRepository;
import dtos.AccountDTO;
import dtos.BalanceHistoryDTO;
import jakarta.ws.rs.Path;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class AccountController {
    private final AccountRepository accountRepository;
    private final BalanceHistoryRepository balanceHistoryRepository;

    public AccountController(AccountRepository accountRepository, BalanceHistoryRepository balanceHistoryRepository){
        this.accountRepository = accountRepository;
        this.balanceHistoryRepository = balanceHistoryRepository;
    }

    @GetMapping("/account")
    public List<Account> getAll(){
        return accountRepository.findAll();
    }

    @GetMapping("/account/ping")
    public String ping(){
        return "Pong!";
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<AccountDTO> getById(@PathVariable Long id){
        Account acc = accountRepository.findByIdWithHistory(id)
                                        .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada"));

        // Mapeia balanceHistory → BalanceHistoryDTO
        List<BalanceHistoryDTO> historyDto = acc.getBalanceHistory().stream()
                                                                    .map(this::toHistoryDto)
                                                                    .toList();

        // Monta e retorna o AccountDTO
        AccountDTO dto = new AccountDTO(acc.getId(),
                                        acc.getUserId(),
                                        acc.getType().name(),
                                        acc.getBalance(),
                                        historyDto);
        return ResponseEntity.ok(dto);
    }

    private BalanceHistoryDTO toHistoryDto(BalanceHistory h) {
        return new BalanceHistoryDTO(h.getId(),
                                     h.getBalance(),
                                     h.getTimestamp());
    }

    @PostMapping("/account")
    public Account createAccount(@RequestBody Account account){
        return accountRepository.save(account);
    }

    @DeleteMapping("/account/{id}")
    public void deleteAccount(@PathVariable Long id){
        accountRepository.deleteById(id);
    }

    @PutMapping("/account/{id}")
    public Account updateAccount(@PathVariable Long id, @RequestBody Account updatedAccount){
        return accountRepository.findById(id)
                .map(account -> {
                    account.setType(updatedAccount.getType());
                    account.setBalance(updatedAccount.getBalance());
                    account.setUserId(updatedAccount.getUserId());
                    return accountRepository.save(account);
                })
                .orElseGet(() -> {
                   return accountRepository.save(updatedAccount);
                });
    }

    @PutMapping("/account/{id}/{amount}/{transactionType}")
    public AccountDTO alterarSaldo(
            @PathVariable Long id,
            @PathVariable BigDecimal amount,
            @PathVariable TransactionType transactionType
    ) {
        // 1) atualiza o saldo e salva
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (transactionType == TransactionType.DEPOSIT) {
            acc.setBalance(acc.getBalance().add(amount));
        } else {
            acc.setBalance(acc.getBalance().subtract(amount));
        }
        accountRepository.save(acc);

        // 2) registra o history
        balanceHistoryRepository.save(new BalanceHistory(acc, acc.getBalance(), new Date()));

        // 3) recarrega com fetch-join e mapeia para DTO
        Account withHist = accountRepository.findByIdWithHistory(id)
                .orElseThrow();
        return toDto(withHist);
    }

    private AccountDTO toDto(Account acc) {
        // mapeia cada BalanceHistory → BalanceHistoryDTO
        List<BalanceHistoryDTO> historyDto = acc.getBalanceHistory().stream()
                .map(h -> new BalanceHistoryDTO(
                        h.getId(),
                        h.getBalance(),
                        h.getTimestamp()
                ))
                .toList();

        // monta e retorna o AccountDTO
        return new AccountDTO(
                acc.getId(),
                acc.getUserId(),
                acc.getType().name(),
                acc.getBalance(),
                historyDto
        );
    }

    @GetMapping("/account/balance-history/{accountId}")
    public List<BalanceHistoryDTO> getBalanceHistory(@PathVariable Long accountId) {
        Account acc = accountRepository.findByIdWithHistory(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada"));

        List<BalanceHistoryDTO> historyDto = acc.getBalanceHistory().stream()
                                                                    .map(this::toHistoryDto)
                                                                    .toList();
        return  historyDto;
    }
}
