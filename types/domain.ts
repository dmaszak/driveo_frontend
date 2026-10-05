/**
 * CANONICAL TYPES - DRIVEO YOGYAKARTA
 * Sesuai SRS v1.0 Bab 9 & RENCANA-HALAMAN.md
 */

export type UserRole =
  | "PENYEWA"
  | "RENTAL"
  | "STAFF_OPERASIONAL"
  | "STAFF_KEUANGAN"
  | "ADMIN"
  | "TIM_VERIFIKASI"
  | "CUSTOMER_SUPPORT"
  | "TIM_MEDIASI";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  city?: string;
  isActive: boolean;
  rentalId?: string; // Jika terikat ke rental (owner/staf)
  rentalName?: string;
  secondaryRentalIds?: string[]; // Staf terikat > 1 rental
  verificationStatus: "BELUM_VERIFIKASI" | "MENUNGGU" | "VERIFIED" | "REJECTED";
  nik?: string;
  simNumber?: string;
  simExpiry?: string;
  ktpUrl?: string;
  simUrl?: string;
  selfieUrl?: string;
  kycNotes?: string;
  rating?: number;
  totalRentals?: number;
  consentAccepted: boolean;
  consentTimestamp: string;
  marketingConsent?: boolean;
  deletionRequestedAt?: string | null;
  createdAt: string;
}


export type VehicleCategory =
  | "MPV"
  | "SUV"
  | "CITY_CAR"
  | "EV"
  | "COMMERCIAL";

export type VehicleTransmission = "AUTOMATIC" | "CVT" | "MANUAL";
export type VehicleFuelType = "BENSIN" | "DIESEL" | "HYBRID" | "LISTRIK";
export type VehicleStatus = "TERSEDIA" | "DIPESAN" | "DALAM_SEWA" | "SERVIS_RUTIN" | "NONAKTIF";

export interface Vehicle {
  id: string;
  rentalId: string;
  rentalName: string;
  rentalRating: number;
  rentalCompletedBookings: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string; // Plat AB Yogyakarta
  category: VehicleCategory;
  transmission: VehicleTransmission;
  fuelType: VehicleFuelType;
  seatingCapacity: number;
  luggageCapacity: number;
  engineCapacityCc: number;
  features: string[];
  thumbnailUrl: string;
  galleryImages: string[];
  status: VehicleStatus;
  baseDailyRate: number;
  securityDeposit: number;
  deliveryFee: number;
  city: string;
  district: string;
  garageAddress: string;
  lastUpdatedAt: string;
  isPopular?: boolean;
  // Fase 8 Fleet & Compliance Attributes
  stnkNumber?: string;
  stnkTaxExpiryDate?: string;
  stnkPhotoUrl?: string;
  odometerKm?: number;
  nextServiceKm?: number;
  nextServiceDate?: string;
  equipmentChecklist?: {
    hasSpareTire: boolean;
    hasJack: boolean;
    hasWarningTriangle: boolean;
    hasFirstAidKit: boolean;
    hasToolKit: boolean;
    hasFireExtinguisher: boolean;
  };
  serviceHistory?: {
    id: string;
    date: string;
    workshopName: string;
    odometerKm: number;
    description: string;
    cost: number;
    invoiceUrl?: string;
  }[];
}

export type ListingStatus = "AKTIF" | "NONAKTIF_SEMENTARA" | "DRAF" | "KADALUWARSA_FRESHNESS";

export interface SpotDeliveryRate {
  spotId: string;
  spotName: string;
  area: string;
  fee: number;
  enabled: boolean;
}

export interface MarketplaceListing {
  id: string;
  rentalId: string;
  rentalName: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory;
  vehicleTransmission: VehicleTransmission;
  thumbnailUrl: string;
  serviceType: "LEPAS_KUNCI" | "DENGAN_SUPIR" | "KEDUANYA";
  baseDailyRate: number;
  driverDailyRate?: number;
  securityDeposit: number;
  weekendSurcharge: number;
  spotDeliveryRates: SpotDeliveryRate[];
  minimumRentalDays: number;
  includedFacilities: string[];
  rentalTerms: string[];
  status: ListingStatus;
  lastFreshnessConfirmedAt: string; // BR-027 Freshness Telemetry
  createdAt: string;
  updatedAt: string;
}

