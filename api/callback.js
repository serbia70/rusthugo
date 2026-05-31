// Decap CMS GitHub OAuth - callback with handshake protocol
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
    res.status(200).send(`<!doctype html><html><body><script>
(function() {
  var t = '${token}';
  var payload = JSON.stringify({token:t,provider:'github'});
  var successMsg = 'authorization:github:success:' + payload;

  function sendAuth() {
    if (!window.opener || window.opener.closed) return;
    // Step 1: send handshake
    window.opener.postMessage('authorizing:github', '*');
    // Step 2: wait for CMS reply, then send success
    var start = Date.now();
    var check = setInterval(function() {
      if (window.opener.closed) { clearInterval(check); return; }
      // After getting reply, send the real token
      window.opener.postMessage(successMsg, '*');
      if (Date.now() - start > 2000) {
        clearInterval(check);
        window.close();
      }
    }, 300);
    // Actually just send it quickly after handshake
    setTimeout(function() { window.opener.postMessage(successMsg, '*'); }, 100);
    setTimeout(function() { window.opener.postMessage(successMsg, '*'); }, 300);
    setTimeout(function() { window.opener.postMessage(successMsg, '*'); }, 600);
    setTimeout(function() { window.close(); }, 1500);
  }

  // Wait for page to fully load
  setTimeout(sendAuth, 200);
})();
</script></body></html>`);
  } catch (err) { res.end('error: ' + err.message); }
};
