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
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
      res.writeHead(302, { Location: `/admin/#error=${encodeURIComponent(tokenData.error_description || tokenData.error || 'no token')}` });
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html>
<html><body>
<script>
(function() {
  var TOKEN = '${token}';
  var msg = 'authorization:github:success:' + JSON.stringify({token: TOKEN, provider: 'github'});

  // Send to opener every 200ms for 2 seconds
  var count = 0;
  var interval = setInterval(function() {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(msg, window.location.origin);
      window.opener.postMessage(msg, '*');
      count++;
    }
    if (count >= 10) {
      clearInterval(interval);
      window.close();
    }
  }, 200);
})();
</script>
<p>授权成功，窗口即将关闭...</p>
</body></html>`);
  } catch (err) {
    res.writeHead(302, { Location: `/admin/#error=${encodeURIComponent('Server error: ' + err.message)}` });
    res.end();
  }
};
