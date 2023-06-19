async function checkFileAvailability(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

export default checkFileAvailability