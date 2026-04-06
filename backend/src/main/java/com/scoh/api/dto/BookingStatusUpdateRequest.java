package com.scoh.api.dto;

public class BookingStatusUpdateRequest {
  private String status;
  private String adminNotes;

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getAdminNotes() {
    return adminNotes;
  }

  public void setAdminNotes(String adminNotes) {
    this.adminNotes = adminNotes;
  }
}
