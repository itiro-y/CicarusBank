package com.cicarus.notification.repository;

import com.cicarus.notification.model.EmailModel;
import com.cicarus.notification.model.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findByUserIdOrderByTimestampDesc(Long userId);
}
