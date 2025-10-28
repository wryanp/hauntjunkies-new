import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import ical from 'ical-generator';
import { createHmac } from 'crypto';
import { logEmailError, logError } from './logger';

// Validate API key before initializing Resend client
if (!RESEND_API_KEY || RESEND_API_KEY === 'your_resend_api_key') {
	throw new Error('RESEND_API_KEY is not configured. Please set it in your .env file.');
}

// Validate email from address
if (!RESEND_FROM_EMAIL) {
	throw new Error('RESEND_FROM_EMAIL is not configured. Please set it in your .env file.');
}

const resend = new Resend(RESEND_API_KEY);

interface TicketData {
	confirmationNumber: string;
	firstName: string;
	lastName: string;
	email: string;
	date: string;
	startTime?: string;
	endTime?: string;
	tickets: number;
	specialRequests?: string;
}

function generateConfirmationNumber(): string {
	// Generate format: MCM-YYYYMMDD-XXXX (MCM = McCloud Manor)
	const date = new Date();
	const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
	const random = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `MCM-${dateStr}-${random}`;
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

function formatTime(timeString: string): string {
	if (!timeString) return '';
	return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

function generateCalendarInvite(ticketData: TicketData): string {
	const calendar = ical({ name: 'McCloud Manor Ticket' });

	const eventDate = new Date(ticketData.date);
	const startTime = ticketData.startTime || '20:00:00'; // Default 8 PM
	const endTime = ticketData.endTime || '23:00:00'; // Default 11 PM

	const startDateTime = new Date(`${ticketData.date}T${startTime}`);
	const endDateTime = new Date(`${ticketData.date}T${endTime}`);

	calendar.createEvent({
		start: startDateTime,
		end: endDateTime,
		summary: 'McCloud Manor',
		description: `Your tickets for McCloud Manor!\n\nTickets: ${ticketData.tickets}\n\nAddress: 2100 Carlysle Park Lane, Lawrenceville, GA 30044\n\nParking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.\n\nMore info: https://hauntjunkies.com/mccloudmanor#faq`,
		location: '2100 Carlysle Park Lane, Lawrenceville, GA 30044',
		url: 'https://hauntjunkies.com/mccloudmanor'
	});

	return calendar.toString();
}

function createCustomerEmailHTML(ticketData: TicketData): string {
	const dateFormatted = formatDate(ticketData.date);
	const timeStr = ticketData.startTime && ticketData.endTime
		? `${formatTime(ticketData.startTime)} - ${formatTime(ticketData.endTime)}`
		: 'See details below';

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>Your McCloud Manor Tickets</title>
	<style type="text/css">
		@font-face {
			font-family: 'Karma';
			src: url('data:font/truetype;charset=utf-8;base64,AAEAAAAQAQAABAAARFNJRwAAAAEAADk0AAAACEdQT1OX2Zc4AAA4mAAAAJxPUy8yLpYrVAAAAYgAAABgY21hcALEBPYAAAJgAAABSGN2dCAAUAJGAAAFbAAAAA5mcGdtBlmcNwAAA6gAAAFzZ2FzcAAAABAAADiQAAAACGdseWbqgPiBAAAFfAAALZBoZWFkGEXDNQAAAQwAAAA2aGhlYQOwAWsAAAFEAAAAJGhtdHgjkP/lAAAB6AAAAHhsb2NhmIqOagAAMwwAAAA+bWF4cAItAmYAAAFoAAAAIG5hbWWkI4ZGAAAzTAAABNpwb3N0oQk7KgAAOCgAAABmcHJlcAVN0C4AAAUcAAAATgABAAAAAQAAugM2iV8PPPUAGwPoAAAAANuPCygAAAAA3AF1u//l/1sBoQIUAAAABgACAAAAAAAAAAEAAAHE/1gAZAH0/+UAAAGhAAEAAAAAAAAAAAAAAAAAAAAeAAEAAAAeAI4ABAAAAAAAAQAAAAAACgAAAgAB1wAAAAAABAE5AZAABQAEAooCWAAAAEsCigJYAAABXgAyASwAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAICAgIADAAAAAWgHE/1gAZALuAPoAAAABAAAAAAFOAhQAAAAgAAIB9AAAAAAAAAD6AAAAlgAAATsAAAE+AAABPQAAAJcAAAE8AAABKgAAAT4AAAEoAAABPgAAAT4AAAEeAAABMwAAATUAAAFKAAABjQAAAVL/5QE9AAABKwAAAUUAAAFBAAABMwAAAT0AAAE+AAABLwAAAckAAAE0AAAAAAADAAAAAwAAANwAAQAAAAAAHAADAAEAAADcAAYAwAAAAAAAWwABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAMAAsACgAIAA4AFgAEAAcAGAAPAA0AEgARAAUACQAXABAAFAATABkAGgAcAB0AGwAVAAQAbAAAAAoACAACAAIAAAANACAAWv//AAAAAAANACAAQf//AAH/9f/jAAAAAQAAAAAAAAAEAAAABgAMAAsACgAIAA4AFgAEAAcAGAAPAA0AEgARAAUACQAXABAAFAATABkAGgAcAB0AGwAVuAAALEu4AAlQWLEBAY5ZuAH/hbgARB25AAkAA19eLbgAASwgIEVpRLABYC24AAIsuAABKiEtuAADLCBGsAMlRlJYI1kgiiCKSWSKIEYgaGFksAQlRiBoYWRSWCNlilkvILAAU1hpILAAVFghsEBZG2kgsABUWCGwQGVZWTotuAAELCBGsAQlRlJYI4pZIEYgamFksAQlRiBqYWRSWCOKWS/9LbgABSxLILADJlBYUViwgEQbsEBEWRshISBFsMBQWLDARBshWVktuAAGLCAgRWlEsAFgICBFfWkYRLABYC24AAcsuAAGKi24AAgsSyCwAyZTWLBAG7AAWYqKILADJlNYIyGwgIqKG4ojWSCwAyZTWCMhuADAioobiiNZILADJlNYIyG4AQCKihuKI1kgsAMmU1gjIbgBQIqKG4ojWSC4AAMmU1iwAyVFuAGAUFgjIbgBgCMhG7ADJUUjISMhWRshWUQtuAAJLEtTWEVEGyEhWS0AuAAAKwC6AAEAAQACKwG6AAIAAQACKwG/AAIATwBBADIAJAAaAAAACCsAvwABAG4AWgBGADIAGgAAAAgrALoAAwACAAcruAAAIEV9aRhEAAAACgAyAEYAAAAAAhQAAAAAAAEAAAAAARICFABKAQy4AAArALgAAEVYuAAVLxu5ABUABT5ZuAAARVi4ACQvG7kAJAAFPlm4AABFWLgAAC8buQAAAAM+WbgAAEVYuAA7Lxu5ADsAAz5ZugAcAAAAFRESOboAQQAAABUREjkBuABLL7gAHy+4AEsQuAAE0LgABC+4AAfQuAAHL7gABBC4AA3QuAANL7gABBC4ABDQuAAEELgARdy4ABnQuAAZL7gARRC4ABvQuAAfELgAK9y4ACjQuAAoL7oAHAAHACgREjm4ACsQuAAt0LgALS+4ACsQuAAz0LgAMy+4ACsQuAA10LgAKxC4ADjQuAA4L7gAHxC4AEDQugBBAAcAKBESObgARRC4AEfQuABHLzAxMTU+AT0BNCcuASc+ATc+AT0BNCYnNTMVBgcGHQE+ATc1NCYnNTMVBgcGHQEUFx4BFw4BBwYdARQXFhcVIzU+AT0BDgEHFRQXFhcVDAgCAgsCAgsCAQEIDG8IBwYULxwKC24HBgcDAgoCAgoCAwcGB24LCh4yDwYHCBMHIwycAwgEFAMEEwQDBQOZDSIIExMFDg8VsREeCHoMJAcTEwQPDhaZBQYEEwQDFAQGBZwVDg8EExMHIwzJDC8TexQPDgUTAAAAAgAAAAABFQIUAEIAVAEQuAAAKwC4AABFWLgAHi8buQAeAAU+WbgAAEVYuAAhLxu5ACEABT5ZuAAARVi4AD0vG7kAPQADPlm4AABFWLgAPy8buQA/AAM+WbgAR9y4AB4QuABP3AG4AFUvuABLL7gAVRC4AAfQuAAHL7gABdC4AAUvuAAHELgACtC4AAovuAAHELgAENC4ABAvuAAHELgAE9C4AAcQuAAW0LgAFi+4AAcQuABD3LgAHtC4AB4vuABLELgAH9C4AB8vuABLELgANty4ACjQuAAoL7gANhC4ACrQuAA2ELgALdC4AC0vuAA2ELgAM9C4ADMvuAA2ELgAONC4ADgvuABLELgAP9C4AD8vuABDELgAQNC4AEAvMDE1Njc+ATc2PQE0Jy4BJz4BNz4BPQE0Jy4BJyYnNzY7ATIXFh8BBgcGBwYdARQXHgEXDgEHBh0BFBcWFwcGBwYrASInNxQXFjsBMjY1ETQmKwEiBwYVBQUCAwIDAgIKAgIKAgEBAwIDAgUFHhchaBEODgweBQUEAwQDAgoCAgoCAwQFDB4LDw4RaCIWPAsMEREUExIVEREMCz4HCQUIBQsMbgMIBBQDBBMEAwUDbA0KBQkECQckGgcGDSQHCQYMCQ5sBQYEEwQDFAQGBW4OCRMPIw4GBxtGFQ0MHBIBUhMcDA0WAAAAAgAAAAABFAIUAEUAUAEzuAAAKwC4AABFWLgAGS8buQAZAAU+WbgAAEVYuAA0Lxu5ADQAAz5ZuAAARVi4AEQvG7kARAADPlm4ABkQuAAY3LgAG9C6ADwANAAZERI5ugBGADQAGRESOboATQA0ABkREjkBuABRL7gABBC4AALQuAACL7gABBC4AAfQuAAHL7gABBC4AA3QuAANL7gABBC4AA/QuAAEELgAGNxBAwCgABgAAV1BAwAwABgAAV1BAwBAABgAAV24ABvcuAAYELgAO9xBAwAwADsAAV1BAwBAADsAAV1BAwCgADsAAV24AC/cuAAj0LgALxC4ACbQuAAmL7gALxC4ACzQuAAsL7gALxC4ADHQuAAxL7oAPAAYABsREjm4AAQQuABA3LgARtC4ADsQuABJ0LoATQAYABsREjkwMTU2NzY9ATQnLgEnPgE3Nj0BNCc1NzYnJiM1MxUiBwYfARUGHQEUFx4BFw4BBwYdARQXFhcVIzU+Az0BDgEHFRQWFxUjEz4BNzU0LwEHBhUIBgcDAgoCAgoCAws7BgMEEK0NBQYHOwsDAgoCAgoCAwYIBm4GCAQCHzIOCAxvWxMwHAkmJwkTBQ4OFZwFBgQUAwQTBAYFKBMQE1UJCwkTEwkKClUTEBMoBQYEEwQDFAQGBZwUDw8EExMDDRAQBrUOMhJjDCMHEwEDESAIORAPODgPEAAAAAABAAAAAABuAhQALABCuAAAKwC4AABFWLgAFC8buQAUAAU+WbgAAEVYuAApLxu5ACkAAz5ZAboAJQACAAMruAACELgADtC4ACUQuAAZ0DAxNzY9ATQnLgEnPgE3PgE9ATQnJic1MxUOAR0BFBceARcOAQcGHQEUFhcVIzU2DgYCAgsCAgsCAQEGCAZuDAgDAQoDAwoBAwgMbgYmDxScAwgEFAMEEwQDBQOZFQ8PBBMTCCINmQUGBBMEAxQEBgWcDCMHExMEAAAAAAEAAAAAAQkCFABZALy4AAArALgAAEVYuAABLxu5AAEABT5ZuAAARVi4AEYvG7kARgADPlm6ADwAPQADK7oAIQAzAAMrugAPAEYAARESObgAARC4ABrcuABGELgANdwBugA1AEsAAyu6AAMAFwADK7gAAxC4AAfQuAAHL7oADwBLAAMREjm4ADUQuAAf0LoAKQAXAAMREjm4ACkvuAAq3LgAKRC4ACzQuAAXELgAOtC4AAMQuAA80LgAAxC4AEXQuABLELgAVtAwMRE1IRUHBhQXFAcOAQcOAQc1PgE3PgE3NS4BJyMGBwYdATMyNz4BNz4BNTMVIzQnLgEnJisBFTMyNzY9ATMVDgEHBhceARcVITU+AT0BNCYvAT4BNz4BPQE0JgEJAwwNCgULBw8gEQEKAQMEAQIQExsMCQtUAgYDBAIFBg0NAwMJBQYCVDkSCgtPCQgCAgEBDwT+9wwIAQEOAgoCAQEIAgETEwMPJw8JCwcNCA8cDRICFQIHCwUkEhcCAwkNFosCAgICAwcGbAUEBQYCAroMCxg6EgcVCwwNEyECExMHIwyaAwUEHAQTBAMFA5oMIwAAAgAAAAABFQIUAEUAVwC/uAAAKwC4AABFWLgAAS8buQABAAU+WbgAAEVYuAAELxu5AAQABT5ZuAAARVi4AC0vG7kALQADPlm4AAQQuABT3LgAVNABuABYL7gATi+4AALQuAACL7gAThC4ABLcuABYELgAM9C4ADMvuAAk3LgAJ9C4ACcvuAAkELgAKtC4ACovuAAzELgAMdC4ADEvuAAzELgANtC4ADYvuAAzELgAQNC4AEAvuAAzELgAQtC4AE4QuABQ0LgAJBC4AFTQMDERNTMyFx4BFx4DMQYHDgEdARQHBgcOAQcOAQcGBw4BBwYHFRQWFx4BFxYXFSM1Njc2PQE0JzQuAjU0PgI1Nj0BNCYXNjczNjc+ATc9AS4BKwEVPgG+EQ4HCgUBCwwKBQUFBQgCAggXCAIXBQ8LEBYICQUBAQECAQYIbgkGBQIFBAUFBAUCCGAOEAENCggPAQISEzkDDQIBEwcCCAUBDA8MBwkIFwo1EBACBAwQBAILAggKDBYJCgl6BgsFBAYDDgUTEwQQERGcAwYCCAoIAQEICgkBBgOZDSLTCwkHCgkbEzYBERjLAgwAAAACAAAAAAEVAhQAKwA1AMS4AAArALgAAEVYuAAALxu5AAAABT5ZuAAARVi4AAMvG7kAAwAFPlm4AABFWLgAFC8buQAUAAM+WbgAAEVYuAAWLxu5ABYAAz5ZuAAs3LgAAxC4ADTcuAA10AG4ADYvuAAwL7gAAdC4AAEvuAAwELgADdy4AArQuAAKL7gADRC4AA/QuAAPL7gAMBC4ABbQuAAWL7gANhC4ABvQuAAbL7gAHtC4AB4vuAAbELgAJNC4ACQvuAAbELgAJ9C4ABsQuAAs3DAxETMyFxYfAQYHBgcGFREUFxYXBwYHBisBNT4BPQE0Jy4BJz4BNz4BPQE0JicTMzI2NRE0JisBvhEODgweBQUEAwQEBQweCw8OEb4MCAICCgICCgIBAQgMWjkUExIVOQIUBwYNJAcJBgwJDv7aDgkTDyMOBgcTByMMnAMIBBQDBBMEAwUDmQ0iCP4yHBIBUhMcAAEAAAAAAQkCFABcAGi4AAArALgAAEVYuAAmLxu5ACYABT5ZuAAARVi4AFkvG7kAWQADPlm6AE8AUAADK7oANABZACYREjm4ACYQuABA3LgAWRC4AEjcAboARQAIAAMruAAIELgAGdC4AAgQuAAd0LgAHS8wMTU+ATc+ATc2PQE0JicuAzEwPgI3PgE9ATQmNS4BJy4BJzc2OwEVBwYUFxQHDgEHDgEHNT4BNz4BNzUmJyYrASIGFREUFjsBMjc2PQEzFQ4BBwYXHgEXFSMiJwIGAgIDAgMBAQEEBQMDBQQBAQEDAgMCAgYCHhcisgMODwoFCwcPIBEBCgEDBAEBCgwQEhQTExQSEgoLTwkIAgIBAQ8EsiIXPgQHBQUIBQsMbAMFBAIICgcHCgkCAwUDcQQMAgUJBAUHBCQaEwMRLxEHDQcNCA8bDhMCFAIHCwUwFAsMHBP+rhMcDAsYOhIHFQsMDRMhAhMbAAQAAAAAARUCFAA4AEsAXwBhAOe4AAArALgAAEVYuAAALxu5AAAABT5ZuAAARVi4AAIvG7kAAgAFPlm4AABFWLgAGi8buQAaAAM+WboADwAaAAAREjm4ADrcuAAAELgAXtwBuABiL7gAPy+4AADQuAAAL7gAPxC4ABXcuAAK0LoADwA/ABUREjm4AD8QuAAa0LgAGi+4AGIQuAA00LgANC+4AB7QuAAeL7gANBC4ACDQuAAgL7gANBC4ACPQuAAjL7gANBC4AC3QuAAtL7gANBC4AC/QuAAvL7gANBC4AF/cuAA50LgAPxC4AFfQuAA/ELgAWtC4AFovMDETMhcWHwEGBw4BHQEUBwYHFhceAR0BFBcHBisBNTY3Nj0BNCc0LgI1ND4CNTY1PAEmNDU0Jic1ExUzMjc2PQE0Jy4BJyYnBgcOASc+AzczPgM1NCY1NCcmKwEXNbUSEhIMHgUFBQUIDRILCQcMFB4VJL0JBQYCBQUFBQUFAgEIDFo5EQwLCAIHBAUFGhUEDQIBDQ8QBAEDDxEMAQsKEjkxAhQHBg0kBwkIFwo1EBAWDQcLCRsUZCAZIxsTBQ8PE5wDBgIICggBAQgKCQEGAwEoMzILDSIIE/6vkAwNFXEPCwMHAwQEERcFD1IBCgsLAwIKEhwSCxwFGAsMqAEAAAEAAAAAARUCFABMAFC4AAArALgAAEVYuAAALxu5AAAABT5ZuAAARVi4ADAvG7kAMAADPlm4ABHcugAhADAAABESOQG6ABEANgADK7gAERC4AAXQuAA2ELgAR9AwMREzFQ4BHQEUFx4BFw4BBwYdATMyNzY3NDU2NCcmJy4BJzUWFx4BFx4DFQcGFhcVITU2NzY9ATQnLgEnLgEnPgE3PgE3Nj0BNCcmJ24MCAMBCgMDCgEDRRIKCgEBAQEHAQoBDxIIEAcDCwwIAg4CD/7rBggGAgECAQIHAQEHAgECAQIFBgkCFBMIIg2ZBQYEEwQDFAQGBbIMChMKCAcOAggPAhQCEwwPCA0IAwwPDQUCESoPExMEDw8UnAMGAwUDAw0CAg4CAwUDBgOZERIQBAAAAAABAAAAAAEJAhQASgB2uAAAKwC4AABFWLgAES8buQARAAU+WbgAAEVYuABGLxu5AEYAAz5ZugAwAEAAAyu6AB8ARgARERI5uAARELgAKdwBugBCAAAAAyu6ADYANQADK7gAABC4AAzQugAfAAAANhESObgAQhC4AC7QuAA1ELgAONAwMTc1NCYnLgEnPgE3Nj0BNCYnNSEVDgEXMxQHDgEHDgEHNT4BNzY3NS4BKwEGBwYdATMyNz4BNTMVIzQnJicmJyYrARUUFhcVIzU+ARQBAQIKAgIKAgIIDAEJDgINAQoFCwcPIBEBCgEHAQIREhsMCQtOAgYGDg0NAwIFBgQGAk4IDG4MCEmaAwUEAxMEBBMECAOcDCMHExMNJw4JCwcNCA8cDRICFQINCR8RGgMJDRaLAgMLCGsGAwMFBAECpAwjBxMTByMAAQAA/1sBFAIUAFgAlbgAACsAuAAARVi4ABEvG7kAEQAFPlm4AABFWLgAHy8buQAfAAU+WbgAAEVYuABULxu5AFQAAz5ZugAZAE0AAyu6ACwATQAZERI5AboATwAAAAMrugAyAEUAAyu4AAAQuAAM0LgATxC4ABfQugAmAEUAMhESObgAJi+4AB7cuAAyELgANdC4ADUvugAsAAAANRESOTAxNzU0Jy4BJz4BNz4BPQE0Jic1MxUGBwYdATMyNz4BPQEzFQYHBh0BDgEHDgEHFhceARURFBYVFhceAR0BJicmJy4BJy4BJxE0JicmJyYrARUUFxYXFSM1PgEUAgILAgILAgEBCAxvCAYHCAsPFxxbCAYHAQIDBR0eFhIPGQICBAILCg4GBAkSCAYLBQsICw4QFA8HBghvDAhJnAMIBBMEBBMDBAUDmQ0iCBMTBQ4OFpcFCysajBMFDg4WLQgXCBcwCwYOCygg/voFEwIKDQIVARMJCQYDCA0IBgwFAQkNGwoNCAi5Fg0OBRMTByIAAAIAAP9bARcCFABjAHYBC7gAACsAuAAARVi4AAEvG7kAAQAFPlm4AABFWLgABC8buQAEAAU+WbgAAEVYuABLLxu5AEsAAz5ZugAdAEsAARESObgABBC4AHXcuAB20AG4AHcvuAA3L7gAAtC4AAIvuAA3ELgAI9y4AArQuAAKL7gAIxC4ABLQugAdADcAIxESObgAIxC4ACbQuAAmL7gAIxC4ADHQuAAxL7gAdxC4AFHQuABRL7gAQty4AEXQuABFL7gAQhC4AEjQuABIL7gAURC4AE/QuABPL7gAURC4AFTQuABUL7gAURC4AF7QuABeL7gAURC4AGDQuABCELgAZNC4ADcQuABv0LgAby+4ADcQuABx0LgAcS8wMRE1MzIXHgEXHgEXFhcVBgcOAR0BFAcGBw4BBw4BBx4DFREUFhcVFhceARcWFBcVJzUmJy4BJxE0JyYnDgEHBgcVFBYXHgEXFhcVIzU2NzY9ATQnNC4CNTQ+AjU2PQE0Jhc+ATc2Nz4BNz4BNz0CLgErAb4SDQcKBQELBgcJBQUFBQgCAggXCAIFAgkVEgwBAQIFAQkBAQEYBAYQHA4TCREOEwcHBQEBAQIBBghuCQYFAgUEBQUEBQIITgMFAwYBCA0IFRsBAhITOQIBEwcCCAUBDAcJCgEHCQgXCjUQEAIEDBAEAgECBA8XIBb++gUKBQYLDAIRAgEBARMSAQIGDBoOAQkcFgwKCxQICQh6BgwFAwYDDgUTEwQQERGcAwYCCAoIAQEICgkBBgOZDSLiAgYCBAEGCAULJxcxAgMRGQAAAAABAAAAAAEhAhQAPQEAuAAAKwC4AABFWLgAAC8buQAAAAU+WbgAAEVYuAAILxu5AAgABT5ZuAAARVi4AB8vG7kAHwADPlm4AABFWLgAJi8buQAmAAM+WboAAQAfAAAREjm6ACEAHwAAERI5AbgAPi+4AAEvuAA+ELgALNC4ACwvuAAi3LgAANC4AAAvuAABELgAGdy4AAzQuAAML7gAGRC4AA7QuAAZELgAEdC4ABEvuAAZELgAF9C4ABcvuAAZELgAHNC4ABwvuAABELgAINC4ACAvuAAsELgAKtC4ACovuAAsELgAL9C4AC8vuAAsELgANdC4ADUvuAAsELgAN9C4ACwQuAA60LgAOi8wMRsBNTQuAic1MxUGBwYdARQXHgEXDgEHBh0BFBcWFxUjAxUUFhcVIzU2NzY9ATQnLgEnPgE3Nj0BNCcmJzVZbgIECAZuBggGAwIKAgIKAgMGCAZYbggMbwgGBwMCCgICCgIDBwYIAhT+uvwGEBAOAxMTBA8PFZkFBgQTBAMUBAYFnBQPDwQTAUb9DCMHExMFDg4VnAUGBBQDBBMEBgWZFg4OBRMAAAAAAQAAAAABZQIUAEIApbgAACsAuAAARVi4AAEvG7kAAQAFPlm4AABFWLgABC8buQAEAAU+WbgAAEVYuAAdLxu5AB0AAz5ZuAAARVi4ACUvG7kAJQADPlm4AABFWLgALS8buQAtAAM+WboAAwAdAAEREjm6ACQAHQABERI5ugAnAB0AARESOQG6ACgAMwADK7oAFwAjAAMrugADADMAFxESObgAFxC4AAvQuAAzELgAPtAwMRE1MxsBMxUOAx0BFBceARcOAQcGHQEUHgIXFSM1Njc2NREDIwMRFBcWFxUjNTY3Nj0BNCcuASc+ATc2PQE0JyZZWFxYBggEAgICCgICCgICAgQIBm4GCAZeFV4GCAZOCAYHAwIKAgIKAgMHBgIBE/69AUMTAw4QEAaZBwQEEwQDFAQEB5wGEBANAxMTBA8PFAER/qYBWv7vFA8PBBMTBQ4OFZwFBgQUAwQTBAYFmRYODgAB/+UAAAE9AhQAWgBmuAAAKwC4AABFWLgAAC8buQAAAAU+WbgAAEVYuAApLxu5ACkAAz5ZugANACkAABESObgAABC4ABjcuAA70LgAPNC6AEoAKQAAERI5AboAJQAuAAMruAAlELgAGdC4AC4QuAA60DAxARUHBhQXFAcOAQcOAQc1PgE3PgE3NS4BKwEVFBceARcOAQcGHQEUFhcVIzU+AT0BNCcuASc+ATc+AT0BIyIHBgcUHQEeARceARcVLgEnLgEnLgM1NjQvATUBPQMODwkFDAcPIBEBCgEDBAECERIVAwIKAgIKAgMIDG4MCAICCwICCwIBARUOCwkCAQQDAQoBCBAJCBAHAwwKCA8PAwIUEwMRLxEGDgcNCA8bDhMCFAIHCwUwERqxBQYEEwQDFAQGBZwMIwcTEwcjDJwDCAQUAwQTBAMFA7EMCRYMChoFCwcCFAITBg0HCA4IAw0NDgURLxEDEwABAAAAAAEUAhQAeAFWuAAAKwC4AABFWLgAAC8buQAAAAU+WbgAAEVYuAA4Lxu5ADgAAz5ZugATADgAABESObgAABC4ACLcugBPADgAABESObgAOBC4AFvcAbgAeS+4AFwvuAAA0LgAAC+4AFwQuAA03LgAB9C4AAcvuAA0ELgACdC4AAkvuAA0ELgADdC4AA0vuABcELgAGdC4ABkvuABcELgAHdC4AB0vuAB5ELgAcNC4AHAvuAAk3LgANBC4ACfQuAAnL7gANBC4ACjQuAAoL7gANBC4ADHQuAAxL7gAJBC4ADnQuAA5L7gAcBC4AELQuABCL7gAcBC4AETQuABEL7gAcBC4AEbQuABGL7gAcBC4AEnQuABJL7gAcBC4AEvQuABLL7gAJBC4AFbQuABWL7gAXBC4AGDQuABgL7gAcBC4AGPQuABjL7gAcBC4AGXQuABlL7gAcBC4AG7QuABuLzAxEzIfAQYHBgcGHQEeARcUHgIdAS4BJy4BJyY1Nj0BNCcmKwEVFB8CFhcWFxYVDgEHBh0BFBYXFSMiLwE+ATc+ATc2NTQ1NjQnJicuASc1HgEXFhUGHQEUFxY7ATU8AScmLwEmJyYnJicmNT4BNzY9ATQmJy4BJzW8IhceBQUEAwQBBQIEBQQIEQkRIA0LEQsMETcchAgFAwYBAwIGBQcIDLwhFx8DBgICAwIDAQEBBwEKAhowFwsSDAsRNwIDDY4CBgYCAwQDAgcEBwcJAQIBAhQaJAcJBgwJDkAFCwcBBwgHARMGDQgMHBEMCAcTFhYNDFElGXAIBQYIBAYFAggFCg1KDCMHExsjBAcFBQgFCwwVEg8aAgkNAhUCExMqFw4HBxIoFwsMYQkRCBAMcAEGCAMECAgDAwcFCg05CyIHAQEBEwAAAAEAAAAAAQMCFABDAEm4AAArALgAAEVYuAALLxu5AAsABT5ZuAAARVi4ACsvG7kAKwADPlm4ABDcugAgACsACxESObgACxC4ADDcugBAACsACxESOTAxEzY1NjQnNDU0Jic1IRUGBwMzPgEvATQ3PgE3PgE3PgE3FQ4BBwYHFRQWFxUhNTY3EyMHBhYXFAcOAQcOAQcOAQc1PgEMBwEBBg0BAwgGmzoMBAsBCwUOCAgSCQoQCAEKAQcBCAz+/QgGmzoFDgEOCwYOCAgRCQoQCAEKAWQOCAIaDxEVDSEIExMFDv5FDSMPAgYOBg4ICA0ICA0GEwIUAg8IUQwjBxMTBQ4BvAQNJA0GDgYOBwgOCAgNBhMCFQAAAAABAAAAAAEdAhQAYQEOuAAAKwC4AABFWLgAHi8buQAeAAU+WbgAAEVYuABbLxu5AFsAAz5ZugBLAEoAAyu6ACwAWwAeERI5uAAeELgAONy4AFsQuABA3LgAShC4AE3QAbgAYi+4AEIvuABiELgABdC4AAUvuAAD0LgAAy+4AAUQuAAI0LgACC+4AAUQuAAO0LgADi+4AAUQuAAR0LgABRC4ABXQuAAVL7gABRC4AD3cuAAe0LgAHi+4AEIQuABW3LgAIdC4ACEvuABWELgAJNC4ACQvuABWELgAJtC4ACYvugAsAAMAJBESObgAQhC4ADPQuAAzL7gAQhC4AETQuABEL7gAVhC4AFTQuABUL7gAPRC4AFzQuABcLzAxNz4BNzY9ATQnLgEnPgE3PgE9ATQmNS4BJy4BJzc2OwEVBwYUFxQHDgEHDgEHNT4BNz4BNzUmJyYrASIGFREUFjsBNzQnJicmJyYjNTMVIgcGBw4BBwYdARQWFxUjIi8BPgEKAgMCAwICCgICCgIBAQICBAICBgIeFyKyAw4PCgULBw8gEQEKAQMEAQEKDBASFBMTFDkBAwEFAwYEB38HBAMGAgICAggMviIXHgIGTgUIBQsMbgMIBBQDBBMEAwUDeAIHAgUJBAUHBCQaEwMRLxEHDQcNCA8bDhMCFAIHCwUwFAsMHBP+rhIcsQQGBQYFAwQPDwQCBgMFAwQGmwwjBxMbIwQHAAAAAAIAAP+wARgCFABaAH0BK7gAACsAuAAARVi4AAMvG7kAAwAFPlm4AABFWLgABi8buQAGAAU+WbgAAEVYuABALxu5AEAAAz5ZuABg3LoAawBAAAMREjm4AAMQuAB53AG4AH4vuAB0L7gAfhC4AEfQuABHL7gAXNy4AAPQuAADL7gAdBC4AATQuAAEL7gAdBC4AB/cuAAP0LgADy+4AB8QuAAS0LgAHxC4ABXQuAAVL7gAHxC4ABvQuAAbL7gAHxC4ACLQuAAiL7gAHxC4ACXQuAAlL7gAHxC4ACnQuAApL7gAHxC4ADTQuAA0L7gAdBC4AEDQuABAL7gAXBC4AEHQuABBL7gARxC4AEvQuABLL7gARxC4AFHQuABRL7gARxC4AFPQuABHELgAVtC4AFYvugBrAFYAKRESOTAxETc2OwEyFxYfAQ4BBw4BBw4BHQEUFx4BFw4BBw4BHQEUFhcWFwcVFBYVFhceAzEVLgEnLgEnLgEvAS4BJyYnIyIvAT4BPQE0JicuASc+ATc2PQE0Jy4BJyYXERQXFjsBNTQmJzQmJyYxNR4BFxYXHgEXNRE0JyYrASIHBh4VI2gSDg4LHwMGAgIDAgIBAgIKAwMKAgEBAgEHCxMCAgQBBAUDBQwHAgUDCRIIAQMHAwQEZyMVHgkLAQECCgICCgICAwIDAgVVDAsRCgIBDAUCBQwHBgQJEggMChIREQsMAdYjGwcFDyMEBwUFCQUFBQZzAwgDEwQEFAMEBQJ1AQ4CFA4WGwUTAgsLAQgJBxMFCQUCBAIIDggBAggDBAQbIwsfD28CBQQDFAQEEwMIA20NCQUJBQkc/q0WDAwEBRMCBx8FBBMFCQUEBAgNCAYBUxYMDAwMAAAAAQAAAAABCwIUAEsAbbgAACsAuAAARVi4ACkvG7kAKQAFPlm4AABFWLgARS8buQBFAAM+WbgAAEVYuABHLxu5AEcAAz5ZugAIAEcAKRESObgAE9wBugA6ABgAAyu4ABgQuAAj0LgAOhC4AC7QuAA6ELgAPNC4ADwvMDE3NiYnND4CNxUOAQcOAQcVFBY7ATI3Nj0BNCcuASc+ATc2PQE0JyYnNTMVDgEdARQXHgEXDgEHBh0BFBceARceARcHBgcGKwEiLwEEDwEPFyAhCQEKAQMEARIUExIKDAMCCgICCgIDBwYIbwwIAgIKAgIKAgIDAQMCAgYDHgsTEhJUIhceRBQyFAodHhwHEwIUAgcLBWMRHQwMFoQFBgQUAwQTBAYFmRYODgUTEwgiDZkHBAQTBAMUBAQHbgwLBQgFBQcEIw4GBxsjAAAAAAEAAAAAARQCFABBAOi4AAArALgAAEVYuAAALxu5AAAABT5ZuAAARVi4AAwvG7kADAAFPlm4AABFWLgAJC8buQAkAAM+WbgAAEVYuAAmLxu5ACYAAz5ZuAAG3AG4AEIvuAALL7gAQhC4ADHQuAAxL7gAAty4AAsQuAAe3LgAENC4ABAvuAAeELgAEtC4AB4QuAAV0LgAFS+4AB4QuAAb0LgAGy+4AAsQuAAm0LgAJi+4AAIQuAAn0LgAJy+4ADEQuAAv0LgALy+4ADEQuAA00LgANC+4ADEQuAA60LgAOi+4ADEQuAA80LgAMRC4AD/QuAA/LzAxETMRFBcWOwEyNzY1ETMVBgcGHQEUFx4BFw4BBwYdARQWFwcGBwYrASIvATY3PgE3Nj0BNCcuASc+ATc2PQE0JyYnWwsLEBISCgtaBggGAwIKAgIKAgMMCB0NDQ4RZyEYHgUFAgQCAwMCCgICCgIDBwYIAhT+TRgKDAwKGAGzEwQPDxWZBQYEEwQDFAQGBW4SGQ4jDwUHGyMHCQUIBQsMbgUGBBQDBBMEBgWZFg4OBQAAAAABAAAAAAEVAhQASwD5uAAAKwC4AABFWLgAAC8buQAAAAU+WbgAAEVYuAASLxu5ABIABT5ZuAAARVi4AC8vG7kALwADPlm6AAgALwAAERI5uAAu3LgAMdABuABML7gAOhC4AAXcuAA6ELgAMNxBAwBAADAAAV24AAvcQQMAQAALAAFdugAIADAACxESObgAI9y4ABfQuAAjELgAGtC4ABovuAAjELgAINC4ACAvuAAjELgAJtC4ACYvuAALELgALNC4ACwvuAAwELgAL9y4AAUQuAAz0LgAMy+4ADoQuAA90LgAPS+4ADoQuABD0LgAQy+4ADoQuABF0LgAOhC4AEjQuABILzAxExUOARURFB8BNzY1ETQuAic1MxUOAR0BFBceARcOAQcGHQEUFhcWFxUHBhcWMxUjNTI3Ni8BNT4BPQE0Jy4BJz4BNzY9ATQnJic1bwwICScmCQIECAZvCwoDAgoCAgoCAwEBAwZIBwQED5EPBAQHSAcEAwIKAgIKAgMHBggCFBMIIg3+1RAPOTkPEAErBhAQDgMTEwckDJkFBgQTBAMUBAYFIwUMBQ0HE1UKCQoTEwoJClUTCRYLIwUGBBQDBBMEBgWZFg4OBRMAAAEAAAAAARUCFAAvAP+4AAArALgAAEVYuAAALxu5AAAABT5ZuAAARVi4ABIvG7kAEgAFPlm4AABFWLgAIC8buQAgAAM+WboACQAgAAAREjkBuAAwL7gAKhC4ACbcQQMAjwAmAAFdQQMAoAAmAAFduAAA0LgAAC+4ACoQuAAG3LgAA9C4AAMvuAAmELgACNC4AAgvuAAmELgADNxBAwCPAAwAAV1BAwCgAAwAAV26AAkAJgAMERI5uAAmELgAHNy4AArQuAAKL7gADBC4AA/QuAAPL7gAHBC4ABHQuAARL7gADBC4ABjcuAAMELgAH9C4AB8vuAAGELgAIdC4ACEvuAAGELgAJNC4ACQvMDETFQYHBh0BFB8BNzY9ATQnJic1MxUOAR0BFBcHFRQWFxUjNTY3Nj0BJzY9ATQmJzVvCAcGCicmCgYIB28MCAtfCgtuBwYHXwsIDAIUEwUODxVwEg05OQ0ScBUPDwQTEwgiDVUcGXt8DCMHExMEDw4VfHsZHFUNIggTAAAAAQAAAAABoQIUAI0B17gAACsAuAAARVi4AAAvG7kAAAAFPlm4AABFWLgAKC8buQAoAAU+WbgAAEVYuABTLxu5AFMABT5ZuAAARVi4AG8vG7kAbwADPlm4AABFWLgAci8buQByAAM+WboAEwBvAAAREjm6AD0AbwAAERI5uABvELgAbty6AHEAbwAAERI5uAB00AG4AI4vuAB8ELgAENy4AATQuAAQELgAB9C4AAcvuAAQELgADdC4AA0vuAB8ELgAFtxBAwB/ABYAAV1BAwAQABYAAV1BAwDgABYAAV26ABMAfAAWERI5uAAZ0LgAGS+4ABYQuAAf0LgAHy+4ABYQuAAh0LgAFhC4ADrcuAAs0LgALC+4ADoQuAAu0LgAOhC4ADHQuAAxL7gAOhC4ADfQuAA3L7gAFhC4AEDcQQMAfwBAAAFdQQMAEABAAAFdQQMA4ABAAAFdugA9ABYAQBESObgAQ9C4AEMvuABAELgATNC4AEwvuABAELgATtC4AEAQuABl3LgAWNC4AGUQuABc0LgAXC+4AGUQuABi0LgAYi+4ADoQuABw0LgAcC+6AHEAFgA6ERI5uAAWELgActC4AHIvuAB8ELgAf9C4AH8vuAB8ELgAhdC4AIUvuAB8ELgAiNAwMRMVDgEdARQXHgEXDgEHBh0BFB8BNzY9ATQnLgEnPgE3Nj0BNC4CJzUzFQYHBh0BFBceARcOAQcGHQEUHwE3Nj0BNCcmJyYnPgE3Njc2PQE0Jic1MxUOAR0BFBYXHgEXDgEHBh0BFBYXFQcGFxYzFSMnByM1Mjc2LwE1Nj0BNCcuASc+ATc+AT0BNCYnNW4MCAMBCgMDCgEDCSEgCgMCCgICCgIDAgUIBm4HBgcDAQoDAwoBAwkhIQkDAQUDBQIEAgUBAwgMbgwIAQECCgMDCgICBQY7CAYEDnglJHgMBgUHOwsCAgsCAgsCAQEIDAIUEwgiDZkFBgQTBAMUBAYFRhAPOTkRDkYFBgQUAwQTBAYFmQYQEA4DExMEDw4WmQUGBBMEAxQEBgVGEA85OQ8QRgUGBwYHBwQHBAUHBgWZDSIIExMIIg2ZAwUDBBMEAxQECAMnCBkFE1ULCAoTPDwTCgoJVRMNGScDCAQUAwQTBAMFA5kNIggTAAABAAAAAAEVAhQAVwC0uAAAKwC4AABFWLgAFy8buQAXAAU+WbgAAEVYuAAqLxu5ACoABT5ZuAAARVi4AEMvG7kAQwADPlm4AABFWLgAVi8buQBWAAM+WQG4AFgvuAAkL7gAWBC4AAPQuAADL7gAEtC4AAMQuABR3LgAG9C4ABsvuABRELgAHdC4ACQQuAAn0LgAJy+4ACQQuAAw3LgAPtC4ACQQuABH0LgARy+4ACQQuABJ0LgAURC4AFPQuABTLzAxNT4BPQE0Jz4DNy4DJzY9ATQmJzUzFQYHBh0BFB8BNzY9ATQnJic1MxUOAR0BFBcOAwceAxcGHQEUFhcVIzU2NzY9ATQvAQcGHQEUFxYXFSMMCAsFFBcUBQQTFxUGCwgMbwgHBgonJgoGCAdvDAgLBhUWEwQFExcUBQsIDG8HCAYKJicKBgcIbxMHIww8FxYGGRsYBgUXGxoHFhc7DSIIExMFDg8VUw8KMDAKD1MVDw8EExMIIg07FxYHGhsXBQYYGxkGFhc8DCMHExMEDw8UVA8LLy8LD1QUDw4FEwAAAAAAAAAAAAAAAADuAfAC/ANgBDwFGAXKBn4HeggSCLYJfgqsC4YMOAzsDkAOzA/eESYRyhKeE4YUShX4FsgAAAAAABcBGgABAAAAAAAAADYAAAABAAAAAAABAAUANgABAAAAAAACAAcAOwABAAAAAAADACsAQgABAAAAAAAEABIAbQABAAAAAAAFAA0AfwABAAAAAAAGABEAjAABAAAAAAAHADUAnQABAAAAAAAJAAwA0gABAAAAAAAKADYA3gABAAAAAAAMACQBFAADAAEECQAAAGwBOAADAAEECQABAAoBpAADAAEECQACAA4BrgADAAEECQADAFYBvAADAAEECQAEACQCEgADAAEECQAFABoCNgADAAEECQAGACICUAADAAEECQAHAGoCcgADAAEECQAJABgC3AADAAEECQAKAGwC9AADAAEECQAMAEgDYAADAAEECQARABgDqENvcHlyaWdodCCpIDIwMjAgYnkgQmxhY2tGb250TGFiLiBBbGwgUmlnaHRzIFJlc2VydmVkLkthcm1hUmVndWxhclZlcnNpb24gMS4wMDA7O0thcm1hLUZyZWVWZXJzaW9uOzIwMjA7Rkw3MTJLYXJtYSBGcmVlIFZlcnNpb25WZXJzaW9uIDEuMDAwS2FybWEtRnJlZVZlcnNpb25LYXJtYSBGb250cyBDb2xsZWN0aW9uIGlzIGEgdHJhZGVtYXJrIG9mIEJsYWNrRm9udExhYkJsYWNrRm9udExhYkNvcHlyaWdodCCpIDIwMjAgYnkgQmxhY2tGb250TGFiLiBBbGwgUmlnaHRzIFJlc2VydmVkLmh0dHBzOi8vd3d3LmJlaGFuY2UubmV0L2JsYWNrZm9udGxhYgBDAG8AcAB5AHIAaQBnAGgAdAAgAKkAIAAyADAAMgAwACAAYgB5ACAAQgBsAGEAYwBrAEYAbwBuAHQATABhAGIALgAgAEEAbABsACAAUgBpAGcAaAB0AHMAIABSAGUAcwBlAHIAdgBlAGQALgBLAGEAcgBtAGEAUgBlAGcAdQBsAGEAcgBWAGUAcgBzAGkAbwBuACAAMQAuADAAMAAwADsAOwBLAGEAcgBtAGEALQBGAHIAZQBlAFYAZQByAHMAaQBvAG4AOwAyADAAMgAwADsARgBMADcAMQAyAEsAYQByAG0AYQAgAEYAcgBlAGUAIABWAGUAcgBzAGkAbwBuAFYAZQByAHMAaQBvAG4AIAAxAC4AMAAwADAASwBhAHIAbQBhAC0ARgByAGUAZQBWAGUAcgBzAGkAbwBuAEsAYQByAG0AYQAgAEYAbwBuAHQAcwAgAEMAbwBsAGwAZQBjAHQAaQBvAG4AIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABCAGwAYQBjAGsARgBvAG4AdABMAGEAYgBCAGwAYQBjAGsARgBvAG4AdABMAGEAYgBDAG8AcAB5AHIAaQBnAGgAdAAgAKkAIAAyADAAMgAwACAAYgB5ACAAQgBsAGEAYwBrAEYAbwBuAHQATABhAGIALgAgAEEAbABsACAAUgBpAGcAaAB0AHMAIABSAGUAcwBlAHIAdgBlAGQALgBoAHQAdABwAHMAOgAvAC8AdwB3AHcALgBiAGUAaABhAG4AYwBlAC4AbgBlAHQALwBiAGwAYQBjAGsAZgBvAG4AdABsAGEAYgBGAHIAZQBlACAAVgBlAHIAcwBpAG8AbgAAAAIAAAAAAAD/nAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAEBAgADACsAMgAkACwAKAAzACcAJgAlAC8AKQAuADUAMQAwADcANgA9ACoANAAtADgAOQA8ADoAOwd1bmkwMDBEAAAAAQAB//8ADwABAAAACgAwAEoAAkRGTFQADmxhdG4AGgAEAAAAAP//AAEAAAAEAAAAAP//AAEAAQACa2VybgAOa2VybgAUAAAAAQAAAAAAAQAAAAEABAACAAgAAQAIAAEAOgAEAAAABAASABwAJgA0AAIABP/nAA3/+wACABP/yQAb/8kAAwAG//YADgAFABYAFAABAAcABQABAAQACQANAA4AEwAAAAEAAAAA') format('truetype');
			font-weight: normal;
			font-style: normal;
			font-display: swap;
		}
		:root {
			color-scheme: light only;
			supported-color-schemes: light only;
		}
		/* Force colors in dark mode - prevent email client overrides */
		@media (prefers-color-scheme: dark) {
			body { background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; color: #333333 !important; -webkit-text-fill-color: #333333 !important; }
			.email-wrapper { background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; }
			.email-container { background-color: #fffffe !important; background-image: linear-gradient(#fffffe, #fffffe) !important; }
			.header-bg { background-color: #000001 !important; background-image: linear-gradient(#000001, #000001) !important; border-bottom-color: #a41214 !important; }
			.brand-color { color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; }
			.ticket-count { color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; }
			.detail-bg { background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; }
		}
		/* Outlook dark mode prevention */
		[data-ogsc] body { background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; }
		[data-ogsc] .header-bg { background-color: #000001 !important; background-image: linear-gradient(#000001, #000001) !important; }
		[data-ogsc] .brand-color { color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; }
		@media only screen and (max-width: 600px) {
			.responsive-table {
				width: 100% !important;
			}
			.mobile-padding {
				padding: 20px !important;
			}
			.mobile-header-padding {
				padding: 30px 20px !important;
			}
			.mobile-font-xlarge {
				font-size: 48px !important;
			}
			.mobile-brand-title {
				font-size: 48px !important;
			}
			.mobile-font-large {
				font-size: 24px !important;
			}
			.mobile-font-medium {
				font-size: 16px !important;
			}
			.mobile-font-small {
				font-size: 14px !important;
			}
			.button-column {
				display: block !important;
				width: 100% !important;
				padding: 0 0 10px 0 !important;
			}
			.button-link {
				display: block !important;
				width: 100% !important;
				box-sizing: border-box !important;
			}
		}
	</style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important; color: #333333 !important; -webkit-text-fill-color: #333333 !important;">
	<table width="100%" cellpadding="0" cellspacing="0" class="email-wrapper" style="background-color: #f4f4f4 !important; background-image: linear-gradient(#f4f4f4, #f4f4f4) !important;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table width="600" cellpadding="0" cellspacing="0" class="responsive-table email-container" style="max-width: 600px; width: 100%; background-color: #fffffe !important; background-image: linear-gradient(#fffffe, #fffffe) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">

					<!-- Header -->
					<tr>
						<td align="center" class="mobile-header-padding header-bg" style="padding: 50px 40px 50px 40px; background-color: #000001 !important; background-image: linear-gradient(#000001, #000001) !important; border-bottom: 4px solid #a41214 !important; vertical-align: middle;">
							<h1 class="brand-color mobile-brand-title" style="margin: 28px 0 0 0; font-size: 110px; font-weight: 700; color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; font-family: 'Karma', 'Palatino Linotype', 'Book Antiqua', Palatino, 'Times New Roman', Georgia, serif; letter-spacing: 2px; text-transform: uppercase; text-align: center; line-height: 1.1;">
							MCCLOUD&nbsp;MANOR
						</h1>
						</td>
					</tr>

					<!-- Ticket Intro -->
					<tr>
						<td class="mobile-padding" style="padding: 40px 40px 30px 40px; text-align: center;">
							<h2 class="mobile-font-large" style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #000001 !important; -webkit-text-fill-color: #000001 !important;">Your Tickets Are Confirmed</h2>
							<p style="margin: 0 0 8px 0; font-size: 16px; color: #666666; line-height: 1.6;">
								We're excited to terrify you at McCloud Manor.
							</p>
							<p style="margin: 0; font-size: 16px; color: #666666; line-height: 1.6;">
								Please review your event details below.
							</p>
						</td>
					</tr>

					<!-- Event Details -->
					<tr>
						<td class="mobile-padding" style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0" class="detail-bg" style="background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; border-radius: 6px; overflow: hidden;">
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Guest Name</td>
												<td style="color: #000001 !important; -webkit-text-fill-color: #000001 !important; font-size: 16px; font-weight: 600; text-align: right;">${ticketData.firstName} ${ticketData.lastName}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Date</td>
												<td style="color: #000001 !important; -webkit-text-fill-color: #000001 !important; font-size: 16px; font-weight: 600; text-align: right;">${dateFormatted}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Time</td>
												<td style="color: #000001 !important; -webkit-text-fill-color: #000001 !important; font-size: 16px; font-weight: 600; text-align: right;">${timeStr}</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 24px;">
										<table width="100%" cellpadding="0" cellspacing="0">
											<tr>
												<td width="40%" style="color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">Tickets</td>
												<td class="ticket-count" style="color: #a41214 !important; -webkit-text-fill-color: #a41214 !important; font-size: 18px; font-weight: 700; text-align: right;">${ticketData.tickets} ${ticketData.tickets === 1 ? 'Ticket' : 'Tickets'}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Action Buttons -->
					<tr>
						<td class="mobile-padding" style="padding: 0 40px 30px 40px;">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td class="button-column" width="48%" style="padding-right: 2%;">
										<a href="https://www.google.com/maps/dir/?api=1&destination=2100+Carlysle+Park+Lane+Lawrenceville+GA+30044" class="button-link" style="display: block; background-color: #a41214 !important; background-image: linear-gradient(#a41214, #a41214) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											Get Directions
										</a>
									</td>
									<td class="button-column" width="48%" style="padding-left: 2%;">
										<a href="https://hauntjunkies.com/mccloudmanor#faq" class="button-link" style="display: block; background-color: #a41214 !important; background-image: linear-gradient(#a41214, #a41214) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 24px; border-radius: 4px; text-align: center; font-weight: 600; font-size: 14px;">
											View FAQ
										</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Important Info -->
					<tr>
						<td class="mobile-padding" style="padding: 0 40px 40px 40px;">
							<div style="background-color: #f9f9f9 !important; background-image: linear-gradient(#f9f9f9, #f9f9f9) !important; border-radius: 6px; padding: 28px 24px;">
								<h3 class="mobile-font-medium" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #000001 !important; -webkit-text-fill-color: #000001 !important;">Important Information</h3>
								<table width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="padding-bottom: 12px;">
											<p style="margin: 0; color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 14px; line-height: 1.6;">
												<strong style="color: #000001 !important; -webkit-text-fill-color: #000001 !important;">Parking:</strong> Parking is free but EXTREMELY limited! Please carpool or even Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<p style="margin: 0; color: #666666 !important; -webkit-text-fill-color: #666666 !important; font-size: 14px; line-height: 1.6;">
												<strong style="color: #000001 !important; -webkit-text-fill-color: #000001 !important;">Weather:</strong> Open rain or shine (line is not covered)
											</p>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>

					<!-- Footer -->
					<tr>
						<td align="center" class="mobile-padding" style="padding: 40px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
							<p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;">
								Questions? Contact us at <a href="mailto:hauntjunkies@gmail.com" style="color: #a41214; text-decoration: none; font-weight: 600;">hauntjunkies@gmail.com</a>
							</p>
							<p style="margin: 0 0 16px 0; font-size: 14px; color: #666666;">
								<a href="https://hauntjunkies.com/mccloudmanor" style="color: #a41214; text-decoration: none; font-weight: 600;">Visit McCloud Manor Website</a>
							</p>
							<p style="margin: 0; font-size: 12px; color: #999999;">
								© ${new Date().getFullYear()} Haunt Junkies. All rights reserved.
							</p>
						</td>
					</tr>

				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`;
}

function createEmailFailureAlertHTML(ticketData: TicketData, errorMessage: string): string {
	const dateFormatted = formatDate(ticketData.date);

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>Email Delivery Failure</title>
	<style type="text/css">
		:root { color-scheme: light only; }
		@media (prefers-color-scheme: dark) {
			body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; color: #fffffe !important; }
		}
		[data-ogsc] body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
	</style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #ff0000; border-bottom: 3px solid #ff0000; padding-bottom: 10px;">⚠️ URGENT: Email Delivery Failed</h1>

	<div style="padding: 20px; background-color: #330000; border: 2px solid #ff0000; border-radius: 5px; margin: 20px 0;">
		<p style="margin: 0; color: #ffcccc; font-size: 18px; font-weight: bold;">
			A customer purchased tickets but their confirmation email failed to send!
		</p>
	</div>

	<h2 style="color: #ff0000; margin-top: 30px;">Customer Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Guest Name:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.firstName} ${ticketData.lastName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Email:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.email}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Date:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${dateFormatted}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Number of Tickets:</td>
			<td style="padding: 8px; background-color: #333333; color: #ff0000; border: 1px solid #444; font-size: 18px; font-weight: bold;">${ticketData.tickets}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Confirmation #:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444; font-family: monospace;">${ticketData.confirmationNumber}</td>
		</tr>
	</table>

	<h2 style="color: #ff0000; margin-top: 30px;">Error Details</h2>
	<div style="padding: 15px; background-color: #2a2a2a; border-left: 4px solid #ff0000; margin-bottom: 20px; font-family: monospace; color: #ffcccc;">
		${errorMessage}
	</div>

	<div style="margin-top: 30px; padding: 20px; background-color: #330000; border-radius: 5px; border: 1px solid #ff0000;">
		<p style="margin: 0 0 10px 0; font-size: 16px; color: #ffffff; font-weight: bold;">
			⚠️ ACTION REQUIRED:
		</p>
		<p style="margin: 0; color: #ffcccc; font-size: 14px;">
			Please manually send a confirmation email to <strong>${ticketData.email}</strong> with their ticket details and confirmation number <strong>${ticketData.confirmationNumber}</strong>.
		</p>
	</div>

	<hr style="margin: 30px 0; border: none; border-top: 1px solid #444;">

	<p style="font-size: 12px; color: #666; text-align: center;">
		Sent from HauntJunkies Ticket System - Email Failure Alert
	</p>
</body>
</html>
`;
}

function createAdminEmailHTML(ticketData: TicketData): string {
	const dateFormatted = formatDate(ticketData.date);
	const timeStr = ticketData.startTime && ticketData.endTime
		? `${formatTime(ticketData.startTime)} - ${formatTime(ticketData.endTime)}`
		: 'Not specified';

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>New Ticket Request</title>
	<style type="text/css">
		:root { color-scheme: light only; }
		@media (prefers-color-scheme: dark) {
			body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; color: #fffffe !important; }
		}
		[data-ogsc] body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
	</style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #cc0000; border-bottom: 3px solid #cc0000; padding-bottom: 10px;">New Ticket Request</h1>

	<h2 style="color: #cc0000; margin-top: 30px;">Guest Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Guest Name:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.firstName} ${ticketData.lastName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Email:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${ticketData.email || 'Not provided'}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Date:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${dateFormatted}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Time:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${timeStr}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Number of Tickets:</td>
			<td style="padding: 8px; background-color: #333333; color: #cc0000; border: 1px solid #444; font-size: 18px; font-weight: bold;">${ticketData.tickets}</td>
		</tr>
	</table>

	<div style="margin-top: 30px; padding: 15px; background-color: #2a2a2a; border-radius: 5px; border: 1px solid #444;">
		<p style="margin: 0; font-size: 14px; color: #cccccc;">
			<strong style="color: #ffffff;">Next Steps:</strong> This request has been automatically confirmed and the customer has received their digital ticket via email.
		</p>
	</div>

	<hr style="margin: 30px 0; border: none; border-top: 1px solid #444;">

	<p style="font-size: 12px; color: #666; text-align: center;">
		Sent from HauntJunkies Ticket System
	</p>
</body>
</html>
`;
}

export async function sendTicketConfirmation(ticketData: TicketData) {
	const calendarInvite = generateCalendarInvite(ticketData);

	try {
		// Construct proper from field - Resend requires plain email or "Name <email>" format
		// Environment variable should be just the email address (e.g., "noreply@hauntjunkies.com")
		const fromEmail = `Haunt Junkies <${RESEND_FROM_EMAIL}>`;

		console.log(`Sending ticket confirmation email to: ${ticketData.email} from: ${fromEmail}`);

		// Send customer email with calendar attachment
		const customerEmailResult = await resend.emails.send({
			from: fromEmail,
			to: ticketData.email,
			subject: 'Your McCloud Manor Tickets',
			html: createCustomerEmailHTML(ticketData),
			attachments: [
				{
					filename: 'mccloud-manor-ticket.ics',
					content: calendarInvite
				}
			]
		});

		console.log('Customer email sent successfully:', {
			id: customerEmailResult.data?.id,
			to: ticketData.email,
			error: customerEmailResult.error
		});

		// Check if customer email failed
		if (customerEmailResult.error) {
			// Send urgent alert to admin about email failure
			try {
				await resend.emails.send({
					from: fromEmail,
					to: 'hauntjunkies@gmail.com',
					subject: `🚨 URGENT: Ticket Confirmation Email Failed - ${ticketData.email}`,
					html: createEmailFailureAlertHTML(ticketData, customerEmailResult.error.message)
				});
			} catch (alertError) {
				// Silently handle alert email failure
			}

			throw new Error(`Customer email failed: ${customerEmailResult.error.message}`);
		}

		// Send notification to admin
		const adminEmailResult = await resend.emails.send({
			from: fromEmail,
			to: 'hauntjunkies@gmail.com',
			subject: `New Ticket Request - ${new Date(ticketData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${ticketData.tickets} tickets)`,
			html: createAdminEmailHTML(ticketData)
		});

		console.log('Admin email sent successfully:', {
			id: adminEmailResult.data?.id,
			error: adminEmailResult.error
		});

		// Check if admin email failed
		if (adminEmailResult.error) {
			// Don't throw here - customer email succeeded, that's more important
			console.error('Admin email failed but customer email succeeded');
		}

		return { success: true, customerEmailId: customerEmailResult.data?.id };
	} catch (error) {
		return { success: false, error };
	}
}

interface CommentData {
	commentId: string;
	reviewName: string;
	reviewSlug: string;
	authorName: string;
	authorEmail: string;
	commentText: string;
	approvalToken: string;
}

/**
 * Generate HMAC signature for approval token
 * Must match the implementation in /api/comments/approve/+server.ts
 */
function generateApprovalHmac(token: string): string {
	const secret = SUPABASE_SERVICE_ROLE_KEY;
	return createHmac('sha256', secret)
		.update(token)
		.digest('hex');
}

function createCommentNotificationHTML(commentData: CommentData): string {
	const approvalUrl = `https://hauntjunkies.com/api/comments/approve`;
	const hmac = generateApprovalHmac(commentData.approvalToken);

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="color-scheme" content="light only">
	<meta name="supported-color-schemes" content="light only">
	<title>New Comment on Review</title>
	<style type="text/css">
		:root { color-scheme: light only; }
		@media (prefers-color-scheme: dark) {
			body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; color: #fffffe !important; }
			.button { background-color: #FC7403 !important; background-image: linear-gradient(#FC7403, #FC7403) !important; color: #fffffe !important; }
		}
		[data-ogsc] body { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
		[data-ogsc] .button { background-color: #FC7403 !important; background-image: linear-gradient(#FC7403, #FC7403) !important; }
	</style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; max-width: 600px; margin: 0 auto; padding: 20px;">
	<h1 style="color: #FC7403; border-bottom: 3px solid #FC7403; padding-bottom: 10px;">New Comment Submitted</h1>

	<h2 style="color: #FC7403; margin-top: 30px;">Review Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Review:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${commentData.reviewName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Review URL:</td>
			<td style="padding: 8px; background-color: #333333; border: 1px solid #444;">
				<a href="https://hauntjunkies.com/reviews/${commentData.reviewSlug}" style="color: #FC7403; text-decoration: none;">View Review</a>
			</td>
		</tr>
	</table>

	<h2 style="color: #FC7403; margin-top: 30px;">Comment Details</h2>
	<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold; width: 40%;">Author Name:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${commentData.authorName}</td>
		</tr>
		<tr>
			<td style="padding: 8px; background-color: #2a2a2a; color: #cccccc; font-weight: bold;">Author Email:</td>
			<td style="padding: 8px; background-color: #333333; color: #ffffff; border: 1px solid #444;">${commentData.authorEmail}</td>
		</tr>
	</table>

	<h2 style="color: #FC7403; margin-top: 30px;">Comment Text</h2>
	<div style="padding: 15px; background-color: #2a2a2a; border-left: 4px solid #FC7403; margin-bottom: 30px;">
		<p style="margin: 0; color: #cccccc; white-space: pre-wrap;">${commentData.commentText}</p>
	</div>

	<div style="margin-top: 30px; padding: 20px; background-color: #2a2a2a; border-radius: 5px; border: 1px solid #FC7403; text-align: center;">
		<p style="margin: 0 0 15px 0; font-size: 16px; color: #ffffff;">
			<strong>Quick Actions:</strong>
		</p>
		<div style="margin: 15px 0;">
			<!-- SECURITY: Using POST form instead of GET link to prevent CSRF attacks -->
			<form action="${approvalUrl}" method="POST" style="display: inline-block;">
				<input type="hidden" name="token" value="${commentData.approvalToken}" />
				<input type="hidden" name="hmac" value="${hmac}" />
				<button type="submit" class="button" style="display: inline-block; background-color: #FC7403 !important; background-image: linear-gradient(#FC7403, #FC7403) !important; color: #fffffe !important; -webkit-text-fill-color: #fffffe !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 5px; border: none; cursor: pointer;">
					✅ Approve Comment
				</button>
			</form>
		</div>
		<p style="margin: 15px 0 0 0; font-size: 14px; color: #cccccc;">
			Or manage comments in the <a href="https://hauntjunkies.com/admin/comments" style="color: #FC7403; text-decoration: none;">admin panel</a>
		</p>
		<p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
			⏰ This approval link expires in 7 days for security.
		</p>
	</div>

	<hr style="margin: 30px 0; border: none; border-top: 1px solid #444;">

	<p style="font-size: 12px; color: #666; text-align: center;">
		Sent from HauntJunkies Comment System
	</p>
</body>
</html>
`;
}

export async function sendCommentNotification(commentData: CommentData) {
	try {
		// Construct proper from field - Resend requires plain email or "Name <email>" format
		const fromEmail = `Haunt Junkies <${RESEND_FROM_EMAIL}>`;

		const result = await resend.emails.send({
			from: fromEmail,
			to: 'hauntjunkies@gmail.com',
			subject: `New Comment on "${commentData.reviewName}"`,
			html: createCommentNotificationHTML(commentData)
		});

		if (result.error) {
			throw new Error(`Email failed: ${result.error.message}`);
		}

		return { success: true };
	} catch (error) {
		return { success: false, error };
	}
}

export { generateConfirmationNumber };
