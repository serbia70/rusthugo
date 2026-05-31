// Decap CMS GitHub OAuth - callback endpoint
module.exports = async function handler(req, res) {
  const { code } = req.query;
  if (!code) { res.end('no code'); return; }

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
    const data = await tokenRes.json();
    const token = data.access_token;
    if (!token) { res.end('no token: ' + JSON.stringify(data)); return; }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!doctype html><html><body>
<div id="status">授权成功，正在跳转...</div>
<script>
(function() {
  var t = '${token}';
  var msg = 'authorization:github:success:' + JSON.stringify({token:t,provider:'github'});
  var status = document.getElementById('status');

  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(msg, '*');
    status.textContent = '已发送 - opener 存在';
  } else {
    status.textContent = 'opener 不存在，直接跳转';
    window.location.href = '/admin/';
  }
  setTimeout(window.close, 2000);
})();
</script></body></html>`);
  } catch (err) { res.end('error: ' + err.message); }
};
