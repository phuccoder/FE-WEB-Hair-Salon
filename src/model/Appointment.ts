export interface Appointment {
  appointmentID: number;
  appointmentDate: string; // ISO date string
  appointmentStatus: string;
  accountID: number;
  stylistID: number;
  voucherID: number;
  appointmentPrice: number;
  appointmentDetails: AppointmentDetail[];
  reviews: AppointmentRating[];
}

interface AppointmentDetail {
  appointmentDetailID: number;
  appointment: string;
  comboID: number;
  comboName: string;
  comboPrice: number;
  serviceID: number;
  serviceName: string;
  servicePrice: number;
}

interface AppointmentRating {
  reviewID: number;
  comment: string;
  reviewRating: number;
  accountID: number;
  appointmentID: number;
  reviewDate: string;
}
