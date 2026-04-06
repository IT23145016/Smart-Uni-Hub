package com.scoh.api.service;

import com.scoh.api.domain.Booking;
import com.scoh.api.domain.BookingStatus;
import com.scoh.api.domain.CampusResource;
import com.scoh.api.dto.BookingCreateRequest;
import com.scoh.api.dto.BookingResponse;
import com.scoh.api.dto.BookingStatusUpdateRequest;
import com.scoh.api.repository.BookingRepository;
import com.scoh.api.repository.CampusResourceRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class BookingService {
  private final BookingRepository bookingRepository;
  private final CampusResourceRepository resourceRepository;

  public BookingService(BookingRepository bookingRepository, CampusResourceRepository resourceRepository) {
    this.bookingRepository = bookingRepository;
    this.resourceRepository = resourceRepository;
  }

  public BookingResponse createBooking(String userId, BookingCreateRequest request) {
    if (request.getStartTime().isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Booking start time must be in the future");
    }

    if (request.getEndTime().isBefore(request.getStartTime())) {
      throw new IllegalArgumentException("Booking end time must be after start time");
    }

    if (request.getAttendees() == null || request.getAttendees() < 1) {
      throw new IllegalArgumentException("Number of attendees must be at least 1");
    }

    CampusResource resource = resourceRepository.findById(request.getResourceId())
      .orElseThrow(() -> new IllegalArgumentException("Resource not found"));

    if (request.getAttendees() > resource.getCapacity()) {
      throw new IllegalArgumentException("Number of attendees exceeds resource capacity");
    }

    Booking booking = new Booking(
      request.getResourceId(),
      userId,
      request.getPurpose(),
      request.getAttendees(),
      request.getStartTime(),
      request.getEndTime()
    );

    booking = bookingRepository.save(booking);
    return new BookingResponse(
      booking.getId(),
      booking.getResourceId(),
      booking.getUserId(),
      booking.getPurpose(),
      booking.getAttendees(),
      booking.getStartTime(),
      booking.getEndTime(),
      booking.getStatus(),
      booking.getCreatedAt(),
      booking.getUpdatedAt(),
      booking.getAdminNotes()
    );
  }

  public java.util.List<BookingResponse> getUserBookings(String userId) {
    return bookingRepository.findByUserId(userId)
      .stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public java.util.List<BookingResponse> getAllBookings() {
    return bookingRepository.findAll()
      .stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public java.util.List<BookingResponse> getPendingBookings() {
    return bookingRepository.findByStatus(BookingStatus.PENDING)
      .stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public BookingResponse updateBookingStatus(String bookingId, BookingStatusUpdateRequest request) {
    Booking booking = bookingRepository.findById(bookingId)
      .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

    BookingStatus newStatus;
    try {
      newStatus = BookingStatus.valueOf(request.getStatus().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Invalid booking status: " + request.getStatus());
    }

    // Validate status transitions
    if (booking.getStatus() == BookingStatus.PENDING) {
      if (newStatus != BookingStatus.APPROVED && newStatus != BookingStatus.REJECTED) {
        throw new IllegalArgumentException("Pending bookings can only be approved or rejected");
      }
    } else if (booking.getStatus() == BookingStatus.APPROVED) {
      if (newStatus != BookingStatus.CANCELLED) {
        throw new IllegalArgumentException("Approved bookings can only be cancelled");
      }
    } else {
      throw new IllegalArgumentException("Cannot change status of " + booking.getStatus() + " bookings");
    }

    booking.setStatus(newStatus);
    booking.setAdminNotes(request.getAdminNotes());
    booking.setUpdatedAt(java.time.LocalDateTime.now());

    booking = bookingRepository.save(booking);
    return toResponse(booking);
  }

  public BookingResponse cancelBooking(String bookingId, String userId) {
    Booking booking = bookingRepository.findById(bookingId)
      .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

    if (!booking.getUserId().equals(userId)) {
      throw new IllegalArgumentException("You can only cancel your own bookings");
    }

    if (booking.getStatus() != BookingStatus.APPROVED) {
      throw new IllegalArgumentException("Only approved bookings can be cancelled by users");
    }

    booking.setStatus(BookingStatus.CANCELLED);
    booking.setUpdatedAt(java.time.LocalDateTime.now());

    booking = bookingRepository.save(booking);
    return toResponse(booking);
  }

  private BookingResponse toResponse(Booking booking) {
    return new BookingResponse(
      booking.getId(),
      booking.getResourceId(),
      booking.getUserId(),
      booking.getPurpose(),
      booking.getAttendees(),
      booking.getStartTime(),
      booking.getEndTime(),
      booking.getStatus(),
      booking.getCreatedAt(),
      booking.getUpdatedAt(),
      booking.getAdminNotes()
    );
  }
}
