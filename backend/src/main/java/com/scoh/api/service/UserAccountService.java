package com.scoh.api.service;

import com.scoh.api.domain.Role;
import com.scoh.api.domain.UserAccount;
import com.scoh.api.dto.UserSummaryResponse;
import com.scoh.api.exception.ForbiddenOperationException;
import com.scoh.api.exception.NotFoundException;
import com.scoh.api.repository.UserAccountRepository;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final NotificationService notificationService;

    public UserAccountService(UserAccountRepository userAccountRepository, NotificationService notificationService) {
        this.userAccountRepository = userAccountRepository;
        this.notificationService = notificationService;
    }

    public UserAccount upsertOAuthUser(
            String email,
            String fullName,
            String avatarUrl,
            String provider,
            String providerId) {

        UserAccount user = userAccountRepository.findByEmailIgnoreCase(email)
                .orElseGet(UserAccount::new);

        user.setEmail(email);
        user.setFullName(fullName);
        user.setAvatarUrl(avatarUrl);
        user.setProvider(provider);
        user.setProviderId(providerId);
        return userAccountRepository.save(user);
    }

    public List<UserSummaryResponse> getAllUsers() {
        return userAccountRepository.findAll().stream()
                .map(this::toSummary)
                .toList();
    }

    public UserSummaryResponse updateRoles(String targetUserId, Set<Role> roles, String actingUserId) {
        UserAccount target = findById(targetUserId);
        if (target.getId().equals(actingUserId) && !roles.contains(Role.ADMIN)) {
            throw new ForbiddenOperationException("Admins cannot remove their own ADMIN role.");
        }

        target.setRoles(roles);
        UserAccount saved = userAccountRepository.save(target);
        notificationService.createRoleUpdateNotification(saved);
        return toSummary(saved);
    }

    public UserAccount findById(String userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
    }

    public UserAccount findByEmail(String email) {
        return userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("User not found for email: " + email));
    }

    public UserSummaryResponse toSummary(UserAccount user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.isActive(),
                user.getRoles(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
