package com.cicarus.notification.service;

import com.cicarus.notification.model.Notification;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSender {

    private final JavaMailSender mailSender;

    public EmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(Notification notification) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("cicarusbank@gmail.com"); // substitua pelo seu
            helper.setTo(notification.getRecipientEmail());
            helper.setSubject("Notificação do Cicarus Bank");

            // Corpo do e-mail com assinatura visual
            String body = """
                <div style="font-family:Arial,sans-serif;">
                  <p>%s</p>
                  <br>
                  <hr>
                  <p style="font-size: 12px; color: gray;">
                    Atenciosamente,<br>
                    Equipe Cicarus Bank<br>
                    <a href="mailto:suporte@cicarusbank.com">suporte@cicarusbank.com</a>
                  </p>
                  <img src='cid:cicarus-signature' style="max-width: 300px; margin-top: 10px;" />
                </div>
            """.formatted(notification.getMessage());

            helper.setText(body, true); // true = HTML

            // Inclui a imagem da assinatura (deve estar em src/main/resources/static/images/)
            ClassPathResource image = new ClassPathResource("/static/images/cicarus-signature.jpeg");
            helper.addInline("cicarus-signature", image);

            mailSender.send(mimeMessage);
            System.out.println("📧 E-mail com assinatura visual enviado para " + notification.getRecipientEmail());

        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar e-mail", e);
        }
    }
}
