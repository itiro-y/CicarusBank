package com.sicarus.controller;

import com.sicarus.model.Account;
import com.sicarus.model.AccountRepository;
import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("account")
public class AccountController {
    private final AccountRepository accountRepository;
    public AccountController(AccountRepository accountRepository){
        this.accountRepository = accountRepository;
    }

    @GetMapping()
    public List<Account> getAll(){
        return accountRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Account> getById(@PathVariable Long id){
        return accountRepository.findById(id);
    }

    @PostMapping()
    public Account createAccount(@RequestBody Account account){
        return accountRepository.save(account);
    }

    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable Long id){
        accountRepository.deleteById(id);
    }

    @PutMapping("/{id}")
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
