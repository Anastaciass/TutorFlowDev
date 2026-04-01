package com.tutorflow.repository;
import com.tutorflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> 
{
    User findByEmail(String email);
}
