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
      const errMsg = encodeURIComponent(tokenData.error_description || tokenData.error);
      res.writeHead(302, { Location: `/admin/#error=${errMsg}` });
      res.end();
      return;
    }

    const token = tokenData.access_token;
    const data = JSON.stringify({ token: token, provider: 'github' });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html>
<html><head><title>授权成功</title></head><body>
<p style="text-align:center;margin-top:40px;font-family:sans-serif;">授权成功，正在跳转...</p>
<script>
(function() {
  var data = ${JSON.stringify(data)};
  // Decap CMS expected format: authorization:<provider>:success:<data>
  window.opener.postMessage('authorization:github:success:' + JSON.stringify(data), '*');
  setTimeout(function() { window.close(); }, 500);
})();
</script>
</body></html>`);
  } catch (err) {
    res.writeHead(302, { Location: `/admin/#error=${encodeURIComponent('服务器错误: ' + err.message)}` });
    res.end();
  }
};
