package com.scoh.api.controller;

import com.scoh.api.dto.RoleUpdateRequest;
import com.scoh.api.dto.UserSummaryResponse;
import com.scoh.api.security.SecurityUtils;
import com.scoh.api.service.UserAccountService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserAccountService userAccountService;

    public AdminUserController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @GetMapping
    public List<UserSummaryResponse> getAllUsers() {
        return userAccountService.getAllUsers();
    }

    @PutMapping("/{userId}/roles")
    public UserSummaryResponse updateRoles(@PathVariable String userId, @Valid @RequestBody RoleUpdateRequest request) {
        return userAccountService.updateRoles(userId, request.roles(), SecurityUtils.currentUser().getId());
    }
}
