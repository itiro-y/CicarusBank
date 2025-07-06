package com.sicarus.model;

import com.sicarus.enums.AccountType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
//@Profile("dev")
public class DataLoader implements CommandLineRunner {
    private final AccountRepository accountRepository;
    public DataLoader(AccountRepository accountRepository){
        this.accountRepository = accountRepository;
    }

    @Override
    public void run(String... args) throws Exception{
        if(accountRepository.count() == 0) {
            Account account1 = new Account();
            account1.setBalance(BigDecimal.valueOf(1000));
            account1.setType(AccountType.CHECKING);
            account1.setUserId((long) 1);

            Account account2 = new Account();
            account2.setBalance(BigDecimal.valueOf(100));
            account2.setType(AccountType.SAVINGS);
            account2.setUserId((long) 2);

            accountRepository.saveAll(List.of(account2, account1));
            System.out.println("-------------ENTRADAS CRIADAS---------------- ");
        }
    }
}
