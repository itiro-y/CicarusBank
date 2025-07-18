package com.sicarus.controller;

import com.sicarus.dto.CreateAccountRequest;
import com.sicarus.dto.UpdateAccountBalancesRequest;
import com.sicarus.dto.UpdateBrlToEurRequest;
import com.sicarus.enums.AccountType;
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
    public List<AccountDTO> getAll(){
        return accountRepository.findAll().stream()
                .map(this::toDtoWithoutHistory)
                .toList();
    }

    private AccountDTO toDtoWithoutHistory(Account acc) {
        return new AccountDTO(
                acc.getId(),
                acc.getUserId(),
                acc.getType().name(),
                acc.getBalance(),
                acc.getUsdWallet(),
                acc.getEurWallet(),
                List.of() 
        );
    }

    @GetMapping("/account/customer/{id}")
    public Long getAccountByUserId(@PathVariable("id") Long id){
        return accountRepository.findByUserId(id)
                .map(Account::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
    }

    @GetMapping("/account/ping")
    public String ping(){
        return "Pong!";
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<AccountDTO> getById(@PathVariable Long id){
        Account acc = accountRepository.findByIdWithHistory(id)
                                        .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada"));

        
        List<BalanceHistoryDTO> historyDto = acc.getBalanceHistory().stream()
                                                                    .map(this::toHistoryDto)
                                                                    .toList();

        
        AccountDTO dto = new AccountDTO(acc.getId(),
                                        acc.getUserId(),
                                        acc.getType().name(),
                                        acc.getBalance(),
                                        acc.getUsdWallet(),
                                        acc.getEurWallet(),
                                        historyDto);
        return ResponseEntity.ok(dto);
    }

    private BalanceHistoryDTO toHistoryDto(BalanceHistory h) {
        return new BalanceHistoryDTO(h.getId(),
                                     h.getBalance(),
                                     h.getTimestamp());
    }

    @PostMapping("/account")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody CreateAccountRequest request){
        Account account = new Account();
        account.setUserId(request.getUserId());
        account.setType(AccountType.valueOf(request.getAccountType())); 
        account.setBalance(request.getBalance() != null ? request.getBalance() : BigDecimal.ZERO);
        account.setUsdWallet(BigDecimal.ZERO); 
        account.setEurWallet(BigDecimal.ZERO); 

        Account savedAccount = accountRepository.save(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDtoWithoutHistory(savedAccount));
    }

    @DeleteMapping("/account/{id}")
    public void deleteAccount(@PathVariable Long id){
        accountRepository.deleteById(id);
    }

    @PutMapping("/account/exchange-brl-to-eur")
    public Account exchangeBrlToEur(@RequestBody UpdateBrlToEurRequest request) {
        Optional<Account> optionalAccount = accountRepository.findById(request.getAccountId());

        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            account.setBalance(account.getBalance().subtract(request.getBrlAmount()));
            account.setEurWallet(account.getEurWallet().add(request.getEurAmount()));
            return accountRepository.save(account);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found for account ID: " + request.getAccountId());
        }
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
        
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (transactionType == TransactionType.DEPOSIT) {
            acc.setBalance(acc.getBalance().add(amount));
        } else {
            acc.setBalance(acc.getBalance().subtract(amount));
        }
        accountRepository.save(acc);

        
        balanceHistoryRepository.save(new BalanceHistory(acc, acc.getBalance(), new Date()));

        
        Account withHist = accountRepository.findByIdWithHistory(id)
                .orElseThrow();
        return toDto(withHist);
    }

    private AccountDTO toDto(Account acc) {
        
        List<BalanceHistoryDTO> historyDto = acc.getBalanceHistory().stream()
                .map(h -> new BalanceHistoryDTO(
                        h.getId(),
                        h.getBalance(),
                        h.getTimestamp()
                ))
                .toList();

        
        return new AccountDTO(
                acc.getId(),
                acc.getUserId(),
                acc.getType().name(),
                acc.getBalance(),
                acc.getUsdWallet(),
                acc.getEurWallet(),
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

    @PutMapping("/account/update-balances")
    public Account updateAccountBalances(@RequestBody UpdateAccountBalancesRequest request) {
        Optional<Account> optionalAccount = accountRepository.findById(request.getAccountId());

        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            account.setBalance(account.getBalance().subtract(request.getBrlAmount()));
            account.setUsdWallet(account.getUsdWallet().add(request.getUsdAmount()));
            return accountRepository.save(account);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found for account ID: " + request.getAccountId());
        }
    }
}
