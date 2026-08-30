import https from 'https';

const shareLink = 'https://share.google/6dn2TfWTaIp8S4J4x';

function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(getUrl(res.headers.location));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

getUrl(shareLink).then(html => {
  console.log("Fetched HTML length:", html.length);
  // Match review quotes or text blocks
  const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log(textOnly.substring(0, 2000));
}).catch(console.error);
