//package com.sicarus.model;
//
//import jakarta.persistence.*;
//
//import java.io.Serializable;
//import java.util.Objects;
//
//@Entity
//@Table(name = "users")
//public class User implements Serializable {
//    private static final long serialVersionUID = 1L;
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column
//    private String username;
//
//    @Column(name = "password_hash")
//    private String hashPassword;
//
//    @Column(name = "roles")
//    @Enumerated(EnumType.STRING)
//    private UserRoles roles;
//
//    public User() {}
//
//    public User(Long id, String username, String hashPassword, UserRoles roles) {
//        this.id = id;
//        this.username = username;
//        this.hashPassword = hashPassword;
//        this.roles = roles;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getHashPassword() {
//        return hashPassword;
//    }
//
//    public void setHashPassword(String hashPassword) {
//        this.hashPassword = hashPassword;
//    }
//
//    public UserRoles getRoles() {
//        return roles;
//    }
//
//    public void setRoles(UserRoles roles) {
//        this.roles = roles;
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        User user = (User) o;
//        return Objects.equals(id, user.id) && Objects.equals(username, user.username) && Objects.equals(hashPassword, user.hashPassword) && roles == user.roles;
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(id, username, hashPassword, roles);
//    }
//
//    @Override
//    public String toString() {
//        return "User{" +
//                "id=" + id +
//                ", username='" + username + '\'' +
//                ", hashPassword='" + hashPassword + '\'' +
//                ", roles=" + roles +
//                '}';
//    }
//}
