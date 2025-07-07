package com.sicarus.controller;

import com.sicarus.model.Account;
import com.sicarus.model.AccountRepository;
import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class AccountController {
    private final AccountRepository accountRepository;
    public AccountController(AccountRepository accountRepository){
        this.accountRepository = accountRepository;
    }

    @GetMapping("/account")
    public List<Account> getAll(){
        return accountRepository.findAll();
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
}