export interface PickupSpot {
  id: string;
  name: string;
  code: string;
  area: string;
  description: string;
  extraFee: number;
  isPopular: boolean;
  estimatedDeliveryMin: number;
}

export interface RentalReview {
  id: string;
  authorName: string;
  authorCity: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  vehicleName: string;
  merchantReply?: {
    author: string;
    date: string;
    comment: string;
  };
}

export interface RentalPartner {
  id: string;
  name: string;
  slug: string;
  nib: string;
  nibVerified: boolean;
  rating: number;
  totalReviews: number;
  completedBookings: number;
  address: string;
  district: string;
  city: string;
  phone: string;
  whatsapp: string;
  operatingHours: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  establishedYear: number;
  coverageSpotIds: string[];
  features: string[];
  reviews: RentalReview[];
}

export type BookingStatus =
  | "MENUNGGU_PEMBAYARAN"
  | "DIBAYAR_ESCROW"
  | "SIAP_SERAH_TERIMA"
  | "DALAM_SEWA"
  | "SELESAI"
  | "DIBATALKAN";

export type PaymentScheme = "FULL" | "DP_30";
export type ServiceType = "LEPAS_KUNCI" | "DENGAN_SUPIR";
export type PaymentMethod = "QRIS" | "VA_BCA" | "VA_MANDIRI" | "VA_BRI" | "CREDIT_CARD";

export interface Booking {
  id: string;
  bookingCode: string;
  vehicleId: string;
  vehicleName: string;
  vehicleThumbnail: string;
  licensePlate: string;
  rentalId: string;
  rentalName: string;
  rentalPhone: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pickupSpotId: string;
  pickupSpotName: string;
  serviceType: ServiceType;
  paymentScheme: PaymentScheme;
  baseDailyRate: number;
  rentalTotal: number;
  deliveryFee: number;
  securityDeposit: number;
  grandTotal: number;
  paidAmount: number;
  remainingAmount: number;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  paymentRef?: string;
  paidAt?: string;
  contractSignedAt?: string;
  contractAuditTrail?: {
    ip: string;
    userAgent: string;
    timestamp: string;
    hash: string;
  };
  qrHandoverCode: string;
  createdAt: string;
  slaDeadline?: string; // FR-BOOKING-008: 2-hour confirmation timer
  rejectionReason?: string;
  partnerNotes?: string;
  handoverData?: HandoverData;
  returnData?: ReturnData;
}

export interface HandoverInspectionPoint {
  key: string;
  label: string;
  status: "GOOD" | "ISSUE";
  notes?: string;
}

export interface HandoverData {
  inspectedAt: string;
  fuelLevel: "FULL" | "3/4" | "1/2" | "1/4";
  odometerKm: number;
  photos: {
    front: string;
    back: string;
    right: string;
    left: string;
  };
  inspectionPoints: HandoverInspectionPoint[];
  renterSignature: string;
  partnerStaffName: string;
  partnerSignature: string;
}

export interface ReturnData {
  returnedAt: string;
  fuelLevelReturn: "FULL" | "3/4" | "1/2" | "1/4";
  odometerKmReturn: number;
  photosReturn: {
    front: string;
    back: string;
    right: string;
    left: string;
  };
  inspectionPointsReturn: HandoverInspectionPoint[];
  isOvertime: boolean;
  overtimeHours: number;
  overtimeFee: number;
  fuelPenaltyFee: number;
  renterReturnSignature: string;
  partnerStaffReturnName: string;
  partnerReturnSignature: string;
  hasDisputeClaim: boolean;
  depositReleaseDueAt: string;
}

export interface TwoWayReview {
  id: string;
  bookingId: string;
  bookingCode: string;
  vehicleName: string;
  vehicleThumbnail: string;
  rentalId: string;
  rentalName: string;
  renterRating: {
    cleanliness: number;
    punctuality: number;
    service: number;
    vehiclePerformance: number;
    overall: number;
    comment: string;
    photos: string[];
    createdAt: string;
  };
  merchantReply?: {
    author: string;
    comment: string;
    createdAt: string;
  };
  rentalReviewOfRenter?: {
    rating: number;
    comment: string;
    timelyReturn: boolean;
    cleanCondition: boolean;
    createdAt: string;
  };
}

