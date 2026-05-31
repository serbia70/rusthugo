// Decap CMS GitHub OAuth - auth endpoint
module.exports = async function handler(req, res) {
  const { provider, site_id, scope } = req.query;

  if (provider !== 'github') {
    res.status(400).send('Only GitHub provider is supported');
    return;
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('OAUTH_CLIENT_ID not configured');
    return;
  }

  const redirectUri = `https://${site_id}/api/callback`;
  const githubUrl = 'https://github.com/login/oauth/authorize' +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope || 'repo,user'}`;

  res.writeHead(302, { Location: githubUrl });
  res.end();
};
