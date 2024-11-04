export interface Stylist {
  stylistID: number;
  stylistName: string;
  stylistPhone: string;
  stylistEmail: string;
  stylistPassword: string;
  stylistStatus: boolean;
  role: string;
  stylistInfor: string;
  stylistAvatar: string;
}

export interface StylistRequest {
  stylistName: string;
  stylistPhone: string;
  stylistEmail: string;
  stylistInfor: string;
}
