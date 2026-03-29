package com.scoh.api.security;

import com.scoh.api.domain.Role;
import com.scoh.api.domain.UserAccount;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class AppUserPrincipal implements OAuth2User {

    private final UserAccount user;
    private final Map<String, Object> attributes;

    public AppUserPrincipal(UserAccount user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    public UserAccount getUser() {
        return user;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<Role> roles = user.getRoles();
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .toList();
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
