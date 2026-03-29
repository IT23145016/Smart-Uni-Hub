package com.scoh.api.dto;

import com.scoh.api.domain.Role;
import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public record RoleUpdateRequest(@NotEmpty Set<Role> roles) {
}
