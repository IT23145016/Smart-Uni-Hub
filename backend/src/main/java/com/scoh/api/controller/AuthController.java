package com.scoh.api.controller;

import com.scoh.api.domain.UserAccount;
import com.scoh.api.dto.AuthUserResponse;
import com.scoh.api.security.SecurityUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public AuthUserResponse me() {
        UserAccount user = SecurityUtils.currentUser();
        return new AuthUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getRoles());
    }
}
