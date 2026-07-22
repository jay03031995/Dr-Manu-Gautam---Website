import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { telHref } from "@/lib/utils";
import type { Location } from "@/sanity/lib/types";

interface LocationCardProps {
  location: Location;
  description?: string;
  bookHref?: string;
}

/** Shared clinic/location card — address, hours, phone, directions and booking.
 *  Used on treatment pages, the Contact page and location pages. */
export function LocationCard({ location, description, bookHref = "/appointment" }: LocationCardProps) {
  const fullAddress = [location.addressLine, location.city, location.postalCode].filter(Boolean).join(", ");
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress || location.name)}`;
  const isRealPhone = location.phone && !/x/i.test(location.phone);

  return (
    <div className="card-base card-shadow flex flex-col p-6">
      <h3 className="mb-1 text-lg font-semibold text-dark-navy">{location.name}</h3>
      {description && <p className="mb-4 text-sm text-dark-gray leading-relaxed">{description}</p>}
      <ul className="mb-6 space-y-2 text-sm text-charcoal">
        {fullAddress && (
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
            {fullAddress}
          </li>
        )}
        {location.hours?.map((h) => (
          <li key={h.days} className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
            {h.days}: {h.time}
          </li>
        ))}
        {location.phone && (
          <li className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
            {isRealPhone ? (
              <a href={telHref(location.phone)} className="hover:text-medical-blue">
                {location.phone}
              </a>
            ) : (
              <span className="text-dark-gray">{location.phone}</span>
            )}
          </li>
        )}
      </ul>
      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-base flex-1 border border-light-grey bg-white text-sm text-dark-navy hover:border-medical-blue"
        >
          Get Directions
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <Button href={bookHref} className="flex-1">
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
