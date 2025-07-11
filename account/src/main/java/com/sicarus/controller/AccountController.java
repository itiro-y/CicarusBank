package com.sicarus.controller;

import com.sicarus.enums.TransactionType;
import com.sicarus.model.Account;
import com.sicarus.model.AccountRepository;
import com.sicarus.model.BalanceHistory;
import com.sicarus.model.BalanceHistoryRepository;
import jakarta.ws.rs.Path;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
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
    public Optional<Account> getById(@PathVariable Long id){
        return accountRepository.findById(id);
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

    @PutMapping("/account/{id}/{saldo}/{tipoTransacao}")
    public Account alterarSaldo(
            @PathVariable Long id,
            @PathVariable BigDecimal saldo,
            @PathVariable TransactionType tipoTransacao
            ){
        Optional<Account> contaModificada = accountRepository.findById(id);

        if (contaModificada.isPresent()) {
            Account conta = contaModificada.get();
            if (tipoTransacao == TransactionType.DEPOSIT) {
                conta.setBalance(conta.getBalance().add(saldo));
            }else if(tipoTransacao == TransactionType.WITHDRAWAL){
                conta.setBalance(conta.getBalance().subtract(saldo));
            }
            return accountRepository.save(conta);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "account not found");
        }
    }

    @GetMapping("/balance-history/{accountId}")
    public List<BalanceHistory> getBalanceHistory(@PathVariable Long accountId) {
        return balanceHistoryRepository.findByAccountIdOrderByTimestampDesc(accountId);
    }
}
