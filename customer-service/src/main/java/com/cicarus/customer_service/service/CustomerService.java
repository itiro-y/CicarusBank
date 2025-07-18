package com.cicarus.customer_service.service;

import com.cicarus.customer_service.client.AccountClient;
import com.cicarus.customer_service.client.AuthClient;
import com.cicarus.customer_service.dto.AccountRequest;
import com.cicarus.customer_service.dto.AuthCreateRequest;
import com.cicarus.customer_service.dto.AccountResponse;
import com.cicarus.customer_service.dto.CustomerRequest;
import com.cicarus.customer_service.dto.CustomerResponse;
import com.cicarus.customer_service.entities.Customer;
import com.cicarus.customer_service.repository.CustomerRepository;
import org.apache.http.HttpStatus;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CustomerService {

    private final CustomerRepository repository;
    private final AccountClient accountClient;
    private final AuthClient authClient;

    public CustomerService(AccountClient accountClient,
                           CustomerRepository repository,
                           AuthClient authClient) {
        this.accountClient = accountClient;
        this.repository = repository;
        this.authClient = authClient;
    }

    public CustomerResponse create(CustomerRequest Request) {
        Customer customer = new Customer();
        BeanUtils.copyProperties(Request, customer);
        Customer saved = repository.save(customer);

        
        AuthCreateRequest authRequest = new AuthCreateRequest(Request.getEmail(), Request.getPassword());
        authClient.createUser(authRequest);

        
        AccountRequest accountRequest = new AccountRequest(customer.getId(),
                "CHECKING");

        AccountResponse newAccount = accountClient.createAccount(accountRequest);

        CustomerResponse Response = new CustomerResponse();
        BeanUtils.copyProperties(saved, Response);
        return Response;
    }

    public CustomerResponse getById(Long id) {
        Customer customer = repository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        CustomerResponse response = new CustomerResponse();
        BeanUtils.copyProperties(customer, response);
        return response;
    }

    public List<CustomerResponse> getAll() {
        return repository.findAll().stream().map(customer -> {
            CustomerResponse resp = new CustomerResponse();
            BeanUtils.copyProperties(customer, resp);
            return resp;
        }).toList();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public CustomerResponse findByEmail(String email) {
        Customer customer = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + email));
        CustomerResponse response = new CustomerResponse();
        BeanUtils.copyProperties(customer, response);
        return response;
    }
}
