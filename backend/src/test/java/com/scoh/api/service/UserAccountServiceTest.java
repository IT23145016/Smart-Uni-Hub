package com.scoh.api.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.scoh.api.domain.Role;
import com.scoh.api.domain.UserAccount;
import com.scoh.api.exception.ForbiddenOperationException;
import com.scoh.api.repository.UserAccountRepository;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserAccountServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private UserAccountService userAccountService;

    @Test
    void shouldBlockAdminFromRemovingOwnAdminRole() {
        UserAccount user = new UserAccount();
        user.setId("u1");
        user.setRoles(Set.of(Role.ADMIN, Role.USER));

        when(userAccountRepository.findById("u1")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> userAccountService.updateRoles("u1", Set.of(Role.USER), "u1"))
                .isInstanceOf(ForbiddenOperationException.class);

        verify(userAccountRepository, never()).save(user);
    }
}
