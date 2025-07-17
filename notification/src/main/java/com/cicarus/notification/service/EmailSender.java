package com.cicarus.notification.service;

import com.cicarus.notification.model.EmailModel;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSender {

    private final JavaMailSender mailSender;
    private final EmailBodyService emailBodyService;

    public EmailSender(JavaMailSender mailSender, EmailBodyService emailBodyService) {
        this.mailSender = mailSender;
        this.emailBodyService = emailBodyService;
    }


    public void sendEmail(EmailModel emailModel) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("cicarusbank@gmail.com"); // substitua pelo seu
            helper.setTo(emailModel.getRecipientEmail());
            helper.setSubject("Notificação do Cicarus Bank");

            String corpoEmailComBr = emailModel.getMessage().replace("\n", "<br>");

            // Corpo do e-mail com assinatura visual
            String body = String.format("""
                                        <html>
                                            <body>
                                                %s
                                                <br><br>
                                                <img src="cid:cicarus-signature" alt="Assinatura Cicarus" style="width: 300px; height: auto;"/>
                                            </body>
                                        </html>
                                        """, corpoEmailComBr);
            helper.setText(body, true); // true = HTML

            // Inclui a imagem da assinatura (deve estar em src/main/resources/static/images/)
            ClassPathResource image = new ClassPathResource("/static/images/cicarus-signature.jpeg");
            helper.addInline("cicarus-signature", image);

            mailSender.send(mimeMessage);
            System.out.println("📧 E-mail com assinatura visual enviado para " + emailModel.getRecipientEmail());

        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar e-mail", e);
        }
    }
}
