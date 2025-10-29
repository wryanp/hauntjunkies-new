import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { randomBytes } from 'crypto';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface TicketPDFData {
	confirmationNumber: string;
	firstName: string;
	lastName: string;
	email: string;
	date: string;
	startTime: string;
	endTime: string;
	tickets: number;
	ticketRequestId: string;
}

function generateQRToken(): string {
	return randomBytes(32).toString('hex');
}

async function storeQRToken(ticketRequestId: string, qrToken: string): Promise<boolean> {
	console.log('[PDF] Storing QR token for ticket:', ticketRequestId);

	// Skip database storage for preview/dummy tickets
	if (ticketRequestId === '00000000-0000-0000-0000-000000000000') {
		console.log('[PDF] Preview mode - skipping database storage');
		return true;
	}

	const { error } = await supabase
		.from('ticket_qr_codes')
		.insert({
			ticket_request_id: ticketRequestId,
			qr_token: qrToken,
			expires_at: null
		});

	if (error) {
		console.error('[PDF] Error storing QR token:', error);
		return false;
	}

	console.log('[PDF] QR token stored successfully');
	return true;
}

export async function generateTicketPDF(ticketData: TicketPDFData): Promise<Buffer> {
	console.log('[PDF] Starting PDF generation for ticket:', ticketData.ticketRequestId);

	return new Promise(async (resolve, reject) => {
		try {
			// Generate QR code token and store it
			const qrToken = generateQRToken();
			const stored = await storeQRToken(ticketData.ticketRequestId, qrToken);

			if (!stored) {
				throw new Error('Failed to store QR token');
			}

			// Generate QR code image
			const qrValidationUrl = `https://hauntjunkies.com/api/validate-qr?token=${qrToken}`;
			console.log('[PDF] Generating QR code for URL:', qrValidationUrl);

			const qrCodeDataUrl = await QRCode.toDataURL(qrValidationUrl, {
				width: 300,
				margin: 2,
				color: { dark: '#000000', light: '#FFFFFF' }
			});

			// Convert base64 to buffer
			const qrImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

			// Fetch the McCloud Manor logo (PNG)
			const logoUrl = 'https://hauntjunkies.com/mccloudmanor-logo.png';
			const logoResponse = await fetch(logoUrl);
			const logoBuffer = Buffer.from(await logoResponse.arrayBuffer());

			// Create PDF document
			const doc = new PDFDocument({
				size: 'LETTER',
				margins: { top: 0, bottom: 0, left: 0, right: 0 }
			});

			const chunks: Buffer[] = [];
			doc.on('data', (chunk) => chunks.push(chunk));
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.on('error', reject);

			// Brand colors
			const hauntRed = '#a41214';
			const borderGray = '#e5e5e5';
			const textGray = '#666666';

			// Modern header with logo (compact)
			const headerHeight = 140;
			doc.rect(0, 0, 612, headerHeight).fill('#000000');

			// McCloud Manor Logo - as large as possible, centered
			const logoWidth = 600;
			const logoHeight = 130;
			const logoX = (612 - logoWidth) / 2;
			const logoY = (headerHeight - logoHeight) / 2;

			doc.image(logoBuffer, logoX, logoY, {
				fit: [logoWidth, logoHeight],
				align: 'center',
				valign: 'center'
			});

			// Main content area with better spacing
			let currentY = headerHeight + 25;

			// Modern success indicator with checkmark
			const checkSize = 40;
			const checkX = 612 / 2 - checkSize / 2;

			// Green circle background
			doc.circle(checkX + checkSize / 2, currentY + checkSize / 2, checkSize / 2).fill('#22c55e');

			// White checkmark
			doc.save();
			doc.lineWidth(3);
			doc.strokeColor('#ffffff');
			doc.moveTo(checkX + 12, currentY + 20);
			doc.lineTo(checkX + 18, currentY + 26);
			doc.lineTo(checkX + 28, currentY + 14);
			doc.stroke();
			doc.restore();

			currentY += checkSize + 15;

			// Title - modern, clean
			doc.fontSize(22)
				.fillColor('#000000')
				.font('Helvetica-Bold')
				.text('Tickets Confirmed', 50, currentY, { align: 'center', width: 512 });

			currentY += 25;

			// Modern card-based layout
			const pageWidth = 612;
			const cardWidth = 480;
			const cardLeft = (pageWidth - cardWidth) / 2;

			// Main ticket card with subtle shadow effect
			const cardStartY = currentY;
			const cardHeight = 340;

			// Card shadow (subtle)
			doc.save();
			doc.fillColor('#00000010');
			doc.roundedRect(cardLeft + 3, cardStartY + 3, cardWidth, cardHeight, 12).fill();
			doc.restore();

			// Card background
			doc.roundedRect(cardLeft, cardStartY, cardWidth, cardHeight, 12).fillAndStroke('#ffffff', '#e5e5e5');

			// Card content padding
			const cardPadding = 25;
			let cardY = cardStartY + cardPadding;

			// QR Code section with modern styling
			const qrSize = 110;
			const qrLeft = pageWidth / 2 - qrSize / 2;

			// QR code label
			doc.fontSize(9)
				.fillColor(textGray)
				.font('Helvetica')
				.text('SCAN AT ENTRY', qrLeft - 30, cardY, { width: qrSize + 60, align: 'center' });

			cardY += 18;

			// QR code with border - only stroke, no fill to avoid white box
			doc.roundedRect(qrLeft - 6, cardY - 6, qrSize + 12, qrSize + 12, 6).stroke('#e5e5e5');
			doc.image(qrImageBuffer, qrLeft, cardY, {
				width: qrSize,
				height: qrSize
			});

			cardY += qrSize + 12;

			// "One-time use" badge
			doc.fontSize(8)
				.fillColor(hauntRed)
				.font('Helvetica-Bold')
				.text('ONE-TIME USE ONLY', qrLeft - 30, cardY, { width: qrSize + 60, align: 'center' });

			cardY += 22;

			// Divider line
			doc.moveTo(cardLeft + cardPadding, cardY).lineTo(cardLeft + cardWidth - cardPadding, cardY).stroke('#e5e5e5');
			cardY += 20;

			// Event details - modern grid layout
			const detailsLeft = cardLeft + cardPadding;
			const detailsWidth = cardWidth - (cardPadding * 2);

			// Helper function for modern detail rows
			let detailY = cardY;
			const drawDetail = (label: string, value: string) => {
				// Label (small, gray)
				doc.fontSize(8).fillColor(textGray).font('Helvetica').text(label, detailsLeft, detailY);

				// Value (larger, bold, black)
				doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold').text(value, detailsLeft, detailY + 11, { width: detailsWidth });

				detailY += 32;
			};

			// Guest Name
			drawDetail('Guest Name', `${ticketData.firstName} ${ticketData.lastName}`);

			// Date
			const dateObj = new Date(ticketData.date + 'T00:00:00');
			const formattedDate = dateObj.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			});
			drawDetail('Date', formattedDate);

			// Time
			const formatTime = (time: string) => {
				const [hours, minutes] = time.split(':');
				const hour = parseInt(hours);
				const ampm = hour >= 12 ? 'PM' : 'AM';
				const displayHour = hour % 12 || 12;
				return `${displayHour}:${minutes} ${ampm}`;
			};
			const timeStr = `${formatTime(ticketData.startTime)} - ${formatTime(ticketData.endTime)}`;
			drawDetail('Time', timeStr);

			// Tickets
			const ticketStr = `${ticketData.tickets} Ticket${ticketData.tickets > 1 ? 's' : ''}`;
			drawDetail('Tickets', ticketStr);

			// Move current Y to below card
			currentY = cardStartY + cardHeight + 25;

			// Modern info cards section
			const infoCardWidth = 210;
			const infoCardHeight = 85;
			const infoCardGap = 20;
			const infoCardsLeft = (pageWidth - (infoCardWidth * 2 + infoCardGap)) / 2;

			// Address Card
			const addressCardLeft = infoCardsLeft;
			doc.roundedRect(addressCardLeft, currentY, infoCardWidth, infoCardHeight, 8).fillAndStroke('#f9fafb', '#e5e5e5');

			// Address card content
			let addressY = currentY + 12;
			doc.fontSize(9).fillColor(textGray).font('Helvetica-Bold').text('ADDRESS', addressCardLeft + 12, addressY);
			addressY += 16;
			doc.fontSize(9).fillColor('#000000').font('Helvetica-Bold').text('2100 Carlysle Park Lane', addressCardLeft + 12, addressY, { width: infoCardWidth - 24 });
			addressY += 12;
			doc.fontSize(9).fillColor('#000000').font('Helvetica').text('Lawrenceville, GA 30044', addressCardLeft + 12, addressY, { width: infoCardWidth - 24 });
			addressY += 18;

			// Get Directions button
			const buttonWidth = 100;
			const buttonHeight = 20;
			const buttonX = addressCardLeft + (infoCardWidth - buttonWidth) / 2;
			const buttonY = addressY;

			// Button background
			doc.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 4)
				.fillAndStroke(hauntRed, hauntRed);

			// Button text
			doc.fontSize(8)
				.fillColor('#ffffff')
				.font('Helvetica-Bold')
				.text('Get Directions', buttonX, buttonY + 6, {
					width: buttonWidth,
					align: 'center',
					link: 'https://maps.google.com/?q=2100+Carlysle+Park+Lane,+Lawrenceville,+GA+30044'
				});

			// Parking Card
			const parkingCardLeft = addressCardLeft + infoCardWidth + infoCardGap;
			doc.roundedRect(parkingCardLeft, currentY, infoCardWidth, infoCardHeight, 8).fillAndStroke('#f9fafb', '#e5e5e5');

			// Parking card content
			let parkingY = currentY + 12;
			doc.fontSize(9).fillColor(textGray).font('Helvetica-Bold').text('PARKING', parkingCardLeft + 12, parkingY);
			parkingY += 16;
			doc.fontSize(8).fillColor('#000000').font('Helvetica').text('Free but limited. Please carpool or Uber/Lyft if possible. Do not park in or block any of our neighbors driveways.', parkingCardLeft + 12, parkingY, {
				width: infoCardWidth - 24,
				lineGap: 1.5
			});

			currentY += infoCardHeight + 18;

			// Modern footer
			doc.fontSize(8)
				.fillColor(textGray)
				.font('Helvetica')
				.text('Questions? Email hauntjunkies@gmail.com or visit', 0, currentY, { align: 'center', width: 612 });

			currentY += 12;
			doc.fontSize(8)
				.fillColor(hauntRed)
				.font('Helvetica-Bold')
				.text('hauntjunkies.com/mccloudmanor', 0, currentY, {
					align: 'center',
					width: 612,
					link: 'https://hauntjunkies.com/mccloudmanor',
					underline: false
				});

			currentY += 12;
			doc.fontSize(7)
				.fillColor('#999999')
				.font('Helvetica')
				.text('© 2025 Haunt Junkies. All rights reserved.', 0, currentY, { align: 'center', width: 612 });

			// Finalize PDF
			doc.end();

			console.log('[PDF] PDF generation completed successfully');
		} catch (error) {
			console.error('[PDF] Error generating PDF:', error);
			reject(error);
		}
	});
}
