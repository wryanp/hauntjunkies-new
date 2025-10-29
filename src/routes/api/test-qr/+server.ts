import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as QRCode from 'qrcode';

export const GET: RequestHandler = async () => {
	try {
		console.log('[TEST] QRCode type:', typeof QRCode);
		console.log('[TEST] QRCode.toDataURL type:', typeof QRCode.toDataURL);

		const testUrl = 'https://hauntjunkies.com/test';
		const qrCode = await QRCode.toDataURL(testUrl, {
			width: 200,
			margin: 2,
			color: {
				dark: '#000000',
				light: '#FFFFFF'
			}
		});

		return json({
			success: true,
			qrCodeLength: qrCode.length,
			qrCodePrefix: qrCode.substring(0, 50)
		});
	} catch (error) {
		console.error('[TEST] Error:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		}, { status: 500 });
	}
};
