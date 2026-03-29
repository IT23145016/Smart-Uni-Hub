package com.scoh.api.dto;

import com.scoh.api.domain.Role;
import java.time.Instant;
import java.util.Set;

public record UserSummaryResponse(
        String id,
        String email,
        String fullName,
        String avatarUrl,
        boolean active,
        Set<Role> roles,
        Instant createdAt,
        Instant updatedAt) {
}
