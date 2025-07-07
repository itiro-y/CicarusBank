import com.sicarus.dto.AuthRequest;
import com.sicarus.dto.AuthResponse;
import com.sicarus.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint de teste opcional
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
