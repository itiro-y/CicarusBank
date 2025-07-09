package com.cicarus.customer_service.service;

import com.cicarus.customer_service.dto.CustomerRequest;
import com.cicarus.customer_service.dto.CustomerResponse;
import com.cicarus.customer_service.entities.Customer;
import com.cicarus.customer_service.repository.CustomerRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    public CustomerResponse create(CustomerRequest Request) {
        Customer customer = new Customer();
        BeanUtils.copyProperties(Request, customer);
        Customer saved = repository.save(customer);

        CustomerResponse Response = new CustomerResponse();
        BeanUtils.copyProperties(saved, Response);
        return Response;
    }

    public CustomerResponse getById(Long id) {
        Customer customer = repository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));

        CustomerResponse response = new CustomerResponse();
        BeanUtils.copyProperties(customer,response);
        return response;
    }

    public List<CustomerResponse> getAll() {
        return repository.findAll().stream().map(customer -> {
            CustomerResponse resp = new CustomerResponse();
            BeanUtils.copyProperties(customer,resp);
            return resp;
        }).toList();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
