const warsawTimeFormatter = new Intl.DateTimeFormat('pl-PL', {
	timeZone: 'Europe/Warsaw',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
});

export const getCurrentTime = () => {
	return warsawTimeFormatter.format(new Date());
}