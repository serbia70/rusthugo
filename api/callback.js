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

    // Pass token via URL hash AND postMessage (both methods)
    const token = tokenData.access_token;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html>
<html><head><title>授权成功</title></head><body>
<p style="text-align:center;margin-top:40px;font-family:sans-serif;">授权成功，正在跳转...</p>
<script>
(function() {
  var token = '${token}';
  // Method 1: postMessage to opener window
  if (window.opener) {
    window.opener.postMessage({
      type: 'authorization',
      provider: 'github',
      token: token
    }, window.location.origin);
    window.opener.postMessage({
      type: 'authorization',
      provider: 'github',
      token: token
    }, '*');
  }
  // Method 2: redirect opener
  setTimeout(function() {
    if (window.opener) {
      window.opener.location.href = '/admin/#access_token=${token}&provider=github';
      window.close();
    } else {
      window.location.href = '/admin/#access_token=${token}&provider=github';
    }
  }, 1000);
})();
</script>
</body></html>`);
  } catch (err) {
    res.writeHead(302, { Location: `/admin/#error=${encodeURIComponent('服务器错误: ' + err.message)}` });
    res.end();
  }
};