export type DisputeCategory =
  | "KLAIM_DEPOSIT_SEPIHAK"
  | "MOBIL_MOGOK_KENDALA_MESIN"
  | "MOBIL_TIDAK_SESUAI_SPESIFIKASI"
  | "BIAYA_DEREK_DAN_KOMPENSASI";

export type DisputeStatus =
  | "MENUNGGU_VERIFIKASI_MEDIASI"
  | "INVESTIGASI_BUKTI"
  | "PUTUSAN_MEDIASI"
  | "DANA_DICAIRKAN";

export interface DisputeTimelineEvent {
  id: string;
  timestamp: string;
  actor: "PENYEWA" | "MITRA" | "MEDIATOR_DRIVEO";
  title: string;
  description: string;
  attachmentUrls?: string[];
}

export interface DisputeTicket {
  id: string;
  ticketCode: string;
  bookingId: string;
  bookingCode: string;
  vehicleName: string;
  vehicleThumbnail: string;
  rentalName: string;
  category: DisputeCategory;
  description: string;
  claimedAmount: number;
  demands: string;
  renterEvidenceUrls: string[];
  partnerEvidenceUrls?: string[];
  status: DisputeStatus;
  createdAt: string;
  timeline: DisputeTimelineEvent[];
  mediatorVerdict?: {
    decidedAt: string;
    mediatorName: string;
    renterRefundAmount: number;
    rentalPayoutAmount: number;
    reasoning: string;
  };
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  category: "TRANSAKSI" | "OPERASIONAL" | "KEAMANAN" | "SENGKETA";
  timestamp: string;
  isRead: boolean;
  linkUrl: string;
}

export interface NotificationPreference {
  whatsappTransaction: boolean;
  whatsappReminder: boolean;
  whatsappPromo: boolean;
  emailReceipt: boolean;
  emailContract: boolean;
  emailNewsletter: boolean;
  pushWebOrder: boolean;
  pushWebSecurity: boolean;
}

export type BusinessEntityType = "PT" | "CV" | "PERORANGAN" | "KOPERASI";
export type MitraVerificationStatus =
  | "DRAF"
  | "MENUNGGU_VERIFIKASI"
  | "TERVERIFIKASI"
  | "BUTUH_PERBAIKAN";

export interface MitraProfile {
  id: string;
  businessName: string;
  legalEntityName: string;
  entityType: BusinessEntityType;
  establishedYear: number;
  slogan: string;
  district: string;
  city: string;
  address: string;
  garageCoordinates?: string;
  operatingHours: string;
  emergencyPhone24h: string;
  whatsappCommercial: string;
  picName: string;
  picPhone: string;
  picNik: string;
  nibNumber: string;
  kbliCode: string;
  nibFileUrl?: string;
  ktpPicFileUrl?: string;
  garagePhotoUrl?: string;
  npwpNumber?: string;
  npwpFileUrl?: string;
  verificationStatus: MitraVerificationStatus;
  submittedAt?: string;
  verifiedAt?: string;
  contractSignedAt?: string;
  contractAuditHash?: string;
}

export type CalendarBlockSource =
  | "DRIVEO_BOOKING"
  | "OFFLINE_WHATSAPP"
  | "BENGKEL_MAINTENANCE"
  | "INTERNAL_USE";

export interface CalendarBlock {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  rentalId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  source: CalendarBlockSource;
  title: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  bookingId?: string;
  createdAt: string;
}

export type StaffRole = "STAFF_OPERASIONAL" | "STAFF_KEUANGAN";
export type StaffStatus = "AKTIF" | "MENUNGGU_AKTIVASI" | "NONAKTIF";

export interface StaffMember {
  id: string;
  rentalId: string;
  rentalName: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  invitedAt: string;
  joinedAt?: string;
  lastActiveAt?: string;
  avatarUrl?: string;
}



