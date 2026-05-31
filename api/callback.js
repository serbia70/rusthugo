// Decap CMS GitHub OAuth - callback endpoint
module.exports = async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    res.writeHead(302, { Location: '/admin/#error=missing_code' });
    res.end();
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      res.writeHead(302, { Location: `/admin/#error=${encodeURIComponent(tokenData.error_description || tokenData.error)}` });
      res.end();
      return;
    }

    // Store token in sessionStorage AND postMessage
    // Then close the popup - Decap CMS reads from sessionStorage
    const token = tokenData.access_token;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html>
<html><body>
<script>
(function() {
  var TOKEN = '${token}';
  // Store for Decap CMS to read
  try { sessionStorage.setItem('decap-cms-github-token', TOKEN); } catch(e) {}
  try { localStorage.setItem('decap-cms-github-token', TOKEN); } catch(e) {}

  // Post to opener - try both formats
  if (window.opener && !window.opener.closed) {
    // Format 1: object (newer Decap CMS)
    window.opener.postMessage({type:'authorization', provider:'github', token: TOKEN}, '*');
    // Format 2: string (older Decap CMS / Netlify CMS)
    window.opener.postMessage('authorization:github:success:' + JSON.stringify({token:TOKEN,provider:'github'}), '*');
    // Format 3: Netlify CMS format
    window.opener.postMessage(JSON.stringify({type:'authorization', provider:'github', token:TOKEN}), '*');
  }

  // Close popup after a brief delay
  setTimeout(function() { window.close(); }, 300);
})();
</script>
</body></html>`);
  } catch (err) {
    res.writeHead(302, { Location: `/admin/#error=${encodeURIComponent('Server error: ' + err.message)}` });
    res.end();
  }
};
