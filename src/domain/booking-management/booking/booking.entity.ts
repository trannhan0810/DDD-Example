import type { BaseEntity, EntityId } from '@domain/base/base.entity';
import type { Venue } from '@domain/space-management/venue/venue.entity';
import type { AdditionalService } from '../additional-service/additional-service.entity';

export interface Booking extends BaseEntity {
  code: string;

  venueId: EntityId;
  startTime: Date;
  endTime: Date;
}

export interface BookingWithVenue extends Booking {
  venue: Venue;
}

export interface BookingWithAdditionService extends Booking {
  additionalServices: AdditionalService[];
}
