// Decap CMS GitHub OAuth - callback endpoint
module.exports = async function handler(req, res) {
  const { code, state } = req.query;

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

    const token = tokenData.access_token;

    // Redirect back to admin with token in hash
    res.writeHead(302, {
      Location: `/admin/#provider=github&token=${token}`
    });
    res.end();
  } catch (err) {
    res.writeHead(302, { Location: `/admin/#error=${encodeURIComponent('Server error: ' + err.message)}` });
    res.end();
  }
};
