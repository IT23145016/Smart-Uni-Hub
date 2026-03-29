package com.scoh.api.security;

import com.scoh.api.config.AppProperties;
import com.scoh.api.domain.UserAccount;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AppProperties appProperties;

    public OAuth2AuthenticationSuccessHandler(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        UserAccount user = extractUser(authentication.getPrincipal());

        String redirectUrl = UriComponentsBuilder.fromUriString(appProperties.getOauth2().getSuccessRedirectUrl())
                .queryParam("userId", user.getId())
                .queryParam("email", user.getEmail())
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private UserAccount extractUser(Object principal) {
        if (principal instanceof AppUserPrincipal appUserPrincipal) {
            return appUserPrincipal.getUser();
        }
        if (principal instanceof AppOidcUser appOidcUser) {
            return appOidcUser.getUser();
        }
        throw new IllegalStateException("Unsupported OAuth principal: " + principal.getClass().getName());
    }
}
