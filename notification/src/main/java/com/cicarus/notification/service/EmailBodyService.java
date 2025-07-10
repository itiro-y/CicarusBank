package com.cicarus.notification.service;

import com.cicarus.notification.dto.DepositNotificationDto;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import java.util.TimeZone;

@Service
public class EmailBodyService {

    SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");

    // Corpo do e-mail com assinatura visual
    private String body = """
                <div style="font-family:Arial,sans-serif;">
                  <p>%s</p>
                  <br>
                  <hr>
                  <p style="font-size: 12px; color: gray;">
                    Atenciosamente,<br>
                    Equipe Cicarus Bank<br>
                    <a href="mailto:suporte@cicarusbank.com">suporte@cicarusbank.com</a>
                  </p>
                </div>
            """;

    private String depositBody = """
                                    Olá, %s!
                                    
                                    Recebemos um depósito em sua conta bancária. A operação foi concluída com sucesso.
                                    
                                    📄 Detalhes do depósito:
                                    • Valor: R$ %.2f
                                    • Data do depósito: %s
                                    
                                    O valor já está disponível para utilização em sua conta.
                                    
                                    Caso não tenha realizado esse depósito ou identifique qualquer irregularidade, entre em contato com nossa central de atendimento.
                                    """;

    private String withdrawBody = """
                                    Olá, %s!
                                                                        
                                    Recebemos a solicitação de saque da sua conta bancária. A operação foi concluída com sucesso.
                                                                        
                                    📄 Detalhes do saque:
                                    • Valor: R$ %.2f
                                    • Data do saque: %s

                                    Caso não tenha realizado essa transação ou identifique qualquer irregularidade, entre em contato com nossa central de atendimento.
                                    """;

    private String transferBody = """
                                    Olá, %s!
                                                                        
                                    Uma transferência foi realizada com sucesso a partir da sua conta bancária.
                                                                        
                                    📄 Detalhes da transferência:
                                    • Valor: R$ %.2f
                                    • Nome do destinatario: %s
                                    • Conta de destino: %s
                                    • Data da transferência: %s
                                                                        
                                    Caso não tenha realizado essa transferência ou identifique qualquer irregularidade, entre em contato com nossa central de atendimento imediatamente.
                                    """;

    public String generateDepositBody(DepositNotificationDto depositNotificationDto) {
        formato.setTimeZone(TimeZone.getTimeZone("America/Sao_Paulo"));
        // Converter Instant para Date
        Date date = Date.from(depositNotificationDto.getDateTime());

        String corpoEmail = String.format(
                depositBody,
                depositNotificationDto.getCustomerName(),
                depositNotificationDto.getAmount(),
                formato.format(date)
        );

        return body.formatted(corpoEmail);
    }

}
