// Decap CMS GitHub OAuth - callback endpoint
module.exports = async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    const msg = encodeURIComponent('授权失败：缺少 code 参数');
    res.writeHead(302, { Location: `/admin/#error=${msg}` });
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
      const msg = encodeURIComponent(`GitHub 认证失败：${tokenData.error_description || tokenData.error}`);
      res.writeHead(302, { Location: `/admin/#error=${msg}` });
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html>
<html><body>
<script>
(function() {
  window.opener.postMessage({
    type: 'authorization',
    provider: 'github',
    token: '${tokenData.access_token}'
  }, '*');
  window.close();
})();
</script>
<p>授权成功，窗口即将关闭...</p>
</body></html>`);
  } catch (err) {
    const msg = encodeURIComponent('服务器错误：' + err.message);
    res.writeHead(302, { Location: `/admin/#error=${msg}` });
    res.end();
  }
};
